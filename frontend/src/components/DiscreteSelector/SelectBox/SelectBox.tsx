import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IProps, IState } from './types';
const styles = require('./SelectBox.css');

class SelectBox extends React.PureComponent<IProps, IState> {
  static defaultProps = {
    offset: {
      top: 0,
      left: 0
    }
  };

  state: IState = {
    bound: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0
    }
  };

  componentDidMount() {
    this.setState({ bound: (ReactDOM.findDOMNode(this).parentNode as HTMLElement).getBoundingClientRect() });
  }

  handleClick = index => {
    this.props.onSelect(index);
  };

  renderOptions = () => {
    const { options } = this.props;
    return options.map((option, i) =>
      <div key={i} className={styles.item} onClick={() => this.handleClick(option.value)}>
        {option.label}
      </div>
    );
  };

  render() {
    const { offset } = this.props;
    const { bound } = this.state;
    const offsetTop = bound.top + bound.height + (offset.top || 0);
    const offsetLeft = bound.left + (offset.left || 0);
    return (
      <div className={styles.wrapper} style={{ top: offsetTop, left: offsetLeft, width: bound.width }}>
        {this.renderOptions()}
      </div>
    );
  }
}

export default SelectBox;
