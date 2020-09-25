import * as React from 'react';
import { IProps } from './types';
const styles = require('./ErrorMessage.css');

class ErrorMessage extends React.PureComponent<IProps> {
  render() {
    const { content } = this.props;

    return (
      <pre className={styles.wrapper}>
        {content}
      </pre>
    );
  }
}

export default ErrorMessage;
