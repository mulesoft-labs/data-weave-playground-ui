import * as React from 'react';
const styles = require('./Warning.css');

export interface IProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  index?: number;
}

export interface IState {}

class Warning extends React.PureComponent<IProps, IState> {
  private topOffset = 100;
  private elementHeight = 50;

  static defaultProps: Pick<IProps, 'index'> = {
    index: 0
  };

  render() {
    const { message, actionLabel, onAction, index } = this.props;
    return (
      <div className={styles.wrapper} style={{ top: this.topOffset + this.elementHeight * index }}>
        {message}
        <span className={styles.action} onClick={onAction}>
          {actionLabel}
        </span>
      </div>
    );
  }
}

export default Warning;
