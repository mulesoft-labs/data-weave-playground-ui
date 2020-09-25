import thunk from 'redux-thunk';
import { IStore } from 'common/types';
import defaultUseCase from '../../../use_cases/default';
import {
  getCurrentScriptHeader,
  getMainScriptHeader,
  getInputDirectivesFromScript,
  getOutputMediaTypeFromScript
} from '../selectors';
import { updateScript } from 'project/actions';
import createStore from '../../createStore';
import { selectScript } from 'ui/actions';

describe('getCurrentScriptHeader', () => {
  it('should return the correct header lines for `/scripts/myDependency.dwl` in the default use case', () => {
    const store = createStore(defaultUseCase);
    store.dispatch(selectScript('/scripts/myDependency.dwl'));
    expect(getCurrentScriptHeader(store.getState())).toEqual(['%dw 2.0', 'var config = { port: 25565 }']);
  });
});

describe('getMainScriptHeader', () => {
  it('should return the correct header lines for `/scripts/main.dwl` in the default use case', () => {
    const store = createStore(defaultUseCase);
    store.dispatch(selectScript('/scripts/main.dwl'));
    expect(getMainScriptHeader(store.getState())).toEqual([
      '%dw 2.0',
      'input test application/json',
      'import config from MyDependency',
      'output application/json',
      ''
    ]);
  });
});

describe('getInputDirectivesFromScript', () => {
  it('should return the input directive definition for `test` in `/scripts/main.dwl` in the default use case', () => {
    const store = createStore(defaultUseCase);
    store.dispatch(selectScript('/scripts/main.dwl'));
    expect(getInputDirectivesFromScript(store.getState())).toEqual([
      {
        name: 'test',
        mediaType: 'application/json',
        line: 2
      }
    ]);
  });

  it('should support both application/* and text/* variants', () => {
    const store = createStore(defaultUseCase);
    store.dispatch(selectScript('/scripts/main.dwl'));
    store.dispatch(
      updateScript(
        '/scripts/main.dwl',
        `%dw 2.0\ninput test text/csv\ninput test2 application/csv\noutput application/json\n---\nlog("Hello world!")`
      )
    );
    expect(getInputDirectivesFromScript(store.getState())).toEqual([
      {
        name: 'test',
        mediaType: 'text/csv',
        line: 2
      },
      {
        name: 'test2',
        mediaType: 'application/csv',
        line: 3
      }
    ]);
  });

  it('should ignore application/java (unsupported mediatype)', () => {
    const store = createStore(defaultUseCase);
    store.dispatch(selectScript('/scripts/main.dwl'));
    store.dispatch(
      updateScript(
        '/scripts/main.dwl',
        `%dw 2.0\ninput test application/json\ninput test2 application/java\noutput application/json\n---\nlog("Hello world!")`
      )
    );
    expect(getInputDirectivesFromScript(store.getState())).toEqual([
      {
        name: 'test',
        mediaType: 'application/json',
        line: 2
      }
    ]);
  });

  it('should ignore malformed directives', () => {
    const store = createStore(defaultUseCase);
    store.dispatch(selectScript('/scripts/main.dwl'));
    store.dispatch(
      updateScript(
        '/scripts/main.dwl',
        `%dw 2.0\ninput tesapplication/java\ninput test application/json\noutput application/json\n---\nlog("Hello world!")`
      )
    );
    expect(getInputDirectivesFromScript(store.getState())).toEqual([
      {
        name: 'test',
        mediaType: 'application/json',
        line: 3
      }
    ]);
  });

  it('should return three input directive definitions when three valid input directives are present', () => {
    const store = createStore(defaultUseCase);
    store.dispatch(selectScript('/scripts/main.dwl'));
    store.dispatch(
      updateScript(
        '/scripts/main.dwl',
        `%dw 2.0\ninput test application/json\ninput test2 application/csv\nimport config from MyDependency\ninput test3 text/plain\noutput application/json\n---\nlog("Hello world!")`
      )
    );
    expect(getInputDirectivesFromScript(store.getState())).toEqual([
      {
        name: 'test',
        mediaType: 'application/json',
        line: 2
      },
      {
        name: 'test2',
        mediaType: 'application/csv',
        line: 3
      },
      {
        name: 'test3',
        mediaType: 'text/plain',
        line: 5
      }
    ]);
  });
});

describe('getOutputMediaTypeFromScript', () => {
  it('should return `application/json` for `/scripts/main.dwl` in the default use case', () => {
    const store = createStore(defaultUseCase);
    store.dispatch(selectScript('/scripts/main.dwl'));
    expect(getOutputMediaTypeFromScript(store.getState())).toEqual('application/json');
  });

  it('should support both application/* and text/*', () => {
    const store = createStore(defaultUseCase);
    store.dispatch(selectScript('/scripts/main.dwl'));
    store.dispatch(
      updateScript('/scripts/main.dwl', `%dw 2.0\ninput test text/csv\noutput text/csv\n---\nlog("Hello world!")`)
    );
    expect(getOutputMediaTypeFromScript(store.getState())).toEqual('text/csv');
  });
});
