import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import * as queryString from 'query-string';
import TooltipManager from 'managers/TooltipManager';
import GlyphManager from 'managers/GlyphManager';
import {DWWorkspace, setup as registerDWLanguage} from '@mulesoft/data-weave-monaco';
import createStore from './app/createStore';
import {fetchGist} from 'gist/actions';
import {fetchPreview, fetchWeaveTypes} from 'dataweave/actions';
import {getAllScriptsFlat} from "project/selectors";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main';

require('./global.css');

declare var module, window, process;

window['TooltipManager'] = new TooltipManager();
window['GlyphManager'] = new GlyphManager();

window.onbeforeunload = () => '';

/*
const token = localStorage.getItem('ghToken') ? JSON.parse(localStorage.getItem('ghToken')) : null;
if (!token) {
  window.location = process.env.LOGIN_URL;
}
*/

const rootEl = document.getElementById('root');
const store = createStore();

registerDWLanguage(monaco);

//Init the workspace
new DWWorkspace(monaco, getAllScriptsFlat(store.getState()), {});

store.dispatch(fetchPreview());
store.dispatch(fetchWeaveTypes());

// load gist
if (location.hash) {
    const parsedURL = queryString.parse(location.hash);
    if (parsedURL.project) {
        store.dispatch(fetchGist(parsedURL.project));
    }
}

function renderApp() {
    const App = require('./App').default;
    ReactDOM.render(
        <Provider store={store}>
            <App/>
        </Provider>,
        rootEl
    );
}

if (module.hot) {
    module.hot.accept('./App', () => {
        renderApp();
    });
}

renderApp();
