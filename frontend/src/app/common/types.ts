import { IDataweaveState } from 'dataweave/types';
import { IProjectState } from 'project/types';
import { IGistState } from 'gist/types';
import { IFileSystemState } from 'fileSystem/types';
import { IUIState } from 'ui/types';


export interface IAction {
  type: string;
  payload?: IDictionary<any>;
  // more: https://github.com/acdlite/flux-standard-action
}

export interface IDictionary<T> {
  [key: string]: T;
}

export interface IStore {
  dataweave: IDataweaveState;
  project: IProjectState;
  gist: IGistState;
  ui: IUIState;
  fileSystem: IFileSystemState;
}

export enum TreeNodeType {
  FOLDER,
  ITEM
}

export interface ITreeNode<T> {
  id: string;
  type: TreeNodeType;
  label: string;
  definition: T;
  children?: ITreeNode<T>[];
}

export interface IValidationResult {
  valid: boolean;
  errors?: string[];
}
