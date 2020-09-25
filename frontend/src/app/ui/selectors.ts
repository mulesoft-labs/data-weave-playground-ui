import { IStore } from 'common/types';

export const getSelectedView = (state: IStore) => state.ui.selectedView;

export const getSelectedToolBarTab = (state: IStore) => state.ui.selectedToolBarTab;

export const isToolBarOpen = (state: IStore) => state.ui.isToolBarOpen;

export const getAPIReferenceAnchor = (state: IStore) => state.ui.apiReferenceAnchor;

export const getSelectedScriptPath = (state: IStore) => state.ui.selectedScript;

export const getSelectedInputPath = (state: IStore) => state.ui.selectedInput;

export const isSavingProject = (state: IStore) => state.ui.isSavingProject;

export const languageLevel = (state: IStore) => state.project.languageLevel;

export const isDeploying = (state: IStore) => state.ui.isDeploying;

export const isDeployModalOpen = (state: IStore) => state.ui.isDeployModalOpen;

export const showDeploymentSuccess = (state: IStore) => state.ui.showDeploymentSuccess;
