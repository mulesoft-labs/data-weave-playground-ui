import { IStore, IAction, IDictionary } from 'common/types';
import RequestManager from 'managers/RequestManager';
import { fetchPreview, fetchWeaveTypes } from 'dataweave/actions';
import { getMediaTypeFromFormat, getHash } from 'fileSystem/helpers';
import { updateProject } from 'project/actions';
import { IGetGistResponse } from 'gist/types';
import { IFile, Format, MediaType } from 'fileSystem/types';
import { writeFile } from 'fileSystem/actions';
import { getAllScriptsForGist, getAllInputsForGist } from 'gist/selectors';
import { IProjectFile } from 'project/types';
import { getFileDetailsFromGistName, getGithubToken } from 'gist/helpers';
import { getProjectFileContent } from 'project/selectors';

export enum GistAction {
  FETCH_GIST_REQUEST = '@DW:FETCH_GIST_REQUEST',
  FETCH_GIST_REQUEST_SUCCESS = '@DW:FETCH_GIST_REQUEST_SUCCESS',
  FETCH_GIST_REQUEST_FAILURE = '@DW:FETCH_GIST_REQUEST_FAILURE',
  CREATE_GIST_REQUEST = '@DW:CREATE_GIST_REQUEST',
  CREATE_GIST_REQUEST_SUCCESS = '@DW:CREATE_GIST_REQUEST_SUCCESS',
  CREATE_GIST_REQUEST_FAILURE = '@DW:CREATE_GIST_REQUEST_FAILURE',
  UPDATE_GIST_REQUEST = '@DW:UPDATE_GIST_REQUEST',
  UPDATE_GIST_REQUEST_SUCCESS = '@DW:UPDATE_GIST_REQUEST_SUCCESS',
  UPDATE_GIST_REQUEST_FAILURE = '@DW:UPDATE_GIST_REQUEST_FAILURE'
}

export const fetchGist = (id: string) => async (dispatch, getState: () => IStore, request: RequestManager) => {
  let response: IGetGistResponse;

  dispatch({
    type: GistAction.FETCH_GIST_REQUEST
  });

  try {
    response = await request.get<IGetGistResponse>(`https://api.github.com/gists/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `token ${getGithubToken()}`
      }
    });
  } catch (e) {
    console.error(e);
    dispatch(fetchGistFailure());
  }

  dispatch(fetchGistSuccess(response));
  dispatch(fetchPreview());
  dispatch(fetchWeaveTypes());
};

export const fetchGistSuccess = (response: IGetGistResponse) => dispatch => {
  const { files } = response;
  let projectFile: IProjectFile;
  let scripts: IDictionary<IFile> = {};
  let inputs: IDictionary<IFile> = {};
  let other: IDictionary<IFile> = {};

  try {
    projectFile = JSON.parse(files['dwl-project.json'].content);
  } catch (e) {
    console.error('Invalid project file');
    return;
  }

  for (const fileName in files) {
    const { name, type, format } = getFileDetailsFromGistName(fileName);
    const path = type ? `${type}/${name}.${format}` : `${name}.${format}`;
    const gistFile = files[fileName];
    const hash = getHash(path + gistFile.content);
    const fileDefinition: IFile = {
      name,
      path,
      hash,
      lastSavedHash: hash || '',
      content: gistFile.content,
      mediaType: getMediaTypeFromFormat(format)
    };

    if (type === 'scripts') {
      scripts[path] = fileDefinition;
    } else if (type === 'inputs') {
      inputs[path] = fileDefinition;
    } else {
      other[path] = fileDefinition;
    }
  }

  dispatch({
    type: GistAction.FETCH_GIST_REQUEST_SUCCESS,
    payload: {
      gistId: response.id
    }
  });

  dispatch(updateProject(projectFile, scripts, inputs, other));
};

export const fetchGistFailure = (): IAction => {
  console.log('Unable to fetch Gist');
  return {
    type: GistAction.FETCH_GIST_REQUEST_FAILURE
  };
};

export const createGist = () => async (dispatch, getState: () => IStore, request: RequestManager) => {
  let response;
  const state = getState();
  const { name } = state.project;
  const scripts = getAllScriptsForGist(state);
  const inputs = getAllInputsForGist(state);
  const projectFile = getProjectFileContent(state);

  dispatch({
    type: GistAction.CREATE_GIST_REQUEST
  });

  try {
    response = await request.post(`https://api.github.com/gists`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `token ${getGithubToken()}`
      },
      body: {
        description: name,
        public: true,
        files: {
          ...scripts,
          ...inputs,
          'dwl-project.json': {
            content: JSON.stringify(projectFile, null, 4)
          }
        }
      }
    });
  } catch (e) {
    console.error(e);
    return dispatch(createGistFailure());
  }

  return dispatch(createGistSuccess(response));
};

export const createGistSuccess = (response: IGetGistResponse) => dispatch => {
  console.log('create gist success');
  dispatch({
    type: GistAction.CREATE_GIST_REQUEST_SUCCESS,
    payload: {
      gistId: response.id
    }
  });

  (window as any).location = `${window.location.origin}/#project=${response.id}`;
};

export const createGistFailure = (): IAction => {
  console.log('Unable to create Gist');
  return {
    type: GistAction.CREATE_GIST_REQUEST_FAILURE
  };
};

export const updateGist = (gistId: string) => async (dispatch, getState: () => IStore, request: RequestManager) => {
  let response;
  const state = getState();
  const { name } = state.project;
  const scripts = getAllScriptsForGist(state);
  const inputs = getAllInputsForGist(state);
  const projectFile = getProjectFileContent(state);

  dispatch({
    type: GistAction.UPDATE_GIST_REQUEST
  });

  try {
    response = await request.patch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `token ${getGithubToken()}`
      },
      body: {
        description: name,
        public: true,
        files: {
          ...scripts,
          ...inputs,
          'dwl-project.json': {
            content: JSON.stringify(projectFile, null, 4)
          }
        }
      }
    });
  } catch (e) {
    console.error(e);
    return dispatch(updateGistFailure());
  }

  return dispatch(updateGistSuccess(response.id));
};

export const updateGistSuccess = (response): IAction => {
  console.log('update gist success');
  return {
    type: GistAction.UPDATE_GIST_REQUEST_SUCCESS,
    payload: {
      gistId: response.id
    }
  };
};

export const updateGistFailure = (): IAction => {
  console.log('Unable to update Gist');
  return {
    type: GistAction.UPDATE_GIST_REQUEST_FAILURE
  };
};
