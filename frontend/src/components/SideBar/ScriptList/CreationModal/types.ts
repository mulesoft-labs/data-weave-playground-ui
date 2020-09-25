export interface IProps {
  visible: boolean;
  title: string;
  onCreate: (script: { name: string; }) => void;
  onCancel: () => void;
  validate:Boolean;
}

export interface IState {
  identifier: IFormFieldState;
  submitEnabled: boolean;
}

export interface IFormFieldState {
  value: string;
  errors: string[];
}
