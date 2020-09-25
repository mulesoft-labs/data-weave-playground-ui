import { connect } from 'react-redux';
import LogViewer from './LogViewer';
import { IStore } from 'common/types';
import { mergeProps } from 'common/helpers';
import { IProps } from './types';
import { getLogEntries } from 'dataweave/selectors';
import { updateLogs } from 'dataweave/actions';
import { goToAPIReference } from 'ui/actions';

const mapState = (state: IStore): IProps => {
  return {
    entries: getLogEntries(state)
  };
};

const mapDispatch = dispatch => {
  return {
    onClearLogs: () => dispatch(updateLogs([])),
    onGoToAPIReference: (anchor: string) => dispatch(goToAPIReference(anchor))
  };
};

export default connect(mapState, mapDispatch, mergeProps)(LogViewer);
