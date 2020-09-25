import { getFormatFromMediaType } from 'fileSystem/helpers';
import { createSelector } from 'reselect';
import { getAllScripts, getAllInputs } from 'project/selectors';
import { IStore } from 'common/types';

export const getGistId = (state: IStore) => state.gist.gistId;

export const getAllScriptsForGist = createSelector(getAllScripts, scripts => {
  return Object.keys(scripts).reduce((acc, key) => {
    const script = scripts[key];
    return {
      ...acc,
      [`__scripts__${script.name}.dwl`]: {
        content: script.content
      }
    };
  }, {});
});

export const getAllInputsForGist = createSelector(getAllInputs, inputs => {
  return Object.keys(inputs).reduce((acc, key) => {
    const input = inputs[key];
    const format = getFormatFromMediaType(input.mediaType);
    return {
      ...acc,
      [`__inputs__${input.name}.${format}`]: {
        content: input.content
      }
    };
  }, {});
});
