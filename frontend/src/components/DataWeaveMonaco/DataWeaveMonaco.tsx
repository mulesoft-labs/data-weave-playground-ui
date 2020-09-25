import * as React from 'react';
import {IMarginGlyph, IProps, ResourceInput} from './types';
import {IDictionary} from 'common/types';
import {Spinner} from 'components';
import {DWLanguageClient} from "@mulesoft/data-weave-monaco/dist/language";
import {IFile} from "fileSystem/types";
import {toScriptFilePath} from "fileSystem/helpers";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main';
import {StandaloneCodeEditorServiceImpl} from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeServiceImpl';

const styles = require('./DataWeaveMonaco.css');
declare var window;

class DataWeaveMonaco extends React.Component<IProps> {
    private monaco;

    __current_value: string;
    __prevent_trigger_change_event: boolean;
    oldDecorations: string[] = [];
    editor: monaco.editor.IStandaloneCodeEditor;
    containerElement: HTMLElement;

    static defaultProps: IProps = {
        width: '100%',
        height: '100%',
        theme: 'vs',
        options: {},
        onChange: () => {
        },
        loaderStyle: {},
        loaderSize: 100,
        decorations: [],
        file: null,
        types: {},
        fileHash: ''
    };

    constructor(props: IProps) {
        super(props);
        this.__prevent_trigger_change_event = true;
        this.state = {isFocused: false};

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

    componentDidMount() {
        this.initMonaco();
    }

    editorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco) {
        const {onChange} = this.props;

        editor.onDidScrollChange(() => {
            if (this.oldDecorations.length) {
                window['TooltipManager'].addTo('.myGlyphMarginClass', 'Click to create new Input');
            }
        });

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


    async initMonaco() {
        let {theme, options} = this.props;
        let openUrlRequested = this.props.openUrlRequested;

        options = {
            ...options,
            theme: theme,
            wordWrap: 'on',
            lineNumbersMinChars: 2,
            glyphMargin: true,
            scrollBeyondLastLine: false,
            minimap: {
                enabled: false
            },
            folding: true,
            language: 'dw'
        };

        if (typeof monaco !== 'undefined') {
            // Before initializing monaco editor
            this.monaco = monaco;
            this.editor = monaco.editor.create(this.containerElement, options, {});

            StandaloneCodeEditorServiceImpl.prototype.doOpenEditor = function (editor, input) {
                const model = this.findModel(editor, input.resource);
                //set editor to new model
                if (model) {
                    editor.setModel(model);
                    const selection = input.options.selection;
                    if (selection) {
                        if (typeof selection.endLineNumber === 'number' && typeof selection.endColumn === 'number') {
                            editor.setSelection(selection);
                            editor.revealRangeInCenter(selection, 1 /* Immediate */);
                        } else {
                            var pos = {
                                lineNumber: selection.startLineNumber,
                                column: selection.startColumn
                            };
                            editor.setPosition(pos);
                            editor.revealPositionInCenter(pos, 1 /* Immediate */);
                        }
                    }
                    return editor;
                }else{
                    if (input.resource) {
                        openUrlRequested(input)
                    }
                    return null;
                }
            };


            this.openFile(await this.props.file, this.props.types);
            this.__prevent_trigger_change_event = true;
            this.setState({...this.state});
            this.editor.onDidBlurEditorText(() => this.props.onBlur && this.props.onBlur());
            this.editor.onDidFocusEditorText(() => this.props.onFocus && this.props.onFocus());
            // After initializing monaco editor
            this.editorDidMount(this.editor, monaco);
            const model = this.editor.getModel();
            this.__prevent_trigger_change_event = false;

            if (this.props.focus) {
                this.focusOnEditor(model);
            }
        }
        this.componentWillReceiveProps(this.props);
    }

    private focusOnEditor(model: monaco.editor.IModel) {
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

    componentWillUpdate(newProps: IProps) {
        if (this.editor) {
            //this.editor.getModel() && this.props.onModelUpdate && this.props.onModelUpdate(this.editor.getModel());
            const deco = this.getDecorations(newProps.decorations);
            this.oldDecorations = this.editor.deltaDecorations(this.oldDecorations, deco);
            this.editor.layout();
        }
    }

    destroyMonaco = () => {
        if (typeof this.editor !== 'undefined') {
            this.editor.dispose();
        }
    };

    componentWillReceiveProps(props: IProps) {
        this.openFile(props.file, props.types);
    }

    openFile = (dwFile: IFile, types: IDictionary<string>) => {
        if (this.editor && dwFile) {
            let filePath = toScriptFilePath(dwFile.path);
            let model = monaco.editor.getModel(monaco.Uri.file(filePath));
            if (model == null) {
                model = monaco.editor.createModel(dwFile.content, null, monaco.Uri.file(filePath));
            } else if (dwFile.content != model.getValue()) {
                model.setValue(dwFile.content);
            }

            if (this.editor.getModel() != model) {
                this.editor.setModel(model);
                this.focusOnEditor(model);
            }
            DWLanguageClient.getInstance().updateInputTypes(types, model.id)
        }
    };


    render() {
        const {width, height, loaderStyle, loaderSize, testId} = this.props;
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
            >
                {this.editor ? null : <Spinner className={styles.spinner}/>}
            </div>
        );
    }
}

export default DataWeaveMonaco;
