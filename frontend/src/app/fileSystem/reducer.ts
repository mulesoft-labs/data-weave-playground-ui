import { loadPreset } from 'common/helpers';
import { IFileSystemState, IFile, MediaType } from './types';
import { FileSystemAction, updateFileSystem } from './actions';
import { IDictionary } from 'flareon/dist/typings/types';
import { getDetailsFromPath } from 'fileSystem/helpers';

export const initialState: IFileSystemState = loadPreset<IFileSystemState>('fileSystem') || {
  files: {
    '/inputs/payload.json': {
      name: 'payload',
      path: '/inputs/payload.json',
      content: '{\n    "message": "Hello world!"\n}',
      mediaType: MediaType.JSON,
      lastSavedHash: null,
      hash: '592c68b071238a762a9d4ded6b04a5b4'
    },
    '/scripts/main.dwl': {
      name: 'main',
      path: '/scripts/main.dwl',
      content: '%dw 2.0\noutput application/json\n---\npayload.message',
      mediaType: MediaType.DW,
      lastSavedHash: null,
      hash: '34598e019b5214a6522168da38cf7208'
    }
  },
  modifiedFiles: []
};

export const defaultFileDefinition = (path: string): IFile => ({
  name: 'untitled',
  path,
  content: '',
  hash: null,
  lastSavedHash: null,
  mediaType: MediaType.JSON
});

const reducer = (state: IFileSystemState = initialState, action): IFileSystemState => {
  const { type, payload } = action;

  switch (type) {
    case FileSystemAction.CREATE_FILE: {
      const { path, content, hash } = payload as { path: string; content: string; hash: string };
      const pathDetails = getDetailsFromPath(path);
      const composedDefinition = {
        ...defaultFileDefinition(path),
        ...state.files[path],
        mediaType: pathDetails.mediaType,
        name: pathDetails.name,
        content,
        hash
      };

      return {
        ...state,
        files: {
          ...state.files,
          [path]: { ...composedDefinition }
        }
      };
    }

    case FileSystemAction.WRITE_FILE: {
      const { path, content } = payload as { path: string; content: string };
      return {
        ...state,
        files: {
          ...state.files,
          [path]: {
            ...state.files[path],
            content
          }
        }
      };
    }

    case FileSystemAction.DELETE_FILE: {
      const { path } = payload as { path: string };
      const { [path]: deletedFile, ...updatedList } = state.files;
      return {
        ...state,
        files: updatedList
      };
    }

    case FileSystemAction.ADD_MODIFIED_FILE: {
      const { path } = payload as { path: string };
      return {
        ...state,
        modifiedFiles: [...state.modifiedFiles, path]
      };
    }

    case FileSystemAction.REMOVE_MODIFIED_FILE: {
      const { path } = payload as { path: string };
      return {
        ...state,
        modifiedFiles: state.modifiedFiles.filter($ => $ !== path)
      };
    }

    case FileSystemAction.UPDATE_FS: {
      const { files } = payload as { files: IDictionary<IFile> };
      return { ...state, files: { ...files } };
    }

    default:
      return { ...state };
  }
};

export default reducer;
