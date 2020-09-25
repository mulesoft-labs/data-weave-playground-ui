import { ITreeNode } from 'common/types';
import { IFile } from 'fileSystem/types';

export interface IProps {
  mainScript: string;
  scripts?: ITreeNode<IFile>[];
  selectedIndex?: number;
  onSelect?: (scriptId: string) => void;
  onCreateScript?: (path: string) => void;
}

export interface IState {
  isCreationModalVisible: boolean;
}
