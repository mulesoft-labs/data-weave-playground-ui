import { combineReducers } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import { IStore } from 'common/types';
import dataweave from 'dataweave/reducer';
import project from 'project/reducer';
import gist from 'gist/reducer';
import fileSystem from 'fileSystem/reducer';
import ui from 'ui/reducer';

export default enableBatching(
  combineReducers<IStore>({
    dataweave,
    project,
    gist,
    fileSystem,
    ui
  })
);
