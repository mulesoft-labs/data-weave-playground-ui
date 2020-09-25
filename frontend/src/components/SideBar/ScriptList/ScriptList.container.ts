import { connect } from 'react-redux';
import { IStore } from 'common/types';
import { mergeProps } from 'common/helpers';
import ScriptList from './ScriptList';
import { IProps } from './types';
import { getTreeNodesFromScripts, getMainScriptPath } from 'project/selectors';
import { createScript } from 'project/actions';
import { selectScript, selectInput } from 'ui/actions';
import { getDefaultDataWeaveScript } from 'project/helpers';

const mapState = (state: IStore): IProps => {
  return {
    mainScript: getMainScriptPath(state),
    scripts: getTreeNodesFromScripts(state)
  };
};

const mapDispatch = dispatch => {
  return {
    onSelect: (path: string) => dispatch(selectScript(path)),
    onCreateScript: (path) => {
      dispatch(createScript(path, getDefaultDataWeaveScript()))
      dispatch(selectScript(path))
    }
  };
};

export default connect(mapState, mapDispatch, mergeProps)(ScriptList);
