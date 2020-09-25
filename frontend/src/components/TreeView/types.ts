import { ITreeNode } from 'common/types';

export interface IFolderProps {
  label: string;
  title: string;
  collapsed?: boolean;
  level: number;
  node: ITreeNode<any>;
  onCollapse: () => void;
}

export interface ILeafProps {
  label: string;
  title: string;
  selected: boolean;
  level: number;
  node: ITreeNode<any>;
  onClick: () => void;
}

export interface IProps {
  nodes: ITreeNode<any>[];
  folderRenderer: any;
  leafRenderer: any;
  onSelect: (node: ITreeNode<any>) => void;
  selected: string; // node id
}

export interface IState {
  collapsedFolders: string[]; // array of node IDs
}
