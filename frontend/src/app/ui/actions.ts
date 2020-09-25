import { SideBarView, ToolBarTab, NotificationLevel } from 'ui/types';
import { IAction, IStore } from 'common/types';
import { fetchPreview } from 'dataweave/actions';

export enum UiAction {
  SELECT_INPUT = '@UI:SELECT_INPUT',
  SELECT_SCRIPT = '@UI:SELECT_SCRIPT',
  SELECT_VIEW = '@UI:SELECT_VIEW',
  OPEN_TOOLBAR = '@UI:OPEN_TOOLBAR',
  CLOSE_TOOLBAR = '@UI:CLOSE_TOOLBAR',
  SELECT_TOOLBAR_TAB = '@UI:SELECT_TOOLBAR_TAB',
  SET_API_REFERENCE_ANCHOR = '@UI:SET_API_REFERENCE_ANCHOR',
  SET_PENDING_SAVE = '@UI:SET_PENDING_SAVE',
  NOTIFY = '@UI:MOTIFY',
  SET_DEPLOY_STATUS = '@UI:SET_DEPLOY_STATUS',
  OPEN_DEPLOY_MODAL = '@UI:OPEN_DEPLOY_MODAL',
  CLOSE_DEPLOY_MODAL = '@UI:CLOSE_DEPLOY_MODAL',
  SHOW_DEPLOY_SUCCESS = '@UI:SHOW_DEPLOY_SUCCESS'
}

export const selectView = (path: SideBarView): IAction => {
  return {
    type: UiAction.SELECT_VIEW,
    payload: {
      path
    }
  };
};

export const openToolBar = (): IAction => {
  return {
    type: UiAction.OPEN_TOOLBAR
  };
};

export const closeToolBar = (): IAction => {
  return {
    type: UiAction.CLOSE_TOOLBAR
  };
};

export const selectToolBarTab = (tab: ToolBarTab): IAction => {
  return {
    type: UiAction.SELECT_TOOLBAR_TAB,
    payload: {
      tab
    }
  };
};

export const setAPIReferenceAnchor = (anchor: string) => {
  return {
    type: UiAction.SET_API_REFERENCE_ANCHOR,
    payload: {
      anchor
    }
  };
};

export const goToAPIReference = (anchor: string) => dispatch => {
  dispatch(selectToolBarTab(ToolBarTab.API_REFERENCE));
  dispatch(setAPIReferenceAnchor(null)); // hack to refresh iframe
  dispatch(setAPIReferenceAnchor(anchor));
};

export const selectInput = (path: string): IAction => {
  return {
    type: UiAction.SELECT_INPUT,
    payload: {
      path
    }
  };
};

export const selectScript = (path: string) => dispatch => {
  dispatch({
    type: UiAction.SELECT_SCRIPT,
    payload: {
      path
    }
  });

  dispatch(fetchPreview());
};

export const setPendingSave = (status: boolean): IAction => {
  return {
    type: UiAction.SET_PENDING_SAVE,
    payload: {
      isSavingProject: status
    }
  };
};

export const notify = (message: string, level: NotificationLevel): IAction => {
  return {
    type: UiAction.NOTIFY,
    payload: {
      message,
      level
    }
  };
};


export const closeDeployModal = (): IAction => {
  return {
    type: UiAction.CLOSE_DEPLOY_MODAL,
    payload: {
      isDeployModalOpen: false
    }
  };
};

export const showDeploymentSuccess = (show: boolean): IAction => {
  return {
    type: UiAction.SHOW_DEPLOY_SUCCESS,
    payload: {
      show
    }
  };
};
