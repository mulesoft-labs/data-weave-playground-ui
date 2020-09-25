import { IProjectState } from 'project/types';
import { MediaType } from 'fileSystem/types';

const state: IProjectState = {
  name: 'Untitled project',
  scripts: ['/scripts/main.dwl'],
  inputs: ['/inputs/payload.json', '/inputs/test.json', '/inputs/example.xml', '/inputs/excel.xlsx'],
  modules: [
    {
      groupId: '',
      artifactId: '',
      version: ''
    }
  ],
  mainScriptPath: '/scripts/main.dwl',
  languageLevel: "2.3.0"
};

export default state;
