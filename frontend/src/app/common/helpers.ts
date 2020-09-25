import { batchActions as batch } from 'redux-batched-actions';
import { ITreeNode } from 'common/types';

export const isDev = () => process.env.NODE_ENV === 'development';

/**
 * Loads a preset from a URL query parameter or from the given path argument.
 * URL query parameters should be specified using dot notation
 * @param path The path to the preset
 */
export function loadPreset<T>(slice: string, path?: string): T {
  const queryParameter = window.location.search.slice(1).match(/preset=(.*)/);
  const urlPreset = queryParameter ? queryParameter[1].replace('.', '/') : null;
  if (isDev()) {
    try {
      if (path) return require(path).default[slice];
      if (urlPreset) return require(`use_cases/${urlPreset}`).default[slice];
    } catch (e) {
      return null;
    }
  }
  return null;
}

export const log = (label: string, ...args) => {
  if (process.env.NODE_ENV === 'development' || (window as any).PIKACHU_MODE) {
    console.log(`[${label}]`, ...args);
  }
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...dispatchProps,
  ...stateProps,
  ...ownProps
});

export namespace TreeNode {
  export function hasChildren<T>(node: ITreeNode<T>): boolean {
    return node.children.length > 0;
  }

  export function find<T>(node: ITreeNode<T>, path: string): ITreeNode<T> {
    const parts = path.split('.');
    if (TreeNode.hasChildren(node)) {
      return TreeNode.traverseChildren(node.children, parts);
    }
    return null;
  }

  export function traverseChildren<T>(children: ITreeNode<T>[], parts: string[]): ITreeNode<T> {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const found = child.id === parts[0] ? child : null;

      if (found) {
        return child;
      }

      if (!found && child.children.length > 0 && parts.length > 0) {
        parts.shift();
        return TreeNode.traverseChildren(child.children, parts);
      }
    }
    return null;
  }
}

export const batchActions = actions => {
  let resolved = [];

  return (dispatch, getState, api) => {
    const resolve = payload => {
      if (typeof payload === 'function') {
        payload(resolve, getState, api);
      } else {
        resolved = [...resolved, payload];
        if (resolved.length === actions.length) dispatch(batch(resolved));
      }
    };

    for (const action of actions) {
      if (typeof action === 'function') {
        action(resolve, getState, api);
      } else resolve(action);
    }
  };
};
