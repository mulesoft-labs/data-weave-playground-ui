import * as React from 'react';
import { IProps } from './types';

class If extends React.PureComponent<IProps> {
  render() {
    const { condition, children } = this.props;
    return condition && children ? React.Children.only(children) : null;
  }
}

export default If;
