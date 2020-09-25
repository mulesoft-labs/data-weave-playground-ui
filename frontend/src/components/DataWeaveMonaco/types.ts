import {IDictionary} from 'common/types';
import {IFile} from 'fileSystem/types';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main';

export interface IProps {
  className?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onChange?: (value: string, event) => void;
  theme?: string;
  options?: monaco.editor.IEditorConstructionOptions;
  width?: string | number;
  height?: string | number;
  loader?: () => any;
  loaderStyle?: any;
  loaderSize?: number;
  focus?: boolean;
  testId?: string;
  decorations?: IMarginGlyph[];
  file: IFile;
  types: IDictionary<string>;
  fileHash: string;
  openUrlRequested?: (url: ResourceInput) => void;
}

export interface IMarginGlyph {
  line: number;
  marginClassName: string;
  contentClassName?: string;
  onClick?: () => void;
}

export type ResourceInput = {
    resource: {
        fsPath: string,
        external: string,
        path: string,
        scheme: string
    },
    options: {
        selection: monaco.Range,
        revealIfVisible: boolean
    }
}