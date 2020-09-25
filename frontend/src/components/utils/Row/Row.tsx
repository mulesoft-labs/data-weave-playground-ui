import * as React from 'react';
const styles = require('./styles.css');

class Row extends React.PureComponent<{}> {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.wrapper}>
        {children}
      </div>
    );
  }
}

export default Row;
