import { IUIState, SideBarView, ToolBarTab } from 'ui/types';

const state: IUIState = {
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

export default state;
