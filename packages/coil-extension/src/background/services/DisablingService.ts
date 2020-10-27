import { inject, injectable } from 'inversify'
import { StorageService } from '@web-monetization/wext/services'

import { FrameSpec } from '../../types/FrameSpec'
import { DisablingControls } from '../../types/disabling'
import * as tokens from '../../types/tokens'
import { LocalStorageProxy } from '../../types/storage'

import { TabStates } from './TabStates'
import { BackgroundFramesService } from './BackgroundFramesService'
import { Streams } from './Streams'
import { StreamAssociations } from './StreamAssociations'

/**
 * Events to handle:
 * - payment pointer changed (dynamic meta, could be empty)
 *      top vs child frames
 * - url changed (url and domain implied)
 *      top vs child frames
 * - disable url control changed
 * - disable domain control changed
 * - disable paymentPointer control changed
 */
@injectable()
export class DisablingService {
  disabled: Record<string, boolean> = {}
  private pause!: (frame: FrameSpec) => void
  private resume!: (frame: FrameSpec) => void

  constructor(
    private storageService: StorageService,
    @inject(tokens.LocalStorageProxy)
    private store: LocalStorageProxy,
    private streams: Streams,
    private assoc: StreamAssociations,
    private framesService: BackgroundFramesService,
    private tabStates: TabStates
  ) {
    this.framesService.on('frameChanged', ev => {
      if (ev.changed.href) {
        this.onUrlChanged(ev, ev.changed.href)
      }
    })
  }

  setPauseResume({
    pause,
    resume
  }: {
    pause: (frame: FrameSpec) => void
    resume: (frame: FrameSpec) => void
  }) {
    this.pause = pause
    this.resume = resume
  }

  /**
   * @return `true` if frame's stream needs disabling,
   *         `false` if frame's stream potentially needs enabling
   */
  onUrlChanged(frame: FrameSpec, url: string): boolean {
    const tab = frame.tabId
    const isTopFrame = frame.frameId === 0
    const urlObject = new URL(url)
    const { href, origin } = urlObject
    const urlDisabled = Boolean(this.disabled[href])
    const domainDisabled = Boolean(this.disabled[origin])

    if (isTopFrame) {
      const disabling = this.tabStates.get(tab).disabling
      disabling.disableDomain = domainDisabled
      disabling.disableUrl = urlDisabled
      this.tabStates.set(tab, { disabling })
    }

    return urlDisabled || domainDisabled
  }

  /**
   * Should be called immediately upon receipt of startWM / stopWM messaging
   * so as to set the tabStates
   */
  onPaymentPointerChanged(frame: FrameSpec, paymentPointer: string | null) {
    const tab = frame.tabId
    const isTopFrame = frame.frameId === 0
    const disabledPaymentPointer = paymentPointer
      ? Boolean(this.disabled[paymentPointer])
      : false
    if (isTopFrame) {
      const disabling = this.tabStates.get(tab).disabling
      disabling.disablePaymentPointer = disabledPaymentPointer
      this.tabStates.set(tab, { disabling })
    }
  }

  setDisabled(activeTab: number, controls: DisablingControls) {
    const wasDisabled = Object.values(
      this.tabStates.get(activeTab).disabling
    ).some(Boolean)
    const wasNotDisabled = !wasDisabled

    this.tabStates.set(activeTab, { disabling: controls })

    const frames = this.framesService.getFrames(activeTab)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const top = frames.find(f => f.top)!
    const topFrame = { tabId: activeTab, frameId: 0 }
    const streamForTop = this.assoc.getStreamId(topFrame)

    const paymentPointer = streamForTop
      ? this.streams.getStream(streamForTop).getPaymentPointer()
      : null

    const urlObject = new URL(top.href)
    const { href, origin } = urlObject
    this.disabled[href] = controls.disableUrl
    this.disabled[origin] = controls.disableDomain
    if (paymentPointer) {
      this.disabled[paymentPointer] = controls.disablePaymentPointer
    }

    if (streamForTop && top) {
      const nowDisabled = Object.values(controls).some(Boolean)
      const nowEnabled = !nowDisabled
      if (wasDisabled && nowEnabled) {
        this.resume(topFrame)
      } else if (wasNotDisabled && nowDisabled) {
        this.pause(topFrame)
      }
    }
  }
}
