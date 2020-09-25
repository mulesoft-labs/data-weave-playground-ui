import { IFileSystemState, MediaType } from 'fileSystem/types';
import { mockFile } from './helpers';

const state: IFileSystemState = {
  files: {
    '/inputs/payload.json': mockFile(
      'payload',
      '/inputs/payload.json',
      '{\n "message": "Hello world!"\n}',
      MediaType.JSON,
      null,
      null
    ),
    '/inputs/test.json': mockFile('test', '/inputs/test.json', '', MediaType.JSON, null, null),
    '/inputs/example.xml': mockFile('example', '/inputs/example.xml', '<a>1</a>', MediaType.XML, null, null),
    '/inputs/excel.xlsx': mockFile('excel', '/inputs/excel.xlsx', '', MediaType.XLSX, null, null),
    '/scripts/main.dwl': mockFile(
      'main',
      '/scripts/main.dwl',
      '%dw 2.0\ninput test application/json\nimport config from MyDependency\noutput application/json\n---\npayload',
      MediaType.DW,
      null,
      null
    ),
    '/scripts/myDependency.dwl': mockFile(
      'myDependecy',
      '/scripts/myDependency.dwl',
      '%dw 2.0\nvar config = { port: 25565 }',
      MediaType.DW,
      null,
      null
    )
  },
  modifiedFiles: []
};

export default state;
