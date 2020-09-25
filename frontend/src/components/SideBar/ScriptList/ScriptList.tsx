import * as React from 'react';
import {ITreeNode} from 'common/types';
import {TreeView, Monaco, Icon} from 'components';
import {IProps, IState} from './types';
import Folder from './Folder/Folder';
import Leaf from './Leaf/Leaf.container';
import CreationModal from './CreationModal/CreationModal';
import {IFile} from 'fileSystem/types';

const styles = require('./ScriptList.css');

class ScriptList extends React.PureComponent<IProps, IState> {
    state: IState = {
        isCreationModalVisible: false
    };

    handleNodeSelection = (node: ITreeNode<IFile>) => {
        this.props.onSelect(node.id);
    };

    handleCreateScript = (script?: { name: string; }) => {
        if (!this.state.isCreationModalVisible) {
            return this.setState({isCreationModalVisible: true});
        }

        let fileName: string;
        if (script.name.endsWith(".dwl")) {
            fileName = script.name
        } else {
            fileName = `${script.name}.dwl`;
        }
        let filePath = `/scripts/${fileName}`;
        this.props.onCreateScript(filePath);
        this.setState({isCreationModalVisible: false});
    };

    handleCloseCreationModal = () => {
        this.setState({isCreationModalVisible: false});
    };

    render() {
        const {mainScript, scripts} = this.props;
        const {isCreationModalVisible} = this.state;

        return (
            <div className={styles.wrapper}>
                <CreationModal
                    visible={isCreationModalVisible}
                    onCreate={this.handleCreateScript}
                    onCancel={this.handleCloseCreationModal}
                    title={"Create new script"}
                    validate={false}
                />

                <div className={styles.title}>
                    Script Explorer
                    <Icon
                        name="add"
                        className={styles.addButton}
                        tooltip="Create new Script"
                        tooltipDelay={350}
                        tooltipPosition="bottom"
                        onClick={this.handleCreateScript}
                    />
                </div>
                <TreeView
                    nodes={scripts}
                    onSelect={this.handleNodeSelection}
                    selected={mainScript}
                    leafRenderer={Leaf}
                    folderRenderer={Folder}
                />
            </div>
        );
    }
}

export default ScriptList;