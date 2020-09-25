import * as moment from 'moment';
import {createSelector} from 'reselect';
import {IDictionary, IStore, ITreeNode, TreeNodeType} from 'common/types';
import {Base64} from 'js-base64';
import {IFile} from 'fileSystem/types';
import {getSelectedInputPath, getSelectedScriptPath} from 'ui/selectors';
import {readDir} from 'fileSystem/selectors';
import {getFormatFromMediaType} from 'fileSystem/helpers';
import {toScriptFilePath} from "fileSystem/helpers";

export const getAllScriptReferences = (state: IStore) => state.project.scripts;

export const getAllInputReferences = (state: IStore) => state.project.inputs;

export const getMainScriptPath = (state: IStore) => state.project.mainScriptPath;

export const getProjectName = (state: IStore) => state.project.name;

export const getAllScripts = createSelector(readDir('/scripts'), scripts => {
  return scripts as IDictionary<IFile>;
});

export const getAllInputs = createSelector(readDir('/inputs'), inputs => {
  return inputs as IDictionary<IFile>;
});

export const getMainScript = createSelector(getMainScriptPath, getAllScripts, (path, scripts) => {
  return scripts[path];
});

export const getCurrentScript = createSelector(getAllScripts, getSelectedScriptPath, (files, path) => {
  return files[path];
});

export const getCurrentInput = createSelector(getSelectedInputPath, getAllInputs, (id, inputs) => {
  return inputs[id];
});

export const getAllScriptsFlat = createSelector(getAllScripts, scripts => {
  return Object.keys(scripts).reduce((acc, key) => {
    const script = scripts[key];
      let scriptsResult = { ...acc, [toScriptFilePath(script.path)]: script.content };
      return scriptsResult;
  }, {});
});

export const getTreeNodesFromScripts = createSelector(getAllScripts, (scripts): ITreeNode<IFile>[] => {
  return Object.keys(scripts).map(key => {
    const script = scripts[key];

    return {
      id: key,
      type: TreeNodeType.ITEM,
      label: script.name,
      definition: script,
      children: null
    };
  });
});

export const getTreeNodesFromInputs = createSelector(getAllInputs, (inputs): ITreeNode<IFile>[] => {
  let nodes = [];

  for (let path in inputs) {
    const input = inputs[path];
    nodes.push({
      id: path,
      type: TreeNodeType.ITEM,
      label: input.name,
      definition: input,
      children: null
    });
  }

  // No support for subfolders yet

  return nodes;
});

export const getFormatFromCurrentInput = createSelector(getCurrentInput, input => {
  return getFormatFromMediaType(input.mediaType);
});

export const getProjectFileContent = createSelector(
  getProjectName,
  getMainScriptPath,
  (name, mainScriptPath) => {
      const date = Date.now();
      const formattedDate = moment(date).format('MM/DD/YYYY');
      return {
          project: {
              name,
              mainScript: mainScriptPath,
              meta: {
                  projectFileVersion: '0.1.0',
                  creationDate: formattedDate
              }
          }
      };
  }
);




