import { IStore } from 'common/types';
import defaultUseCase from '../../../use_cases/default';
import { readDir, readFile } from 'fileSystem/selectors';
import createStore from '../../createStore';

describe('readDir', () => {
  it('should return a all files for the given path', () => {
    const store = createStore(defaultUseCase);
    expect(readDir('/input')(defaultUseCase)).toEqual({
      '/inputs/payload.json': {
        name: 'payload',
        path: '/inputs/payload.json',
        content: '{\n "message": "Hello world!"\n}',
        mediaType: 'application/json',
        hash: null,
        lastSavedHash: null
      },
      '/inputs/test.json': {
        name: 'test',
        path: '/inputs/test.json',
        content: '',
        mediaType: 'application/json',
        hash: null,
        lastSavedHash: null
      },
      '/inputs/example.xml': {
        name: 'example',
        path: '/inputs/example.xml',
        content: '<a>1</a>',
        mediaType: 'application/xml',
        hash: null,
        lastSavedHash: null
      },
      '/inputs/excel.xlsx': {
        name: 'excel',
        path: '/inputs/excel.xlsx',
        content: '',
        mediaType: 'application/xlsx',
        hash: null,
        lastSavedHash: null
      }
    });
  });

  it('should return an empty object when no matches are found', () => {
    const store = createStore(defaultUseCase);
    expect(readDir('/foo')(defaultUseCase)).toEqual({});
  });
});

describe('readFile', () => {
  it('should return the definition for payload.json', () => {
    const store = createStore(defaultUseCase);
    expect(readFile('/inputs/payload.json')(defaultUseCase)).toEqual({
      name: 'payload',
      path: '/inputs/payload.json',
      content: '{\n "message": "Hello world!"\n}',
      mediaType: 'application/json',
      hash: null,
      lastSavedHash: null
    });
  });

  it('should return null if no definition was found', () => {
    const store = createStore(defaultUseCase);
    expect(readFile('inputs/foo.json')(defaultUseCase)).toEqual(null);
  });
});
