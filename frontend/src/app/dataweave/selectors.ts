import { createSelector } from 'reselect';
import { IStore } from 'common/types';
import { getAllInputs, getCurrentScript, getMainScript } from 'project/selectors';
import { IInputDirective } from 'dataweave/types';
import { isBinary, getFormatFromMediaType, DATA_FORMATS } from 'fileSystem/helpers';
import { Base64 } from 'js-base64';
import { MediaType } from 'fileSystem/types';

export const getPreviewOutput = (state: IStore) => state.dataweave.previewOutput;

export const getPreviewStatus = (state: IStore) => state.dataweave.previewStatus;

export const getLogEntries = (state: IStore) => state.dataweave.logs;

export const getAllWeaveTypes = (state: IStore) => state.dataweave.weaveTypes;

export const getWeaveTypesForInputs = createSelector(getAllWeaveTypes, getAllInputs, (types, inputs) => {
  return Object.keys(inputs).reduce((acc, key) => {
    const input = inputs[key];
    const inputId = input.name;
    return { ...acc, [inputId]: types[input.path] };
  }, {});
});

export const getCurrentScriptHeader = createSelector(getCurrentScript, script => {
  const header = script.content.split(/(---)/)[0];
  const headerLines = header.split('\n');
  return headerLines;
});

export const getMainScriptHeader = createSelector(getMainScript, script => {
  const header = script.content.split(/(---)/)[0];
  const headerLines = header.split('\n');
  return headerLines;
});

export const getInputDirectivesFromScript = createSelector(getCurrentScriptHeader, headerLines => {
  let inputDirectives: IInputDirective[] = [];

  for (let i = 0; i < headerLines.length; i++) {
    const result = /input\s+(\S+)\s+((?:application|text)\/(?:\w+))/.exec(headerLines[i].trim());

    if (!result || !result[1] || !result[2]) continue;

    inputDirectives.push({
      name: result[1],      
      mediaType: result[2] as MediaType,
      line: i + 1
    });
  }

  return inputDirectives;
});

export const getOutputMediaTypeFromScript = createSelector(getMainScriptHeader, headerLines => {
  for (let i = 0; i < headerLines.length; i++) {
    const result = /output\s+((?:application|text)\/(?:\w+))/.exec(headerLines[i].trim());
    if (!result || !result[1]) {
      const result = /output\s+((?:\w+))/.exec(headerLines[i].trim());
      if (!result || !result[1]) {
        continue;
      } else{
        for (let i = 0; i < DATA_FORMATS.length; i++) {
          if(DATA_FORMATS[i].format == result[1]){
            return DATA_FORMATS[i].mediaType;
          }
        }
      }

    }
    return result[1] as MediaType;
  }
  //Use text by default
  return MediaType.TXT;
});

export const getOutputFormatFromScript = createSelector(getOutputMediaTypeFromScript, mediaType => {
  return getFormatFromMediaType(mediaType);
});

export const getAllInputsForRunner = createSelector(getAllInputs, (inputs) => {
  return Object.keys(inputs).reduce((acc, key) => {
    const input = inputs[key];
    const definition = !isBinary(input.mediaType) ? Base64.encode(input.content) : input.content;

    return { ...acc, [input.name]: { value: definition, kind: 'binary', properties: {}, mimeType: input.mediaType } };
  }, {});
});
