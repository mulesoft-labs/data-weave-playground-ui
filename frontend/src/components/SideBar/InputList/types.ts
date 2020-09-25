import { ITreeNode } from 'common/types';
import { SideBarView } from 'ui/types';
import { IFile } from 'fileSystem/types';

export interface IProps {
  inputs?: ITreeNode<IFile>[];
  currentInput?: IFile;
  selectedIndex?: number;
  onSelectInput?: (id: string) => void;
  onSelectView?: (id: SideBarView) => void;
  onCreateInput?: (path: string) => void;
}

export interface IState {
  isCreationModalVisible: boolean;
}
