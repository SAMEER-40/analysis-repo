import React from 'react';
import { TreeNode } from './TreeNode';
import { TreeNodeData } from '../types';

interface TreeViewProps {
  data: TreeNodeData;
  onNodeSelect: (node: TreeNodeData) => void;
  selectedNodePath: string | null;
}

export const TreeView: React.FC<TreeViewProps> = ({ data, onNodeSelect, selectedNodePath }) => {
  return (
    <div>
      <TreeNode
        node={data}
        level={0}
        onNodeSelect={onNodeSelect}
        selectedNodePath={selectedNodePath}
        defaultOpen={true}
      />
    </div>
  );
};
