import { IDictionary } from 'common/types';
import { MediaType } from 'fileSystem/types';

export interface IDataweaveState {
  previewStatus: PreviewStatus;
  pendingFetchPreviewRequest: boolean;
  previewOutput: string;
  weaveTypes: IDictionary<string>;
  logs: ILogEntry[];
}

export enum PreviewStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ILogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
}

export enum LogLevel {
  INFO = 'INFO',
  ERROR = 'ERROR'
}

export interface IInputDirective {
  name: string;
  mediaType: MediaType;
  line: number;
}

export interface IExecutorResponse {
  success: boolean;
  logs?: ILogEntry[];
  result?: {
    mimeType: MediaType;
    value: string;
    encoding: string;
  };
  error?: {
    location?: Location;
    message: string;
  };
}

export interface Location {
  start: Position;
  end: Position;
  content: string;
}

export interface Position {
  index: number;
  line: number;
  column: number;
}

export interface ITypesResponse {
  success: boolean;
  result?: string;
  error?: {
    kind: ErrorKind;
    message: string;
  };
}

export enum ErrorKind {
  COMPILATION,
  EDITOR_RUNTIME,
  WEAVE_TYPES
}
