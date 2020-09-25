import {IDictionary} from 'common/types';

export interface IFile {
    name: string; // 'README.md'
    path: string; // 'input'
    content: string; // 'encoded content ...'
    mediaType: MediaType;
    lastSavedHash: string;
    hash: string;
}

export interface IFileSystemState {
    files: IDictionary<IFile>; // { [path: string]: IFile }
    modifiedFiles: Array<string>; // paths
}

export enum Format {
    JSON = 'json',
    XML = 'xml',
    NDJSON = 'ndjson',
    CSV = 'csv',
    JAVA = 'java',
    DW = 'dwl',
    XLSX = 'xlsx',
    TXT = 'txt',
    MULTIPART = 'multipart',
    YAML = 'yaml',
    URL_ENCODED="urlencoded"

}

export enum MediaType {
    JSON = 'application/json',
    XML = 'application/xml',
    CSV = 'application/csv',
    JAVA = 'application/java',
    NDJSON = 'application/x-ndjson',
    DW = 'application/dw',
    XLSX = 'application/xlsx',
    TXT = 'text/plain',
    MULTIPART = 'multipart/form-data',
    YAML = 'application/yaml',
    URL_ENCODED="application/x-www-form-urlencoded"
}

export interface IPathDetails {
    name: string;
    format: Format;
    mediaType: MediaType;
    location: string;
}


export type DataFormat =
    {
        mediaType: MediaType,
        format: Format,
        binary?: boolean,
        color?: string
    }