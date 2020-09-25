import * as React from 'react';
import { TreeView, SplitPane, Monaco, Icon } from 'components';
import Folder from './Folder/Folder';
import Leaf from './Leaf/Leaf';
import { IProps, IState } from './types';
import { ITreeNode } from 'common/types';
import { IFile } from 'fileSystem/types';
import { SideBarView } from 'ui/types';
import CreationModal from '../ScriptList/CreationModal/CreationModal';
import {getFileExtension} from "fileSystem/helpers";
const styles = require('./InputList.css');

class InputList extends React.PureComponent<IProps, IState> {

    state: IState = {
        isCreationModalVisible: false
    };

  handleTreeSelection = (node: ITreeNode<IFile>) => {
    this.props.onSelectInput(node.id);
    this.props.onSelectView(SideBarView.INPUT_EDITOR);
  };

  handleShowCreateInput = () => {
      if (!this.state.isCreationModalVisible) {
          return this.setState({isCreationModalVisible: true});
      }
  };

  handleCreateInput = (script?: { name: string;}) => {
      if(script.name) {
          var fileName = script.name;
          if (getFileExtension(fileName) == null) {
              fileName = fileName + ".json";
          }
          this.props.onCreateInput(`/inputs/${fileName}`);
          this.setState({isCreationModalVisible: false});
      }
  };


    handleCloseCreationModal = () => {
        this.setState({ isCreationModalVisible: false });
    };

  render() {
    const { inputs, currentInput } = this.props;
    const { isCreationModalVisible } = this.state;

    return (
      <div className={styles.wrapper}>
          <CreationModal
              visible={isCreationModalVisible}
              onCreate={this.handleCreateInput}
              onCancel={this.handleCloseCreationModal}
              title={"Create new input"}
              validate={false}
          />

        <div className={styles.title}>
          Input Explorer
          {<Icon
            name="add"
            className={styles.addButton}
            tooltip="Create new Input"
            tooltipDelay={350}
            tooltipPosition="bottom"
            onClick={this.handleShowCreateInput}
          />}
        </div>
        <TreeView
          nodes={inputs}
          onSelect={this.handleTreeSelection}
          selected={currentInput ? currentInput.name : null}
          folderRenderer={Folder}
          leafRenderer={Leaf}
        />
      </div>
    );
  }
}

export default InputList;
