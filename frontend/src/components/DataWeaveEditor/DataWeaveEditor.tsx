import * as React from 'react';
import HotKey from 'flareon';
import {IProps, IState} from './types';
import {DataWeaveMonaco} from 'components';
import {getDefaultShape} from 'project/helpers';
import {getFormatFromMediaType} from 'src/app/fileSystem/helpers';
import {ResourceInput} from "components/DataWeaveMonaco/types";
import {selectScript} from "ui/actions";
import {dispatch} from "d3-dispatch";

const styles = require('./DataWeaveEditor.css');

class DataWeaveEditor extends React.PureComponent<IProps, IState> {
  state = {
    decorations: [],
    justPasted: true
  };

  componentWillReceiveProps(nextProps: IProps) {
    return this.renderGlyphs(nextProps);
  }

  removeGlyph = (line: number) => {
    this.setState({
      decorations: this.state.decorations.filter(decoration => decoration.line !== line)
    });
  };

  renderGlyphs = (nextProps: IProps) => {
    const { inputs, onCreateInput, inputDirectives } = nextProps;
    const glyphs = inputDirectives.reduce((glyphs, input) => {
      if (!input) return;
      const format = getFormatFromMediaType(input.mediaType);
      const path = `/inputs/${input.name}.${format}`;
      const existingPath = Object.keys(inputs).find(path => path.indexOf(`/inputs/${input.name}`) === 0);

      if (!existingPath) {
        return [
          ...glyphs,
          {
            line: input.line,
            marginClassName: 'myGlyphMarginClass',
            onClick: () => {
              onCreateInput(path, getDefaultShape(input.mediaType));
              this.removeGlyph(input.line);
            }
          }
        ];
      } else {
        if (inputs[existingPath].mediaType !== input.mediaType) {
          this.props.onRenameInput(existingPath, path);
        }
      }
      return glyphs;
    }, []);
    this.setState({ decorations: glyphs });

    return Promise.resolve();
  };

  handleMonacoChange = (script: string) => {
    this.props.onUpdateScript(this.props.script.path, script);
  };

  handleOpenRequest = (resource: ResourceInput) => {
      let path = "/scripts" + resource.resource.path;
      if(this.props.onOpenScript && this.props.fileSystem[resource.resource.path]) {
          this.props.onOpenScript(path)
      }
      else
        console.log("[WARN] Ignoring as it is not present on local fs : " + path , this.props.fileSystem);
  };

  handlePaste = () => {
    this.setState({ justPasted: true });
  };

  render() {
    const { script, types } = this.props;
    console.log("Script", script);

    return (
      <div className={styles.wrapper}>
        <span className={styles.title}>
          Script:
          <span className={styles.filename}>{script.name}.dwl</span>
        </span>
        <HotKey
          className={styles.editor}
          handlers={{
            'ctrl+v': this.handlePaste,
            'cmd+v': this.handlePaste
          }}
          enabled={true}
        >
          {script
            ? <DataWeaveMonaco
                  onChange={this.handleMonacoChange}
                  decorations={this.state.decorations}
                  file={script}
                  types={types}
                  fileHash={script.hash}
                  openUrlRequested={this.handleOpenRequest}
              />
            : 'No dwFile present in the script'}
        </HotKey>
      </div>
    );
  }
}

export default DataWeaveEditor;
