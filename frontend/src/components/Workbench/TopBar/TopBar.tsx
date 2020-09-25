import * as React from 'react';
import * as classNames from 'classnames';
import {IProps, IState} from './types';
import {DiscreteSelector, Icon, If} from 'components';
import {DATA_FORMATS, SUPPORTED_VERSIONS} from "fileSystem/helpers";
import {DWLanguageClient} from "@mulesoft/data-weave-monaco/dist/language";

const styles = require('./TopBar.css');

class TopBar extends React.PureComponent<IProps, IState> {
    state: IState = {
        inputSize: 0
    };

    handleRename = ev => {
        const {value} = ev.target;
        this.props.onRenameProject(value);
    };

    calculateInputWidth = () => {
        const {projectName} = this.props;
        const canvas = this.refs.canvasBackend as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        ctx.font = '22px system-ui';
        this.setState({inputSize: ctx.measureText(projectName).width});
    };

    handleSave = () => {
        if (this.props.isSavingProject) return;
        this.props.onSave();
    };

    handleDeploy = () => {
        if (this.props.deploymentId) {
            this.props.onDeploy();
        }
        this.props.onOpenDeployModal();
    };

    componentDidMount() {
        this.calculateInputWidth();
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.projectName !== this.props.projectName) {
            this.calculateInputWidth();
        }
    }

    handleLanguageLevelChanged(version: string) {
        DWLanguageClient.getInstance().languageLevel(version)
    }

    render() {
        const {projectName, languageLevel} = this.props;
        const {inputSize} = this.state;

        return (
            <div className={styles.topBar}>
                <div className={styles.leftContent}>
                    <Icon name="data-weave-simple" fill="#00a2df" size={32} viewBox={25} className={styles.logo}/>
                    <input
                        className={styles.projectName}
                        value={projectName}
                        onChange={this.handleRename}
                        style={{width: `${inputSize + 10}PX`}}
                    />
                    <span className={styles.ellipsis}>
            {inputSize > 350 ? '...' : null}
          </span>
                </div>

                <canvas ref="canvasBackend" style={{display: 'none'}}/>

                <div className={styles.actions}>
                    <label>Language Level: </label>
                    <DiscreteSelector
                        className={styles.selector}
                        value={languageLevel}
                        options={SUPPORTED_VERSIONS.map((dataFormat) => {
                            return {
                                value: dataFormat,
                                label: dataFormat
                            }
                        })}
                        offset={{
                            top: 12
                        }}
                        onSelect={this.handleLanguageLevelChanged}
                    />
                </div>
            </div>
        );
    }
}

export default TopBar;
