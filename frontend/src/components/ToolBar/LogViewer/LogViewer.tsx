import * as React from 'react';
import * as classNames from 'classnames';
import { IProps, IState } from './types';
import { Icon, If } from 'components';
const styles = require('./LogViewer.css');

class LogViewer extends React.PureComponent<IProps, IState> {
  state = {
    filter: ''
  };

  renderEntries = (filter: string) => {
    return this.props.entries.reduce((entries, entry, i) => {
      if (filter && !entry.message.toLowerCase().includes(filter)) return entries;
      return [
        ...entries,
        <div key={`log-entry-${i}`} className={styles.entry}>
          <span className={styles.message}>
            {entry.message}
          </span>
          <span className={styles.timestamp}>
            {entry.timestamp}
          </span>
        </div>
      ];
    }, []);
  };

  handleFilter = e => {
    const value: string = e.target.value.toLowerCase().trim();
    if (value === '') return this.setState({ filter: null });
    return this.setState({ filter: value });
  };

  handleClearLogs = () => {
    this.props.onClearLogs();
  };

  handleGoToAPIReference = (anchor: string) => {
    this.props.onGoToAPIReference(anchor);
  };

  render() {
    const { entries } = this.props;
    const { filter } = this.state;
    const hasEntries = entries.length > 0;
    const classes = classNames(styles.wrapper, { [styles.notice]: !hasEntries });

    return (
      <div className={classes}>
        <If condition={hasEntries}>
          <div className={styles.entryContainer}>
            <div className={styles.tools}>
              <Icon
                name="clear"
                className={styles.clearButton}
                size={16}
                viewBox={24}
                tooltip="Clear logs"
                tooltipPosition="bottom"
                onClick={this.handleClearLogs}
              />
              <input className={styles.filter} placeholder="Filter" onChange={this.handleFilter} value={filter} />
            </div>
            <div className={styles.overflowContainer}>
              {this.renderEntries(filter)}
            </div>
          </div>
        </If>
        <If condition={!hasEntries}>
          <div className={styles.noticeWrapper} data-test-id="log-viewer-notice">
            <span className={styles.mainText}>No logs available</span>
            <span className={styles.subText}>
              Learn more about the <span className={styles.pre}>log()</span> function in the{' '}
              <span className={styles.action} onClick={() => this.handleGoToAPIReference('log')}>
                API Reference
              </span>
            </span>
          </div>
        </If>
      </div>
    );
  }
}

export default LogViewer;
