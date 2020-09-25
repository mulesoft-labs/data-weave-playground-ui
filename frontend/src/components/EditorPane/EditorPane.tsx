import * as React from 'react';
import { Row, PreviewPanel, SideBar, DataWeaveEditor, SplitPane } from 'components';
const styles = require('./styles.css');

const Handle = props => <div className={styles.handle} {...props} />;

class EditorPane extends React.PureComponent<{}, {}> {
  constructor(props) {
    super(props);
    window.addEventListener('resize', () => {
      this.forceUpdate();
    });
  }

  handleResize = () => {
    // check Monaco component for more info
    window.dispatchEvent(new Event('FORCE_MONACO_UPDATE'));
  };

  render() {
    const {} = this.props;
    return (
      <SplitPane
        direction="row"
        onUpdate={this.handleResize}
        borderColor="#ccc"
        panelWidths={[
          { size: 0.25 * window.innerWidth, minSize: 200 },
          { size: 0.45 * window.innerWidth, minSize: 200 },
          { size: 0.3 * window.innerWidth, minSize: 200 }
        ]}
      >
        <SideBar />
        <DataWeaveEditor />
        <PreviewPanel />
      </SplitPane>
    );
  }
}

export default EditorPane;
