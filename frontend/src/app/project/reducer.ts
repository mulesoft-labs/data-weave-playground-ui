import { MediaType } from 'fileSystem/types';
import { IProjectState, IProjectFile } from './types';
import { ProjectAction } from 'project/actions';
import { loadPreset } from 'common/helpers';

export const initialState: IProjectState = loadPreset<IProjectState>('project') || {
  name: 'Untitled project',
  scripts: ['/scripts/main.dwl'],
  inputs: ['/inputs/payload.json'],
  modules: [],
  mainScriptPath: '/scripts/main.dwl',
  languageLevel: "2.3.0"
};

const reducer = (state: IProjectState = initialState, action): IProjectState => {
  const { type, payload } = action;

  switch (type) {
    case ProjectAction.ADD_SCRIPT: {
      const { path } = payload as { path: string };
      return {
        ...state,
        scripts: [...state.scripts, path]
      };
    }

    case ProjectAction.REMOVE_SCRIPT: {
      const { path } = payload as { path: string };
      return { ...state, scripts: state.scripts.filter($ => $ !== path) };
    }

    case ProjectAction.ADD_INPUT: {
      const { path } = payload as { path: string };

      return {
        ...state,
        inputs: [...state.inputs, path]
      };
    }

    case ProjectAction.REMOVE_INPUT: {
      const { path } = payload as { path: string };
      return { ...state, inputs: state.inputs.filter($ => $ !== path) };
    }

    case ProjectAction.SET_MAIN_SCRIPT: {
      const { path } = payload as { path: string };
      return { ...state, mainScriptPath: path };
    }

    // This should only be called after successfully fetching a remote project (originally for gists)
    case ProjectAction.UPDATE_PROJECT: {
      const { projectFile, scripts, inputs } = payload as {
        projectFile: IProjectFile;
        scripts: string[];
        inputs: string[];
      };
      return {
        ...state,
        name: projectFile.project.name,
        scripts,
        inputs,
        mainScriptPath: projectFile.project.mainScript
        //selectedInput: Object.keys(inputs)[0],
        //selectedScript: Object.keys(scripts)[0]
      };
    }

    case ProjectAction.RENAME_PROJECT: {
      const { name } = payload as { name: string };
      return { ...state, name };
    }

    default:
      return { ...state };
  }
};

export default reducer;
