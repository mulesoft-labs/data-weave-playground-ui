import * as React from 'react';
import * as classNames from 'classnames';
import { If, Label, Icon } from 'components';
import { IProps } from './types';
const styles = require('./FormField.css');

class FormField extends React.PureComponent<IProps> {
  static defaultProps: Pick<IProps, 'errors' | 'help' | 'className'> = {
    errors: [],
    help: null,
    className: ''
  };

  renderChildren = (child, hasErrors: boolean) => {
    return React.cloneElement(child as any, { isValid: !hasErrors, isDirty: hasErrors });
  };

  render() {
    const { label, errors, className, children, help } = this.props;
    const hasErrors = !!errors.length;

    return (
      <div className={classNames(styles.container, className)}>
        <Label className={classNames(styles.label, { [styles.error]: hasErrors })}>
          {label}
          <If condition={!!help}>
            <Icon name="help" tooltip={help} tooltipPosition="top" />
          </If>
        </Label>

        {this.renderChildren(React.Children.only(children), hasErrors)}

        <If condition={hasErrors}>
          <ul className={styles.error}>
            {errors.map(error =>
              <li>
                {error}
              </li>
            )}
          </ul>
        </If>
      </div>
    );
  }
}

export default FormField;
