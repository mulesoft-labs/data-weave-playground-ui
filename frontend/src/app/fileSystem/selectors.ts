import {createSelector} from 'reselect';
import {IStore} from 'common/types';
import {IFile} from 'fileSystem/types';

export const getModifiedFiles = (state: IStore) => state.fileSystem.modifiedFiles;

export const getFileList = (state: IStore) => {
  return state.fileSystem.files;
};

export const readDir = (path: string) => {
  return createSelector(getFileList, files => {
    let dirContent = {};

    for (const key in files) {
      if (key.indexOf(path) === 0) {
        dirContent[key] = files[key];
      }
    }

    return dirContent;
  });
};

export const readFile = (path: string) => {
  return createSelector(getFileList, files => {
    let foundFile = null;

    for (const key in files) {
      if (key.indexOf(path) === 0) {
        foundFile = files[key];
      }
    }

    return foundFile as IFile;
  });
};


