import { connect } from 'react-redux';
import { IStore } from 'common/types';
import { mergeProps } from 'common/helpers';
import PreviewPanel from './PreviewPanel';
import {
  getPreviewOutput,
  getPreviewStatus,
  getOutputFormatFromScript,
  getOutputMediaTypeFromScript
} from 'dataweave/selectors';
import { IProps } from './types';
import { updateScriptOutputMediaType } from 'project/actions';
import { MediaType } from 'fileSystem/types';

const mapState = (state: IStore): IProps => {
  return {
    status: getPreviewStatus(state),
    content: getPreviewOutput(state),
    format: getOutputFormatFromScript(state),
    mediaType: getOutputMediaTypeFromScript(state)
  };
};

const mapDispatch = dispatch => {
  return {
    onMediaTypeChange: (mediaType: MediaType) => dispatch(updateScriptOutputMediaType(mediaType))
  };
};

export default connect(mapState, mapDispatch, mergeProps)(PreviewPanel);
