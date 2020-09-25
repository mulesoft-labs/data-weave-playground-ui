import { IDictionary } from 'common/types';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main';

export interface IProps {
  className?: string;
  editorWillMount?: (monaco) => void;
  editorDidMount?: (editor, monaco) => void;
  onModelUpdate?: (model, types, files) => any;
  dw?: any;
  scripts?: IDictionary<string>;
  onBlur?: () => void;
  onFocus?: () => void;
  onChange?: (value: string, event) => void;
  requireConfig?: any;
  language?: string;
  theme?: string;
  options?: monaco.editor.IEditorConstructionOptions;
  value?: string;
  defaultValue?: string;
  width?: string | number;
  height?: string | number;
  loader?: () => any;
  loaderStyle?: any;
  loaderSize?: number;
  focus?: boolean;
  testId?: string;
  decorations?: IMarginGlyph[];
}

export interface IMarginGlyph {
  line: number;
  marginClassName: string;
  contentClassName?: string;
  onClick?: () => void;
}
