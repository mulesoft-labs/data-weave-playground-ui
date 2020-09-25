import { IUIState, SideBarView, ToolBarTab } from 'ui/types';
import { loadPreset } from 'common/helpers';
import { UiAction } from 'ui/actions';

export const initialState: IUIState = loadPreset<IUIState>('project') || {
  selectedScript: '/scripts/main.dwl',
  selectedInput: '/inputs/payload.json',
  selectedView: SideBarView.LIST,
  selectedToolBarTab: ToolBarTab.LOG_VIEWER,
  isToolBarOpen: false,
  apiReferenceAnchor: null,
  isSavingProject: false,
  isDeploying: false,
  isDeployModalOpen: false,
  showDeploymentSuccess: false
};

const reducer = (state: IUIState = initialState, action): IUIState => {
  const { type, payload } = action;

  switch (type) {
    case UiAction.SELECT_INPUT: {
      const { path } = payload as { path: string };
      return { ...state, selectedInput: path };
    }

    case UiAction.SELECT_SCRIPT: {
      const { path } = payload as { path: string };

      return { ...state, selectedScript: path };
    }

    case UiAction.SELECT_VIEW: {
      const { path } = payload as { path: SideBarView };
      return { ...state, selectedView: path };
    }

    case UiAction.OPEN_TOOLBAR: {
      return { ...state, isToolBarOpen: true };
    }
    case UiAction.CLOSE_TOOLBAR: {
      return { ...state, isToolBarOpen: false };
    }

    case UiAction.SELECT_TOOLBAR_TAB: {
      const { tab } = payload as { tab: ToolBarTab };
      return { ...state, selectedToolBarTab: tab };
    }

    case UiAction.SET_API_REFERENCE_ANCHOR: {
      const { anchor } = payload as { anchor: string };
      return { ...state, apiReferenceAnchor: anchor };
    }

    case UiAction.SET_PENDING_SAVE: {
      const { isSavingProject } = payload as { isSavingProject: boolean };
      return { ...state, isSavingProject };
    }

    case UiAction.SET_DEPLOY_STATUS: {
      const { isDeploying } = payload as { isDeploying: boolean };
      return { ...state, isDeploying };
    }

    case UiAction.OPEN_DEPLOY_MODAL: {
      const { isDeployModalOpen } = payload as { isDeployModalOpen: boolean };
      return { ...state, isDeployModalOpen };
    }

    case UiAction.CLOSE_DEPLOY_MODAL: {
      const { isDeployModalOpen } = payload as { isDeployModalOpen: boolean };
      return { ...state, isDeployModalOpen };
    }

    case UiAction.SHOW_DEPLOY_SUCCESS: {
      const { show } = payload as { show: boolean };
      return { ...state, showDeploymentSuccess: show };
    }

    default: {
      return { ...state };
    }
  }
};

export default reducer;
