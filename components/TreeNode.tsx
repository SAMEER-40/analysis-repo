import React, { useState } from 'react';
import { TreeNodeData } from '../types';
import { Icon, IconType } from './Icon';

interface TreeNodeProps {
  node: TreeNodeData;
  level: number;
  onNodeSelect: (node: TreeNodeData) => void;
  selectedNodePath: string | null;
  defaultOpen?: boolean;
}

const getIconTypeForFile = (filename: string): IconType => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (!extension) return 'file';

    switch (extension) {
        case 'js':
        case 'jsx':
            return 'javascript';
        case 'ts':
        case 'tsx':
            return 'typescript';
        case 'py':
            return 'python';
        case 'html':
            return 'html';
        case 'css':
        case 'scss':
        case 'sass':
            return 'css';
        case 'json':
            return 'json';
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'svg':
        case 'webp':
            return 'image';
        case 'zip':
            return 'zip';
        default:
            return 'file';
    }
};

export const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onNodeSelect, selectedNodePath, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isFolder = node.type === 'folder';
  const isSelected = selectedNodePath === node.path;

  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
    onNodeSelect(node);
  };

  const selectedClasses = isSelected
    ? 'bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400'
    : 'text-gray-300 hover:bg-gray-700/50';
  
  const indentStyle = { paddingLeft: `${level * 1.25}rem` };

  const iconType: IconType = isFolder 
    ? (isOpen ? 'folder-open' : 'folder-closed') 
    : getIconTypeForFile(node.name);

  return (
    <div>
      <div
        className={`flex items-center p-1.5 rounded-md cursor-pointer transition-colors duration-150 ${selectedClasses}`}
        style={indentStyle}
        onClick={handleToggle}
        role="button"
        aria-expanded={isFolder ? isOpen : undefined}
        aria-selected={isSelected}
      >
        <Icon type={iconType} />
        <span className="ml-2 text-sm select-none">{node.name}</span>
      </div>
      {isFolder && isOpen && node.children && (
        <div className="border-l border-gray-700 ml-3" role="group">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              onNodeSelect={onNodeSelect}
              selectedNodePath={selectedNodePath}
            />
          ))}
        </div>
      )}
    </div>
  );
};
