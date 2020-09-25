import {connect} from 'react-redux';
import {IStore} from 'common/types';
import {mergeProps} from 'common/helpers';
import DataWeaveEditor from './DataWeaveEditor';
import {getAllInputs, getAllScriptsFlat, getCurrentScript} from 'project/selectors';
import {IProps} from './types';
import {createInput, renameInput, updateScript} from 'project/actions';
import {getInputDirectivesFromScript, getWeaveTypesForInputs} from 'dataweave/selectors';
import {selectScript} from "ui/actions";

const mapState = (state: IStore): IProps => {
  return {
    script: getCurrentScript(state),
    inputs: getAllInputs(state),
    types: getWeaveTypesForInputs(state),
    fileSystem: getAllScriptsFlat(state),
    inputDirectives: getInputDirectivesFromScript(state)
  };
};

const mapDispatch = (dispatch, ownProps: IProps) => {
  return {
    onUpdateScript: (path, content) => dispatch(updateScript(path, content)),
    onCreateInput: (path, content) => dispatch(createInput(path, content)),
    onRenameInput: (oldPath, newPath) => dispatch(renameInput(oldPath, newPath)),
    onOpenScript: (path) => dispatch(selectScript(path))
  };
};

export default connect(mapState, mapDispatch, mergeProps)(DataWeaveEditor);
