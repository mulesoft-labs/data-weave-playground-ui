import * as React from 'react';
import { IProps } from './types';

class ClickOutside extends React.PureComponent<IProps> {
  private container;

  componentDidMount() {
    document.addEventListener('mousedown', this.handle, true);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handle, true);
  }

  getContainer = ref => {
    this.container = ref;
  };

  handle = e => {
    const { onClickOutside } = this.props;
    const el = this.container;
    if (!el.contains(e.target)) onClickOutside(e);
  };

  render() {
    const { children, onClickOutside, ...props } = this.props;
    return (
      <div ref={this.getContainer} {...props}>
        {children}
      </div>
    );
  }
}

export default ClickOutside;
