export enum SideBarView {
  LIST,
  INPUT_EDITOR
}

export enum ToolBarTab {
  LOG_VIEWER,
  API_REFERENCE
}

export interface IUIState {
  selectedScript: string; // script id
  selectedInput: string; // path
  selectedView: SideBarView;
  selectedToolBarTab: ToolBarTab;
  isToolBarOpen: boolean;
  apiReferenceAnchor: string;
  isSavingProject: boolean;
  isDeploying: boolean;
  isDeployModalOpen: boolean;
  showDeploymentSuccess: boolean;
}

export enum NotificationLevel {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}
