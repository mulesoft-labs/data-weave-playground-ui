import * as React from 'react';
import { IProps } from './types';

class Chooser extends React.PureComponent<IProps> {
  render() {
    const { active, choices, className } = this.props;
    return (
      <div className={className}>
        {choices[active]}
      </div>
    );
  }
}

export default Chooser;
