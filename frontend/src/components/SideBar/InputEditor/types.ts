import { IFile, Format } from 'fileSystem/types';

export interface IProps {
  currentInput?: IFile;
  format: Format;
  onBack?: () => void;
  onInputChange?: (path: string, content: string) => void;
  onRenameInput?: (oldPath: string, newPath: string) => void;
}
