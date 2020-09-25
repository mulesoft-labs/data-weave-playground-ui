import { IDictionary } from 'common/types';
import { IInputDirective } from 'dataweave/types';
import { IMarginGlyph } from 'src/components/Monaco/types';
import { IFile } from 'fileSystem/types';
import { DWFile } from '@mulesoft/data-weave-monaco';

export interface IProps {
  script: IFile;
  types: IDictionary<string>;
  inputs: IDictionary<IFile>;
  fileSystem: IDictionary<string>;
  inputDirectives: IInputDirective[];
  onUpdateScript?: (path: string, content: string) => void;
  onCreateInput?: (path: string, content: string) => void;
  onRenameInput?: (oldPath: string, newPath: string) => void;
  onOpenScript?: (url: string) => void;
}

export interface IState {
  decorations: IMarginGlyph[];
  justPasted: boolean;
}
