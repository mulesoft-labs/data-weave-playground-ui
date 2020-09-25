import * as React from 'react';
import { IProps } from './types';
import { Icon } from 'components';
const styles = require('./Folder.css');

class Folder extends React.PureComponent<IProps> {
  state = {
    collapsed: false
  };

  handleCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    const { label, level, children } = this.props;
    const { collapsed } = this.state;
    return (
      <div className={styles.wrapper}>
        <span className={styles.label} style={{ paddingLeft: 16 + level * 12 }} onClick={this.handleCollapse}>
          <Icon name={collapsed ? 'rightArrow' : 'openedArrow'} size={8} className={styles.folderIcon} /> {label}
        </span>
        {!collapsed && children}
      </div>
    );
  }
}

export default Folder;
