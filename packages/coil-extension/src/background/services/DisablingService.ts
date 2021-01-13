import { inject, injectable } from 'inversify'
import { StorageService } from '@web-monetization/wext/services'

import { FrameSpec } from '../../types/FrameSpec'
import { DisablingControls } from '../../types/disabling'
import * as tokens from '../../types/tokens'
import { LocalStorageProxy } from '../../types/storage'
import { notNullOrUndef } from '../../util/nullables'

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
  onUrlChanged(frame: FrameSpec, url: string): void {
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
    // TODO: if disable rules apply, then apply enable or disable
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

  /**
   * TODO:
   * Upon changes, must check all open tabs/frames to see if they apply and
   * update the tab state accordingly.
   *
   * Disable payment pointer could potentially only disable the top level
   * payment pointer, but not iframes ?
   *
   */
  setDisabled(activeTab: number, controls: DisablingControls) {
    const prior: Array<{
      frame: FrameSpec
      streamId: string
      disabled: boolean
      href: string
      paymentPointer?: string
    }> = this.streams.getStreams().map(([streamId, stream]) => {
      const frame = this.assoc.getFrame(streamId)
      const disabled = this.tabStates.getFrameOrDefault(frame).disabled
      const paymentPointer = stream.getPaymentPointer()
      const href = notNullOrUndef(this.framesService.getFrame(frame)).href
      return {
        disabled,
        frame,
        streamId,
        paymentPointer,
        href
      }
    })

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

    const nowDisabled = Object.values(controls).some(Boolean)
    const nowEnabled = !nowDisabled
    if (wasDisabled && nowEnabled) {
      this.resume(topFrame)
    } else if (wasNotDisabled && nowDisabled) {
      this.pause(topFrame)
    }
  }

  isDisabled(frame: FrameSpec, paymentPointer: string) {
    const urlObject = new URL(
      notNullOrUndef(this.framesService.getFrame(frame)?.href)
    )
    const { href, origin } = urlObject
    // TODO: normalize
    if (this.disabled[paymentPointer]) {
      return true
    }
    if (this.disabled[href]) {
      return true
    }
    if (this.disabled[origin]) {
      return true
    }
  }
}