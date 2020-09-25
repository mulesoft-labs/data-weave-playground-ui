import { connect } from 'react-redux';
import { IStore } from 'common/types';
import { mergeProps } from 'common/helpers';
import InputList from './InputList';
import { IProps } from './types';
import { getTreeNodesFromInputs, getCurrentInput } from 'project/selectors';
import { SideBarView } from 'ui/types';
import {selectView, selectInput, selectScript} from 'ui/actions';
import {createInput} from "project/actions";
import {getDefaultDataWeaveScript, getDefaultShape} from "project/helpers";
import {getMediaTypeFromFileName} from "fileSystem/helpers";

const mapState = (state: IStore): IProps => {
  return {
    inputs: getTreeNodesFromInputs(state),
    currentInput: getCurrentInput(state)
  };
};

const mapDispatch = dispatch => {
  return {
    onSelectInput: (id: string) => dispatch(selectInput(id)),
    onSelectView: (id: SideBarView) => dispatch(selectView(id)),
    onCreateInput: (path) => {
      dispatch(createInput(path, getDefaultShape(getMediaTypeFromFileName(path).mediaType)))
    }
  };
};

export default connect(mapState, mapDispatch, mergeProps)(InputList);
