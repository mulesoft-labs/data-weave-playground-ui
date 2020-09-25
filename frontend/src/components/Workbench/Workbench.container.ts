import { connect } from 'react-redux';
import { IStore } from 'common/types';
import { mergeProps } from 'common/helpers';
import Workbench from './Workbench';
import { isToolBarOpen } from 'ui/selectors';
import { IProps } from './types';
import { saveProject } from 'project/actions';

const mapState = (state: IStore): IProps => {
  return {
    isToolBarOpen: isToolBarOpen(state)
  };
};

const mapDispatch = dispatch => {
  return {
    onSaveProject: () => dispatch(saveProject())
  };
};

export default connect(mapState, mapDispatch, mergeProps)(Workbench);
