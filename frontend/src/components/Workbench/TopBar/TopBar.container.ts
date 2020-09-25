import {connect} from 'react-redux';
import {IStore} from 'common/types';
import {mergeProps} from 'common/helpers';
import TopBar from './TopBar';
import {getProjectName} from 'project/selectors';
import {isSavingProject, languageLevel} from 'ui/selectors';
import {renameProject} from 'project/actions';
import {IProps} from './types';


const mapState = (state: IStore): IProps => {
  return {
    projectName: getProjectName(state),
    isSavingProject: isSavingProject(state),
    languageLevel: languageLevel(state),
  };
};

const mapDispatch = (dispatch, ownProps: IProps) => {
  return {
    onRenameProject: (name: string) => dispatch(renameProject(name))
  };
};

export default connect(mapState, mapDispatch, mergeProps)(TopBar);
