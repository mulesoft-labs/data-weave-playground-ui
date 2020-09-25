import * as React from 'react';
import {IMarginGlyph, IProps} from './types';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main';


const styles = require('./Monaco.css');

declare var window;

class MonacoEditor extends React.Component<IProps> {
  __current_value: string;
  __prevent_trigger_change_event: boolean;
  editor: monaco.editor.IStandaloneCodeEditor;
  oldDecorations: string[] = [];
  containerElement: HTMLElement;

  static defaultProps: IProps = {
    width: '100%',
    height: '100%',
    value: null,
    defaultValue: '',
    language: 'javascript',
    theme: 'vs',
    options: {},
    editorDidMount: () => {},
    editorWillMount: () => {},
    onChange: () => {},
    requireConfig: {},
    loaderStyle: {},
    loaderSize: 100,
    decorations: []
  };

  constructor(props: IProps) {
    super(props);
    this.__current_value = props.value;
    this.__prevent_trigger_change_event = true;
    this.state = { isFocused: false };

    // Force update and rerender monaco editor to update the editor's dimensions
    // https://github.com/Microsoft/monaco-editor/issues/28#issuecomment-228523529
    window.addEventListener('FORCE_MONACO_UPDATE', this.handleForceUpdate);
  }

  handleForceUpdate = () => this.forceUpdate();

  gotComponent = (e: HTMLElement) => {
    if (e) this.containerElement = e;
  };

  componentWillUnmount() {
    window.removeEventListener('FORCE_MONACO_UPDATE', this.handleForceUpdate);
    this.destroyMonaco();
  }

  editorWillMount(monaco) {
    const { editorWillMount } = this.props;
    editorWillMount(monaco);
  }

  editorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco) {
    const { editorDidMount, onChange, onModelUpdate } = this.props;
    editorDidMount(editor, monaco);
    editor.onDidScrollChange(() => {
      if (this.oldDecorations.length) {
        window['TooltipManager'].addTo('.myGlyphMarginClass', 'Click to create new Input');
      }
    });
    editor.onDidChangeModel(e => {
      editor.getModel() &&
        this.props.onModelUpdate &&
        this.props.onModelUpdate(editor.getModel(), this.props.dw, this.props.scripts);
    });

    editor.getModel() &&
      this.props.onModelUpdate &&
      this.props.onModelUpdate(editor.getModel(), this.props.dw, this.props.scripts);
    editor.onDidChangeModelContent(event => {
      const value = editor.getValue();
      // Always refer to the latest value
      this.__current_value = value;
      // Only invoking when user input changed
      if (!this.__prevent_trigger_change_event) {
        onChange(value, event);
      }
    });
  }

  componentDidMount() {
    this.initMonaco();
  }

  initMonaco() {
    const value = this.props.value !== null ? this.props.value : this.props.defaultValue;
    let { language, theme, options } = this.props;

    options = {
      ...options,
      language: language,
      theme: theme,
      wordWrap: 'on',
      lineNumbersMinChars: 2,
      glyphMargin: true,
      scrollBeyondLastLine: false,
      minimap: {
        enabled: false
      },
      folding: true
    };

    if (typeof monaco !== 'undefined' && !this.editor) {
      // Before initializing monaco editor
      this.editorWillMount(monaco);
      this.editor = monaco.editor.create(this.containerElement, options);
      this.__prevent_trigger_change_event = true;
      this.setState({ ...this.state });
      this.editor.onDidBlurEditorText(() => this.props.onBlur && this.props.onBlur());
      this.editor.onDidFocusEditorText(() => this.props.onFocus && this.props.onFocus());
      // After initializing monaco editor
      this.editorDidMount(this.editor, monaco);
      const model = this.editor.getModel();
      this.props.onModelUpdate && this.props.onModelUpdate(model, this.props.dw, this.props.scripts);
      this.editor.setValue(value);
      this.__prevent_trigger_change_event = false;

      if (this.props.focus) {
        this.editor.focus();

        if (model) {
          this.editor.setPosition(
            new monaco.Position(model.getLineCount(), model.getLineMaxColumn(model.getLineCount()))
          );
          this.editor.revealPosition(
            new monaco.Position(model.getLineCount(), model.getLineMaxColumn(model.getLineCount()))
          );
        }
      }
    }
  }

  focus() {
    this.editor && this.editor.focus();
  }

  getDecorations = (glyphs: IMarginGlyph[]): monaco.editor.IModelDeltaDecoration[] => {
    const glyphTooltipMessages = {
      myGlyphMarginClass: 'Click to create new Input'
    };
    let decorations = [];
    for (let i = 0; i < glyphs.length; i++) {
      const glyph = glyphs[i];
      const id = 'g' + Math.random().toString(36).substr(2, 7);
      decorations.push({
        range: new monaco.Range(glyph.line, 1, glyph.line, 1),
        options: {
          isWholeLine: true,
          className: glyph.contentClassName,
          // we use id as a class because it's the only way
          glyphMarginClassName: `${glyph.marginClassName} ${id} tippy`
        }
      });
      window['GlyphManager'].add(id, glyphTooltipMessages[glyph.marginClassName], glyph.onClick);
    }
    return decorations;
  };

  componentWillReceiveProps(newProps: IProps) {
    if (this.editor) {
      this.editor.getModel() &&
        this.props.onModelUpdate &&
        this.props.onModelUpdate(this.editor.getModel(), newProps.dw, newProps.scripts);
    }
  }

  componentWillUpdate(newProps: IProps) {
    if (this.editor) {
      //this.editor.getModel() && this.props.onModelUpdate && this.props.onModelUpdate(this.editor.getModel());
      const deco = this.getDecorations(newProps.decorations);
      this.oldDecorations = this.editor.deltaDecorations(this.oldDecorations, deco);
      this.editor.layout();
      if (this.editor.getValue() != newProps.value || this.props.language != newProps.language) {
        this.__prevent_trigger_change_event = true;
        const oldPosition = this.editor.getPosition();
        const selection = this.editor.getSelections();
        const model = this.editor.getModel();

        if (this.props.language != newProps.language || !model) {
          this.editor.setModel(monaco.editor.createModel(newProps.value, newProps.language));
          if (model) model.dispose();
        } else {
          if (model) model.setValue(newProps.value);
          else this.editor.setValue(newProps.value);
        }

        if (this.editor.hasTextFocus()) {
          this.editor.setPosition(oldPosition);
          this.editor.setSelections(selection);
        }

        this.__prevent_trigger_change_event = false;
      }
    }
  }

  destroyMonaco = () => {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose();
    }
  };

  render() {
    const { width, height, loaderStyle, loaderSize, testId } = this.props;
    const fixedWidth = width.toString().indexOf('%') !== -1 ? width : `${width}px`;
    const fixedHeight = height.toString().indexOf('%') !== -1 ? height : `${height}px`;
    const className = this.props.className || '';
    const style = {
      width: fixedWidth,
      height: fixedHeight
    };

    return (
      <div
        key="monaco"
        ref={a => {
          this.containerElement = a;
        }}
        data-test-id={`${testId}-monaco-editor`}
        style={style}
        className={`react-monaco-editor-container ${className} ${this.props.focus ? 'focused' : ''} ${styles.wrapper}`}
      />
    );
  }
}

export default MonacoEditor;
