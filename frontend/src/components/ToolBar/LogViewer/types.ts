import { ILogEntry } from 'dataweave/types';

export interface IProps {
  entries?: ILogEntry[];
  onClearLogs?: () => void;
  onGoToAPIReference?: (anchor: string) => void;
}

export interface IState {
  filter: string;
}
