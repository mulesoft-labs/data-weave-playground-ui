import * as React from 'react';
import DropZone from 'react-dropzone';
import { IProps, IState } from './types';
import { Chooser, If, SplitPane } from 'components';
import ScriptList from './ScriptList/ScriptList.container';
import InputList from './InputList/InputList.container';
import InputEditor from './InputEditor/InputEditor.container';
import { getMediaTypeFromFormat, MediaTypeHelpers } from 'fileSystem/helpers';
import { Format } from 'fileSystem/types';
import { SideBarView } from 'ui/types';
const styles = require('./SideBar.css');

class SideBar extends React.PureComponent<IProps, IState> {
  getSupportedExtensions = () => {
    const extensions = MediaTypeHelpers.getSupportedExtensions();
    return extensions.map(ext => '.' + ext).join(', ');
  };

  handleCollapse = (width: number) => 0;

  handleDrop = (acceptedFiles: File[], rejectedFiles: File[]) => {
    const { selectedView } = this.props;

    if (acceptedFiles.length) {
      const reader = new FileReader();
      const file = acceptedFiles[0];
      const parts = file.name.split('.');
      const indentifier = parts.shift();
      const extension = parts.pop();
      const mediaType = getMediaTypeFromFormat(extension as Format);
      const isBinary = MediaTypeHelpers.isBinary(mediaType);

      reader.onload = e => {
        if (selectedView === SideBarView.LIST && extension === 'dwl') {
          this.props.onCreateScript(`/scripts/${indentifier}`, reader.result.toString());
        } else if (selectedView === SideBarView.LIST || selectedView === SideBarView.INPUT_EDITOR) {
          this.props.onCreateInput(
            `/inputs/${indentifier}.${extension}`,
            isBinary ? reader.result.toString().split('base64,').pop() : reader.result.toString() // readAsDataURL does Base64 magic
          );
        }

        this.setState({
          dropZoneActive: false
        });
      };

      const content = isBinary ? reader.readAsDataURL(file) : reader.readAsText(file);
    }
  };

  handleDragEnter = () => {
    this.setState({
      dropZoneActive: true
    });
  };

  handleDragLeave = () => {
    this.setState({
      dropZoneActive: false
    });
  };

  renderPanes = () => {
    return (
      <SplitPane
        className={styles.splitPane}
        direction="column"
        borderColor="#ccc"
        panelWidths={[{ minSize: 200 }, { minSize: 30 }]}
      >
        <InputList />
        <ScriptList />
      </SplitPane>
    );
  };

  render() {
    const { selectedView } = this.props;

    return (
      <div className={styles.wrapper}>
        <DropZone
          accept={this.getSupportedExtensions()}
          onDrop={this.handleDrop}
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          multiple={false}
          className={styles.fullSize}
          disableClick
        >
          <Chooser
            active={selectedView}
            className={styles.chooser}
            choices={{
              [SideBarView.LIST]: this.renderPanes(),
              [SideBarView.INPUT_EDITOR]: <InputEditor />
            }}
          />
        </DropZone>
      </div>
    );
  }
}

export default SideBar;
