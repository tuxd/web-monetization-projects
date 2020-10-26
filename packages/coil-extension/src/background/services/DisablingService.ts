import { injectable } from 'inversify'

import { FrameSpec } from '../../types/FrameSpec'

import { TabStates } from './TabStates'
import { BackgroundFramesService } from './BackgroundFramesService'

@injectable()
export class DisablingService {
  disabled: Record<string, boolean> = {}

  constructor(
    private framesService: BackgroundFramesService,
    private tabStates: TabStates
  ) {}

  /**
   * @return `true` if frame's stream needs disabling,
   *         `false` if frame's stream potentially needs enabling
   */
  updateUrlForFrame(frame: FrameSpec, url: string): boolean {
    const urlObject = new URL(url)
    const { href, origin } = urlObject
    return this.disabled[href] || this.disabled[origin]
  }

  isDisabled(
    frame: FrameSpec,
    paymentPointer: string,
    initiatingUrl: string
  ): boolean {
    return false
  }
}
