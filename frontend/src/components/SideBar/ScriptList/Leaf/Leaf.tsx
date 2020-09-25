import * as React from 'react';
import * as classNames from 'classnames';
import { IProps } from './types';
const styles = require('./Leaf.css');

class Leaf extends React.PureComponent<IProps> {
  handleClick = () => {
    this.props.onClick();
  };

  handleDoubleClick = () => {
    this.props.onSetMainScript(this.props.node.id);
  };

  render() {
    const { label, level, node, selected } = this.props;
    const classes = classNames(styles.wrapper, { [styles.highlighted]: selected });
    return (
      <span
        className={classes}
        style={{ paddingLeft: 16 + level * 12 }}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
      >
        {label}.dwl
      </span>
    );
  }
}

export default Leaf;
