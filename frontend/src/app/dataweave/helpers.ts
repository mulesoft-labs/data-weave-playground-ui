import { IInputDirective } from 'dataweave/types';
import { MediaType, IPathDetails } from 'fileSystem/types';

/**
 * Sets the media type of the specified input directive
 * @param source Source dataweave script
 * @param inputName The name of the input variable
 * @param mediaType The new media type to be set
 */

export const setOutputDirectiveMediaType = (source: string, mediaType: MediaType): string => {
  return source.replace(/output\s+((?:application\/|text\/)?(?:\w+))/, (content, match) =>
    content.replace(match, mediaType)
  );
};

export const setInputDirective = (
  oldPathDetails: IPathDetails,
  newPathDetails: IPathDetails,
  source: string
): string => {
  const matchOld = new RegExp(`input\\s+${oldPathDetails.name}\\s+((?:application\/|text\/)?(?:\\w+))`);
  const newLine = `input ${newPathDetails.name} ${newPathDetails.mediaType}`;
  return source.replace(matchOld, newLine);
};
