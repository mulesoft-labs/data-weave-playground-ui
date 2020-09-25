import { IDataweaveState, PreviewStatus } from 'dataweave/types';

const state: IDataweaveState = {
  pendingFetchPreviewRequest: false,
  previewOutput: null,
  previewStatus: PreviewStatus.SUCCESS,
  weaveTypes: {},
  logs: []
};

export default state;
