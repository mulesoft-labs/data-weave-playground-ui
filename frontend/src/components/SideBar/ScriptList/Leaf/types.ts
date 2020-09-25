import { ILeafProps } from 'src/components/TreeView/types';

export interface IProps extends ILeafProps {
  onSetMainScript?: (id: string) => void;
}
