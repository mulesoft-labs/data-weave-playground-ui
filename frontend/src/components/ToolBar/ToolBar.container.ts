import { connect } from 'react-redux';
import ToolBar from './ToolBar';
import { IStore } from 'common/types';
import { mergeProps } from 'common/helpers';
import { IProps } from './types';
import { isToolBarOpen, getSelectedToolBarTab } from 'ui/selectors';
import { openToolBar, closeToolBar, selectToolBarTab } from 'ui/actions';

const mapState = (state: IStore): IProps => {
  return {
    isToolBarOpen: isToolBarOpen(state),
    selectedTab: getSelectedToolBarTab(state)
  };
};

const mapDispatch = dispatch => {
  return {
    onOpen: () => dispatch(openToolBar()),
    onClose: () => dispatch(closeToolBar()),
    onSelectTab: tab => dispatch(selectToolBarTab(tab))
  };
};

export default connect(mapState, mapDispatch, mergeProps)(ToolBar);
