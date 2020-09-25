import { connect } from 'react-redux';
import { IStore } from 'common/types';
import { mergeProps } from 'common/helpers';
import Leaf from './Leaf';
import { IProps } from './types';
import { setMainScript } from 'project/actions';

const mapState = (state: IStore): IProps => {
  return {} as IProps;
};

const mapDispatch = dispatch => {
  return {
    onSetMainScript: (id: string) => dispatch(setMainScript(id))
  };
};

export default connect(mapState, mapDispatch, mergeProps)(Leaf);
