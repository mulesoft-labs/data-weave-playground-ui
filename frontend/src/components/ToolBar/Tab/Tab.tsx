import * as React from 'react';
import * as classNames from 'classnames';
import { Icon } from 'components';
import { IProps } from './types';
const styles = require('./Tab.css');

class Tab extends React.PureComponent<IProps> {
  handleClick = () => {
    this.props.onClick();
  };

  render() {
    const { label, shortcut, icon } = this.props;
    return (
      <div
        className={classNames(styles.wrapper, 'tippy')}
        data-position="top"
        data-delay="350"
        title={`Show ${label} (${shortcut})`}
        onClick={this.handleClick}
        data-test-id={label.toLowerCase().replace(/\s/, '-') + '-tab'}
      >
        <Icon className={styles.icon} name={icon} size={16} />
        <span className={styles.label}>
          {label}
        </span>
      </div>
    );
  }
}

export default Tab;
