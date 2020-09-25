import { IDictionary } from 'common/types';

export interface IProps {
  name: string;
  fill?: string;
  size?: number | { width: number; height: number };
  viewBox?: number | { width: number; height: number };
  shortcut?: string;
  className?: string;
  onClick?: () => void;
  tooltip?: string;
  tooltipDelay?: number;
  tooltipPosition?: 'bottom' | 'top' | 'left' | 'right';
}
