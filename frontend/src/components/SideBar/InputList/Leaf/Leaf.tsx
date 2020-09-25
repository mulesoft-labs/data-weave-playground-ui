import * as React from 'react';
import { IProps } from './types';
import {getColorForFormat, getFormatFromMediaType} from 'fileSystem/helpers';
import { Icon } from 'components';

const styles = require('./Leaf.css');

class Leaf extends React.PureComponent<IProps> {
  handleClick = () => {
    this.props.onClick();
  };

  render() {
    const { label, level, node } = this.props;
    const format = getFormatFromMediaType(node.definition.mediaType);
    const color = getColorForFormat(format);

    return (
      <span className={styles.wrapper} style={{ paddingLeft: 16 + level * 12 }} onClick={this.handleClick}>
        <Icon
          name={format}
          size={{ width: 24, height: 8 }}
          viewBox={{ width: 18, height: 8 }}
          className={styles.badge}
          fill={color}
        />
        <span className={styles.label}>
          {label}
        </span>
      </span>
    );
  }
}

export default Leaf;
