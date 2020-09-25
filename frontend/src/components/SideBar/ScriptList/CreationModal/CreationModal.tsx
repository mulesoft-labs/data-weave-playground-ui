import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormField, Select, Button, TextField } from 'components';
import { IProps, IState } from './types';

import { validate } from './helpers';
const styles = require('./CreationModal.css');

class CreationModal extends React.PureComponent<IProps, IState> {
  state: IState = {
    identifier: { value: '', errors: [] },
    submitEnabled: false
  };

  handleCreate = () => {
    this.props.onCreate({ name: this.state.identifier.value });
    this.resetState();
  };

  handleCancel = () => {
    this.props.onCancel();
    this.resetState();
  };

  handleIdentifierChange = (evt: any) => {
    const { value } = evt;

    if (value.trim().length) {
      const validationResult = (this.props.validate)? validate('identifier', value) : {valid: true};
      if (!validationResult.valid) {
        return this.setState({ identifier: { value, errors: validationResult.errors }, submitEnabled: false });
      }
    } else {
      return this.setState({ identifier: { value, errors: [] }, submitEnabled: false });
    }

    return this.setState({ identifier: { value, errors: [] }, submitEnabled: true });
  };

  resetState = () => {
    this.setState({
      identifier: { value: '', errors: [] },
      submitEnabled: false
    });
  };

  render() {
    const { visible, title } = this.props;
    const { identifier,  submitEnabled } = this.state;

    if (!visible) return null;

    return (
      <Modal onEsc={this.handleCancel} onClickOverlay={this.handleCancel} onEnter={this.handleCreate}>
        <ModalHeader>
          <h1>{title}</h1>
        </ModalHeader>
        <ModalBody className={styles.body}>
          <FormField
            label="Identifier"
            help="The name to be used as an identifier for this script"
            errors={identifier.errors}
          >
            <TextField value={identifier.value}  onChange={this.handleIdentifierChange} autoFocus={true}  />
          </FormField>
        </ModalBody>
        <ModalFooter>
          <Button kind="tertiary" onClick={this.handleCancel} noFill>
            Cancel
          </Button>
          <Button kind="primary" onClick={this.handleCreate} disabled={!submitEnabled}>
            Create
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CreationModal;
