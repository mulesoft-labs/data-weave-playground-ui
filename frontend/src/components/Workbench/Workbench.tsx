import * as React from 'react';
import HotKey from 'flareon';
import {EditorPane, SplitPane, ToolBar} from 'components';
import {IProps} from './types';
import TopBar from './TopBar/TopBar.container';
import {DWLanguageClient} from "@mulesoft/data-weave-monaco/dist/language";

const styles = require('./Workbench.css');

const Handle = props => <div className={styles.handle} {...props} />;
const handleWidth = 3;
class Workbench extends React.PureComponent<IProps> {
  state = {
    toolbarHeight: 25
  };

  constructor(props) {
    super(props);
    window.addEventListener('resize', () => {
      this.forceUpdate();
    });
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (!this.props.isToolBarOpen && nextProps.isToolBarOpen) {
      this.setState({
        toolbarHeight: 250
      });
    } else if (this.props.isToolBarOpen && !nextProps.isToolBarOpen) {
      this.setState({
        toolbarHeight: 25
      });
    }
  }

  handleResize = () => {
    // check Monaco component for more info
    window.dispatchEvent(new Event('FORCE_MONACO_UPDATE'));
  };

  handleSaveProject = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.props.onSaveProject();
  };

  render() {
    const { toolbarHeight } = this.state;
    const topbarHeight = 60;

    return (
      <HotKey
        className={styles.editor}
        handlers={{
          'ctrl+s': this.handleSaveProject,
          'cmd+s': this.handleSaveProject
        }}
        enabled={true}
      >
        <TopBar />
        <SplitPane
          className={styles.wrapper}
          direction="column"
          borderColor="#ccc"
          panelWidths={[
            { size: window.innerHeight - toolbarHeight - topbarHeight, minSize: 200 },
            { size: toolbarHeight, minSize: 30 }
          ]}
          onUpdate={this.handleResize}
        >
          <EditorPane />
          <ToolBar />
        </SplitPane>
      </HotKey>
    );
  }
}

export default Workbench;
