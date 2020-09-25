import { DataweaveAction } from './actions';
import { IDataweaveState, PreviewStatus, ILogEntry } from './types';
import { loadPreset } from 'common/helpers';

export const initialState: IDataweaveState = loadPreset<IDataweaveState>('dataweave') || {
  pendingFetchPreviewRequest: false,
  previewOutput: null,
  weaveTypes: { '/inputs/payload.json': '{| message: String |}' },
  previewStatus: PreviewStatus.SUCCESS,
  logs: []
};

const reducer = (state: IDataweaveState = initialState, action): IDataweaveState => {
  const { type, payload } = action;

  switch (type) {
    case DataweaveAction.PREVIEW_REQUEST:
      return { ...state, pendingFetchPreviewRequest: true };

    case DataweaveAction.PREVIEW_REQUEST_SUCCESS: {
      const { content } = payload as { content: string };
      return { ...state, previewOutput: content, previewStatus: PreviewStatus.SUCCESS };
    }

    case DataweaveAction.PREVIEW_REQUEST_FAILURE: {
      const { error } = payload as { error: string };
      return { ...state, previewOutput: error, previewStatus: PreviewStatus.ERROR };
    }

    case DataweaveAction.WEAVE_TYPES_REQUEST_SUCCESS: {
      const { path, type } = payload as { path: string; type: string };
      return { ...state, weaveTypes: { ...state.weaveTypes, [path]: type } };
    }

    case DataweaveAction.WEAVE_TYPES_REQUEST_FAILURE: {
      const { path } = payload as { path: string };
      return { ...state, weaveTypes: { ...state.weaveTypes, [path]: state.weaveTypes[path] || '{| |}' } };
    }

    case DataweaveAction.UPDATE_LOGS: {
      const { logs } = payload as { logs: ILogEntry[] };
      return { ...state, logs: [...logs] };
    }

    default:
      return { ...state };
  }
};

export default reducer;
