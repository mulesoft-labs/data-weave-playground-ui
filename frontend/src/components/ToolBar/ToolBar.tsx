import * as React from 'react';
import { Icon, Chooser } from 'components';
import Tab from './Tab/Tab';
import LogViewer from './LogViewer/LogViewer.container';
import ApiReference from './ApiReference/ApiReference.container';
import { IProps } from './types';
import { ToolBarTab } from 'ui/types';
const styles = require('./ToolBar.css');

class ToolBar extends React.PureComponent<IProps> {
  handleLogViewerClick = () => {
    if (!this.props.isToolBarOpen) {
      this.props.onOpen();
    } else {
      if (this.props.selectedTab === ToolBarTab.LOG_VIEWER) {
        this.props.onClose();
      }
    }
    this.props.onSelectTab(ToolBarTab.LOG_VIEWER);
  };

  handleApiReferenceClick = () => {
    if (!this.props.isToolBarOpen) {
      this.props.onOpen();
    } else {
      if (this.props.selectedTab === ToolBarTab.API_REFERENCE) {
        this.props.onClose();
      }
    }
    this.props.onSelectTab(ToolBarTab.API_REFERENCE);
  };

  render() {
    const { selectedTab } = this.props;
    return (
      <div className={styles.wrapper}>
        <div className={styles.tabs}>
          <Tab label="Log Viewer" icon="logs" shortcut="⇧⌘L" onClick={this.handleLogViewerClick} />
          <Tab label="API Reference" icon="docs" shortcut="⇧⌘L" onClick={this.handleApiReferenceClick} />
        </div>

        <Chooser className={styles.content} choices={[<LogViewer />, <ApiReference />]} active={selectedTab} />
      </div>
    );
  }
}

export default ToolBar;
