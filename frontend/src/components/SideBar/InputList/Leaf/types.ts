import { ILeafProps } from 'src/components/TreeView/types';
import { ITreeNode } from 'common/types';
import { IFile } from 'fileSystem/types';

export interface IProps extends ILeafProps {
  node: ITreeNode<IFile>;
}
