import { connect } from 'react-redux';
import { IStore } from 'common/types';
import { mergeProps } from 'common/helpers';
import InputEditor from './InputEditor';
import { IProps } from './types';
import { getTreeNodesFromInputs, getCurrentInput, getFormatFromCurrentInput } from 'project/selectors';
import { updateInput, renameInput } from 'project/actions';
import { selectView } from 'ui/actions';
import { SideBarView } from 'ui/types';

const mapState = (state: IStore): IProps => {
  return {
    currentInput: getCurrentInput(state),
    format: getFormatFromCurrentInput(state)
  };
};

const mapDispatch = dispatch => {
  return {
    onBack: () => dispatch(selectView(SideBarView.LIST)),
    onInputChange: (path, content) => dispatch(updateInput(path, content)),
    onRenameInput: (oldPath, newPath) => dispatch(renameInput(oldPath, newPath))
  };
};

export default connect(mapState, mapDispatch, mergeProps)(InputEditor);
