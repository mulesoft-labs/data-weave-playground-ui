import { IOption } from '../types';

export interface IProps {
  options: IOption[];
  offset?: {
    left?: number;
    top?: number;
  };
  onSelect: (value: string) => void;
}

export interface IState {
  bound: ClientRect;
}
