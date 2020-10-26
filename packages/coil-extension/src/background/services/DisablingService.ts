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
   * @return true if frame needs disabling
   */
  updateUrlForFrame(frame: FrameSpec): boolean {
    return false
  }

  isDisabled(
    frame: FrameSpec,
    paymentPointer: string,
    initiatingUrl: string
  ): boolean {
    return false
  }
}
