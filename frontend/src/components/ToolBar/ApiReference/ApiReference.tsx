import * as React from 'react';
import { IProps, IState } from './types';
const styles = require('./ApiReference.css');

class DocumentationView extends React.Component<IProps, IState> {
  state = {
    url: this.getUrl(this.props.apiReferenceAnchor)
  };

  componentWillReceiveProps(nextProps: IProps) {
    const url = this.getUrl(nextProps.apiReferenceAnchor);
    // hack to refresh iframe
    this.setState({ url: this.getUrl(null) }, () => {
      this.setState({ url });
    });
  }

  getUrl(anchor: string) {
    const baseUrl = 'http://wdocs-2.2.0.s3.amazonaws.com/index.html';
    const url = anchor ? baseUrl + `#_${anchor}` : baseUrl;
    return url;
  }

  render() {
    const { url } = this.state;

    return <iframe src={url} frameBorder="0" className={styles.iframe} />;
  }
}

export default DocumentationView;
