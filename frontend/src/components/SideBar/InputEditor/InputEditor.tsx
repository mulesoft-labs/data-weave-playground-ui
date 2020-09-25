import * as React from 'react';
import * as debounce from 'p-debounce';
import { Monaco, Icon, DiscreteSelector } from 'components';
import { IProps } from './types';
import { MediaType } from 'fileSystem/types';
import {isBinary, getDetailsFromPath, getFormatFromMediaType, DATA_FORMATS} from 'fileSystem/helpers';
import { If } from 'src/components/utils';
const styles = require('./InputEditor.css');

class InputEditor extends React.PureComponent<IProps> {
  handleBackButton = () => {
    this.props.onBack();
  };

  handleMonacoChange = debounce((value: string) => {
    this.props.onInputChange(this.props.currentInput.path, value);
  }, 200);

  handleMediaTypeChange = (mediaType: MediaType) => {
    const oldPath = this.props.currentInput.path;
    const details = getDetailsFromPath(oldPath);
    const newFormat = getFormatFromMediaType(mediaType);
      let newPath = oldPath.replace(new RegExp(`${details.format}$`), newFormat);
      this.props.onRenameInput(oldPath, newPath);
  };

  render() {
    const { currentInput, format } = this.props;
    const isBinaryFile = isBinary(this.props.currentInput.mediaType);

    return (
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <div className={styles.leftItems}>
            <Icon
              name="back"
              className={styles.backButton}
              tooltip="Back to Input Explorer"
              tooltipDelay={350}
              tooltipPosition="bottom"
              onClick={this.handleBackButton}
            />
            {currentInput.name}
          </div>
          <If condition={!isBinaryFile}>
            <DiscreteSelector
              className={styles.selector}
              value={currentInput.mediaType}
              options={DATA_FORMATS.map((dataFormat) => {
                  return {
                      value: dataFormat.mediaType,
                      label: dataFormat.format
                  }
              })}
              offset={{
                top: 12
              }}
              onSelect={this.handleMediaTypeChange}
            />
          </If>
        </div>
        <If condition={isBinaryFile}>
          <div className={styles.binaryOverlay}>Binary Data</div>
        </If>
        <If condition={!isBinaryFile}>
          <Monaco
            language={format}
            options={{ wordWrap: 'off' }}
            onChange={this.handleMonacoChange}
            value={currentInput.content}
          />
        </If>
      </div>
    );
  }
}

export default InputEditor;
