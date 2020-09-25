import * as React from 'react';
import { IProps } from './types';
const styles = require('./Folder.css');

class Folder extends React.PureComponent<IProps> {
  handleCollapse = () => {
    this.props.onCollapse();
  };

  render() {
    const { label, level, children } = this.props;
    return (
      <div className={styles.wrapper}>
        <span className={styles.label} style={{ paddingLeft: 16 + level * 12 }} onClick={this.handleCollapse}>
          &gt; {label}
        </span>
        {children}
      </div>
    );
  }
}

export default Folder;
