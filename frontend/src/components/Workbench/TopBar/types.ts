export interface IProps {
  deploymentId?: string;
  projectName?: string;
  languageLevel?: string;
  isSavingProject?: boolean;
  onSave?: () => void;
  onDeploy?: () => void;
  onRenameProject?: (name: string) => void;
  onOpenDeployModal?: () => void;
}

export interface IState {
  inputSize: number;
}
