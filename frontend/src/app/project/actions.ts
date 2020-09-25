import {batchActions} from 'common/helpers';
import {IAction, IStore} from 'common/types';
import {fetchPreview, fetchWeaveTypes, updateScriptInputDirectives} from 'dataweave/actions';
import {getCurrentScript} from 'project/selectors';
import {setOutputDirectiveMediaType} from 'dataweave/helpers';
import {IDictionary} from 'flareon/dist/typings/types';
import {IProjectFile} from 'project/types';
import {IFile, MediaType} from 'fileSystem/types';
import {createFile, deleteFile, renameFile, updateFileSystem, writeFile} from 'fileSystem/actions';
import {getSelectedScriptPath} from 'ui/selectors';
import {getModifiedFiles, readFile} from 'fileSystem/selectors';
import {notify, selectInput, selectScript, setPendingSave} from 'ui/actions';
import {createGist, updateGist} from 'gist/actions';
import {getGistId} from 'gist/selectors';
import {NotificationLevel} from 'ui/types';
import {DWLanguageClient} from "@mulesoft/data-weave-monaco/dist/language";
import {toScriptFilePath} from "fileSystem/helpers";

export enum ProjectAction {
    ADD_SCRIPT = '@PROJECT:ADD_SCRIPT',
    REMOVE_SCRIPT = '@PROJECT:REMOVE_SCRIPT',

    ADD_INPUT = '@PROJECT:ADD_INPUT',
    REMOVE_INPUT = '@PROJECT:REMOVE_INPUT',

    SET_MAIN_SCRIPT = '@PROJECT:SET_MAIN_SCRIPT',
    UPDATE_PROJECT = '@PROJECT:UPDATE_PROJECT',

    RENAME_PROJECT = '@PROJECT:RENAME_PROJECT'
}


export const createScript = (path: string, content: string) => dispatch => {
    let scriptRealPath = toScriptFilePath(path);
    DWLanguageClient.getInstance().newProjectFile(scriptRealPath, content);

    dispatch(createFile(path, content));

    dispatch({
        type: ProjectAction.ADD_SCRIPT,
        payload: {
            path
        }
    });
};

export const updateScript = (path: string, content: string) => (dispatch, getState: () => IStore): Promise<any> => {
    const state = getState();
    const resolvedPath = path || getSelectedScriptPath(state);

    dispatch(writeFile(resolvedPath, content));

    return dispatch(fetchPreview());
};

export const updateScriptOutputMediaType = (mediaType: MediaType) => (dispatch, getState: () => IStore) => {
    const state = getState();
    const oldScript = getCurrentScript(state);
    const content = setOutputDirectiveMediaType(oldScript.content, mediaType);
    dispatch(updateScript(oldScript.path, content));
};

export const setMainScript = (path: string): IAction => {
    return {
        type: ProjectAction.SET_MAIN_SCRIPT,
        payload: {
            path
        }
    };
};

export const deleteScript = (path: string): IAction => {
    return {
        type: ProjectAction.REMOVE_SCRIPT,
        payload: {
            path
        }
    };
};

export const createInput = (path: string, content: string) => (dispatch, getState: () => IStore) => {
    dispatch(createFile(path, content));

    dispatch({
        type: ProjectAction.ADD_INPUT,
        payload: {
            path
        }
    });

    dispatch(selectInput(path));
    dispatch(fetchWeaveTypes());
};

export const updateInput = (path: string, content) => (dispatch, getState: () => IStore) => {
    const state = getState();
    const currentInput = getState().fileSystem.files[path];
    const oldInput = readFile(path)(state);

    dispatch(writeFile(path, content));

    dispatch(fetchPreview());
    dispatch(fetchWeaveTypes());
};

export const deleteInput = (path: string) => dispatch => {
    dispatch(deleteFile(path));

    dispatch({
        type: ProjectAction.REMOVE_INPUT,
        payload: {
            path
        }
    });
};

export const updateProject = (
    projectFile: IProjectFile,
    scripts: IDictionary<IFile>,
    inputs: IDictionary<IFile>,
    other: IDictionary<IFile>
) => dispatch => {
    const inputKeys = Object.keys(inputs);

    const doUpdateFileSystem = updateFileSystem({
        ...scripts,
        ...inputs,
        ...other
    });

    const doUpdateProject = {
        type: ProjectAction.UPDATE_PROJECT,
        payload: {
            projectFile,
            scripts: Object.keys(scripts),
            inputs: inputKeys
        }
    };

    const doSelectInput = selectInput(inputKeys[0]);

    const doSelectScript = selectScript(projectFile.project.mainScript);

    dispatch(
        batchActions([doUpdateFileSystem, doUpdateProject, doSelectInput, doSelectScript])
    );
};

export const renameInput = (fromPath: string, toPath: string) => (dispatch, getState: () => IStore) => {
    const state = getState();

    if (state.ui.selectedInput === fromPath) {
        dispatch(batchActions([renameFile(fromPath, toPath), selectInput(toPath)]));
    } else {
        dispatch(batchActions([renameFile(fromPath, toPath)]));
    }

    return dispatch(updateScriptInputDirectives(fromPath, toPath));
};

export const renameProject = (name: string): IAction => {
    return {
        type: ProjectAction.RENAME_PROJECT,
        payload: {
            name
        }
    };
};

export const saveProject = () => async (dispatch, getState: () => IStore) => {
    const state = getState();
    const canSave = getModifiedFiles(state).length > 0;
    const gistId = getGistId(state);

    dispatch(setPendingSave(true));

    if (!gistId) {
        try {
            await dispatch(createGist());
            dispatch(saveProjectSuccess());
        } catch (e) {
            console.error(e);
            dispatch(saveProjectFailure());
        }
    } else {
        try {
            await dispatch(updateGist(gistId));
            dispatch(saveProjectSuccess());
        } catch (e) {
            console.error(e);
            dispatch(saveProjectFailure());
        }
    }
};

export const saveProjectSuccess = () => dispatch => {
    const doPendingSave = setPendingSave(false);
    const doNotify = notify('Project saved', NotificationLevel.SUCCESS);

    dispatch(batchActions([doPendingSave, doNotify]));
};

export const saveProjectFailure = () => dispatch => {
    const doPendingSave = setPendingSave(false);
    const doNotify = notify('Failed to save project', NotificationLevel.ERROR);

    dispatch(batchActions([doPendingSave, doNotify]));
};
