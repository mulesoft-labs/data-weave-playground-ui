import { MediaType } from 'fileSystem/types';
import { IFile } from 'fileSystem/types';

export const mockFile = (
  name: string,
  path: string,
  content = '',
  mediaType = MediaType.JSON,
  hash: string,
  lastSavedHash: string
): IFile => ({
  name,
  path,
  content,
  mediaType,
  hash,
  lastSavedHash
});
