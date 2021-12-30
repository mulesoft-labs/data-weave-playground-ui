import * as debounce from 'p-debounce';
import { IAction, IStore } from 'common/types';
import { getMainScriptPath, getCurrentInput, getAllScriptsFlat, getAllScripts } from 'project/selectors';
import { IExecutorResponse } from 'dataweave/types';
import RequestManager from 'managers/RequestManager';
import { writeFile } from 'fileSystem/actions';
import { getAllInputsForRunner } from 'dataweave/selectors';
import { setInputDirective } from 'dataweave/helpers';
import { getDetailsFromPath } from 'fileSystem/helpers';
import { batchActions } from 'common/helpers';
import { toScriptFilePath } from "fileSystem/helpers";
import { DWLanguageClient } from "@mulesoft/data-weave-monaco/dist/language";

export enum DataweaveAction {
  PREVIEW_REQUEST = '@DW:PREVIEW_REQUEST',
  PREVIEW_REQUEST_SUCCESS = '@DW:PREVIEW_REQUEST_SUCCESS',
  PREVIEW_REQUEST_FAILURE = '@DW:PREVIEW_REQUEST_FAILURE',
  WEAVE_TYPES_REQUEST = '@DW:WEAVE_TYPES_REQUEST',
  WEAVE_TYPES_REQUEST_SUCCESS = '@DW:WEAVE_TYPES_REQUEST_SUCCESS',
  WEAVE_TYPES_REQUEST_FAILURE = '@DW:WEAVE_TYPES_REQUEST_FAILURE',
  UPDATE_LOGS = '@DW:UPDATE_LOGS',
  MIGRATE_SCRIPT_REQUEST = '@DW:MIGRATE_SCRIPT_REQUEST',
  MIGRATE_SCRIPT_REQUEST_SUCCESS = '@DW:MIGRATE_SCRIPT_REQUEST_SUCCESS',
  MIGRATE_SCRIPT_REQUEST_FAILURE = '@DW:MIGRATE_SCRIPT_REQUEST_FAILURE'
}

export const fetchPreview = () =>
  debounce(async (dispatch, getState: () => IStore, request: RequestManager) => {
    let response: IExecutorResponse;
    const state = getState();

    dispatch({
      type: DataweaveAction.PREVIEW_REQUEST
    });

    try {
      response = await request.post<IExecutorResponse>(process.env.RUNNER_URL, {
        headers: {
          'Content-Type': 'application/json',
          'X-DataweaveAction': 'preview', //It is used in the RequestManager to avoid aborting /transform request if they are from different Actions
          Accept: 'application/json'
        },
        body: {
          main: toScriptFilePath(getMainScriptPath(state)),
          inputs: getAllInputsForRunner(state),
          fs: getAllScriptsFlat(state)
        }
      });

      if (!response.success) {
        dispatch(fetchPreviewFailure(response));
        dispatch(updateLogs(response.error.logs));
      } else {
        dispatch(fetchPreviewSuccess(response));
      }
    } catch (e) {
      console.error(e);
      dispatch(
        fetchPreviewFailure({
          error: { message: e.message },
          success: false
        })
      );
    }

    return response;
  }, 237);

export const fetchPreviewSuccess = (response: IExecutorResponse) => (dispatch, getState: () => IStore) => {
  if (response.success) {
    dispatch({
      type: DataweaveAction.PREVIEW_REQUEST_SUCCESS,
      payload: {
        content: response.result.value,
      }
    });
    dispatch(updateLogs(response.result.logs));
  } else {
    dispatch(fetchPreviewFailure(response));
  }
};

export const fetchPreviewFailure = (response: IExecutorResponse): IAction => {
  return {
    type: DataweaveAction.PREVIEW_REQUEST_FAILURE,
    payload: {
      error: response.error.message
    }
  };
};

export const fetchWeaveTypes = () =>
  debounce(async (dispatch, getState: () => IStore, request: RequestManager) => {
    let response: IExecutorResponse;
    const state = getState();
    const input = getCurrentInput(state);

    dispatch({
      type: DataweaveAction.WEAVE_TYPES_REQUEST
    });

    try {
      response = await request.post<IExecutorResponse>(process.env.RUNNER_URL, {
        headers: {
          'Content-Type': 'application/json',
          'X-DataweaveAction': 'weaveType', //It is used in the RequestManager to avoid aborting /transform requests if they are from different Actions
          Accept: 'application/json'
        },
        body: {
          main: input.path,
          inputs: {},
          fs: { [input.path]: '%dw 2.0\noutput application/dw\n---\n' + input.content },
        }
      });

      if (!response.success) throw new Error(response.error.message);
      const wtype = await DWLanguageClient.getInstance().inferType(response.result.value)
      dispatch(fetchWeaveTypesSuccess(wtype.toString(), input.path));
    } catch (e) {
      dispatch(
        fetchWeaveTypesFailure(
          {
            error: { message: 'Unable to fetch weave types' },
            success: false
          },
          input.path
        )
      );
    }
  }, 237);

export const fetchWeaveTypesSuccess = (response: string, path: string): IAction => {
  return {
    type: DataweaveAction.WEAVE_TYPES_REQUEST_SUCCESS,
    payload: {
      path,
      type: response
    }
  };
};

export const fetchWeaveTypesFailure = (response: IExecutorResponse, path: string): IAction => {
  return {
    type: DataweaveAction.WEAVE_TYPES_REQUEST_FAILURE,
    payload: {
      path,
      error: response.error.message
    }
  };
};

export const updateLogs = (logs = []): IAction => {
  return {
    type: DataweaveAction.UPDATE_LOGS,
    payload: {
      logs
    }
  };
};

export const updateScriptInputDirectives = (oldInputPath: string, newInputPath: string) => (
  dispatch,
  getState: () => IStore
) => {
  const state = getState();
  const scripts = getAllScripts(state);
  const oldDetails = getDetailsFromPath(oldInputPath);
  const newDetails = getDetailsFromPath(newInputPath);

  // really shitty refactor strategy
  const updateMediatype = oldDetails.mediaType !== newDetails.mediaType;
  const updateName = oldDetails.name !== newDetails.name;
  let actions = [];

  for (const path in scripts) {
    const script = scripts[path];
    let content = script.content;

    if (updateMediatype || updateName) {
      content = setInputDirective(oldDetails, newDetails, content);
      actions.push(writeFile(path, content));
    }
  }

  dispatch(batchActions(actions));
  dispatch(fetchPreview());
};
