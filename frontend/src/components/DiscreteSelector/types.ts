export interface IOption {
  label: string;
  value: string;
}

export interface IProps {
  options: IOption[];
  value?: string;
  offset?: {
    left?: number;
    top?: number;
  };
  onSelect?: (value: string) => void;
  className?: string;
}

export interface IState {
  selectedOption: string; // index
  isOpen: boolean;
}
