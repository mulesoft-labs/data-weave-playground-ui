import { connect } from 'react-redux';
import { IStore } from 'common/types';
import { mergeProps } from 'common/helpers';
import ApiReference from './ApiReference';
import { getAPIReferenceAnchor } from 'ui/selectors';
import { IProps } from './types';

const mapState = (state: IStore): IProps => {
  return {
    apiReferenceAnchor: getAPIReferenceAnchor(state)
  };
};

const mapDispatch = dispatch => {
  return {};
};

export default connect(mapState, mapDispatch, mergeProps)(ApiReference);
