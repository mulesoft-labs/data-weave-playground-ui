import {IAction, IDictionary, IStore} from 'common/types';
import {IFile} from 'fileSystem/types';
import {batchActions} from 'common/helpers';
import {getHash} from 'fileSystem/helpers';


export enum FileSystemAction {
  CREATE_FILE = '@FS:CREATE_FILE',
  WRITE_FILE = '@FS:WRITE_FILE',
  DELETE_FILE = '@FS:DELETE_FILE',
  ADD_MODIFIED_FILE = '@FS:ADD_MODIFIED_FILE',
  REMOVE_MODIFIED_FILE = '@FS:REMOVE_MODIFIED_FILE',
  UPDATE_FS = '@FS:UPDATE_FS'
}

export const createFile = (path: string, content: string) => async (dispatch, getState: () => IStore) => {
  const state = getState();
  if (!state.fileSystem.files[path]) {
    const hash = getHash(path + content);
    const doCreateFile = {
      type: FileSystemAction.CREATE_FILE,
      payload: {
        path,
        content,
        hash
      }
    };

    await dispatch(doCreateFile);
    dispatch(updateModifiedFiles(path, hash));
  }
};

export const writeFile = (path: string, content: string) => (dispatch, getState: () => IStore) => {
  const state = getState();
  if (state.fileSystem.files[path]) {
    const hash = getHash(path + content);
    const doUpdateModifiedFiles = updateModifiedFiles(path, hash);
    const doWriteFile = {
      type: FileSystemAction.WRITE_FILE,
      payload: {
        path,
        content,
        hash
      }
    };

    dispatch(batchActions([doWriteFile, doUpdateModifiedFiles]));
  } else{
    console.log("Unable to write file as it doesn't exits", path, content)
  }
};

export const renameFile = (fromPath: string, toPath: string) => (dispatch, getState: () => IStore) => {
    const oldFile = getState().fileSystem.files[fromPath];
    const newContent = oldFile.content;
    const hash = getHash(toPath + newContent);

    const doDeleteFile = deleteFile(fromPath);
    const doCreateFile = createFile(toPath, newContent);
    const doUpdateModifiedFiles = updateModifiedFiles(toPath, hash);

    return dispatch(batchActions([doDeleteFile, doCreateFile]));
};

export const deleteFile = (path: string) => dispatch => {
    const doDeleteFile = {
        type: FileSystemAction.DELETE_FILE,
        payload: {
            path
        }
    };

    dispatch(batchActions([doDeleteFile, updateModifiedFiles(path, null)]));
};

export const updateModifiedFiles = (path: string, hash: string) => (dispatch, getState: () => IStore) => {
    const file = getState().fileSystem.files[path];

    if (hash !== file.lastSavedHash) {
        dispatch(addModifiedFile(path));
    } else {
        dispatch(removeModifiedFile(path));
    }
};

export const addModifiedFile = (path: string): IAction => {
    return {
        type: FileSystemAction.ADD_MODIFIED_FILE,
        payload: {
            path
        }
    };
};

export const removeModifiedFile = (path: string): IAction => {
    return {
        type: FileSystemAction.REMOVE_MODIFIED_FILE,
        payload: {
            path
        }
    };
};

export const updateFileSystem = (files: IDictionary<IFile>): IAction => {
    return {
        type: FileSystemAction.UPDATE_FS,
        payload: {
            files
        }
    };
};
