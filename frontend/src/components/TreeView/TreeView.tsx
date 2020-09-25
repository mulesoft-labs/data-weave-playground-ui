import * as React from 'react';
import { IProps, IState } from './types';
import { ITreeNode, TreeNodeType } from 'common/types';
import { TreeNode } from 'common/helpers';
const styles = require('./styles.css');

class TreeView extends React.PureComponent<IProps, IState> {
  state = {
    collapsedFolders: []
  };

  toggleCollapse = (node: ITreeNode<any>) => {
    const { collapsedFolders } = this.state;
    const isCollapsed = !!collapsedFolders.find(folder => folder.id === node.id);

    if (isCollapsed) {
      this.setState({ collapsedFolders: collapsedFolders.filter(id => id !== node.id) });
    } else {
      this.setState({ collapsedFolders: [...collapsedFolders, node.id] });
    }
  };

  handleSelect = (node: ITreeNode<any>) => {
    this.props.onSelect(node);
  };

  renderNode = (node: ITreeNode<any>, index: number, level: number) => {
    const Folder = this.props.folderRenderer;
    const Leaf = this.props.leafRenderer;
    const { selected } = this.props;
    const { collapsedFolders } = this.state;

    if (node.type === TreeNodeType.FOLDER && TreeNode.hasChildren(node)) {
      const isCollapsed = !!collapsedFolders.find(folder => folder.id === node.id);
      return (
        <Folder
          key={index}
          label={node.label}
          title={node.label}
          collapsed={isCollapsed}
          onCollapse={this.toggleCollapse}
          node={node}
          level={level}
        >
          {node.children.map((child, i) => this.renderNode(child, index + i, level + 1))}
        </Folder>
      );
    }
    return (
      <Leaf
        key={index}
        label={node.label}
        title={node.label}
        selected={selected === node.id}
        onClick={() => this.handleSelect(node)}
        node={node}
        level={level}
      />
    );
  };

  render() {
    const { nodes } = this.props;

    return (
      <div className={styles.wrapper}>
        {nodes.map((node, i) => this.renderNode(node, i, 0))}
      </div>
    );
  }
}

export default TreeView;
