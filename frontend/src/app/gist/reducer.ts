import { loadPreset } from 'common/helpers';
import { IGistState } from './types';
import { GistAction } from './actions';

export const initialState: IGistState = loadPreset<IGistState>('gist') || {
  gistId: null
};

const reducer = (state: IGistState = initialState, action): IGistState => {
  const { type, payload } = action;

  switch (type) {
    case GistAction.FETCH_GIST_REQUEST_SUCCESS: {
      const { gistId } = payload as { gistId: string };
      return { ...state, gistId };
    }
    case GistAction.CREATE_GIST_REQUEST_SUCCESS: {
      const { gistId } = payload as { gistId: string };
      return { ...state, gistId };
    }
    default:
      return { ...state };
  }
};

export default reducer;
