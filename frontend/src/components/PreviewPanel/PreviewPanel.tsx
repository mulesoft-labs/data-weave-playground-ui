import * as React from 'react';
import * as classNames from 'classnames';
import { Monaco, If, DiscreteSelector } from 'components';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import { IProps } from './types';
import { PreviewStatus } from 'dataweave/types';
import { MediaType } from 'fileSystem/types';
const styles = require('./PreviewPanel.css');

class PreviewPanel extends React.PureComponent<IProps> {
  handleMediaTypeChange = (value: string) => {
    this.props.onMediaTypeChange(value as MediaType);
  };

  render() {
    const { content, status, format, mediaType } = this.props;
    const hasError = status === PreviewStatus.ERROR;

    return (
      <div className={classNames(styles.wrapper, { [styles.error]: hasError })}>
        <div className={styles.title}>
          <div className={styles.leftItems}>Output</div>
          <DiscreteSelector
            className={styles.selector}
            value={mediaType}
            options={[
                {
                    label: MediaType.JSON,
                    value: MediaType.JSON
                },
                {
                    label: MediaType.XML,
                    value: MediaType.XML
                },
                {
                    label: MediaType.CSV,
                    value: MediaType.CSV
                },
                {
                    label: MediaType.DW,
                    value: MediaType.DW
                },
                {
                    label: MediaType.TXT,
                    value: MediaType.TXT
                },
                {
                    label: MediaType.YAML,
                    value: MediaType.YAML
                },
                {
                    label: MediaType.MULTIPART,
                    value: MediaType.MULTIPART
                },
                {
                    label: "URLEncoded",
                    value: MediaType.URL_ENCODED
                }


            ]}
            offset={{
              top: 12
            }}
            onSelect={this.handleMediaTypeChange}
          />
        </div>
        <If condition={status === PreviewStatus.SUCCESS}>
          <Monaco
            className={styles.editor}
            language={format}
            options={{
              readOnly: true
            }}
            value={content}
          />
        </If>
        <If condition={hasError}>
          <ErrorMessage content={content} />
        </If>
      </div>
    );
  }
}

export default PreviewPanel;
