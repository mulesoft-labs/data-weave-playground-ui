import { connect } from 'react-redux';
import SideBar from './SideBar';
import { IStore } from 'common/types';
import { mergeProps } from 'common/helpers';
import { IProps } from './types';
import { getCurrentInput } from 'project/selectors';
import { createScript, createInput } from 'project/actions';
import { getSelectedView } from 'ui/selectors';

const mapState = (state: IStore): IProps => {
  return {
    selectedView: getSelectedView(state)
  };
};

const mapDispatch = dispatch => {
  return {
    onCreateScript: (path, content) => dispatch(createScript(path, content)),
    onCreateInput: (path, content) => dispatch(createInput(path, content))
  };
};

export default connect(mapState, mapDispatch, mergeProps)(SideBar);
