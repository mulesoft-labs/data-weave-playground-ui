import { IDictionary } from 'common/types';
import { ErrorKind } from 'dataweave/types';

export interface IProjectState {
  name: string;
  languageLevel: string;
  modules: IModuleDefinition[];
  mainScriptPath: string;
  scripts: string[];
  inputs: string[];
}
export interface IModuleDefinition {
  groupId: string;
  artifactId: string;
  version: string;
}
export interface IProjectFile {
  project: {
    name: string;
    mainScript: string;
  };
  meta: {
    'projectFileVersion': string;
  };
}
