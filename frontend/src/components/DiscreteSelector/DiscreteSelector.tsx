import * as React from 'react';
import * as classNames from 'classnames';
import { Icon, If, ClickOutside } from 'components';
import { IProps, IState } from './types';
import SelectBox from './SelectBox/SelectBox';
const styles = require('./DiscreteSelector.css');

class DiscreteSelector extends React.PureComponent<IProps, IState> {
  state: IState = {
    selectedOption: this.props.value || this.props.options[0].value,
    isOpen: false
  };

  componentWillReceiveProps(nextProps: IProps, nextState: IState) {
    if (this.state.selectedOption !== nextProps.value) {
      this.setState({ selectedOption: nextProps.value });
    }
  }

  handleSelect = (value: string) => {
    this.setState({ selectedOption: value, isOpen: false });
    if (this.props.onSelect) {
      this.props.onSelect(value);
    }
  };

  handleToggleMenu = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleClickOutside = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { options, offset, className } = this.props;
    const { selectedOption, isOpen } = this.state;
    const foundOption = options.find($ => $.value === selectedOption);
    const selectedLabel = foundOption ? foundOption.label : selectedOption;
    const filteredOptions = options.filter($ => $.value !== selectedOption);
    const outsideClasses = classNames(styles.wrapper, className);
    const wrapperClasses = classNames(styles.wrapper, { [styles.active]: isOpen });

    return (
      <ClickOutside onClickOutside={this.handleClickOutside} className={outsideClasses}>
        <div className={wrapperClasses} onClick={this.handleToggleMenu}>
          <span className={styles.label}>
            {selectedLabel}
          </span>
          <Icon name={isOpen ? 'closedArrow' : 'openedArrow'} className={styles.toggleIcon} size={8} />
        </div>
        <If condition={isOpen}>
          <SelectBox options={filteredOptions} onSelect={this.handleSelect} offset={offset} />
        </If>
      </ClickOutside>
    );
  }
}

export default DiscreteSelector;
