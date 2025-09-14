// Fix: Import `JSZipObject` type from `jszip` to correctly type the zip file entries.
import JSZip, { JSZipObject } from 'jszip';
import { TreeNodeData } from '../types';

interface GitHubTreeItem {
  path: string;
  type: 'tree' | 'blob';
  url: string;
}

function buildTree(items: { path: string; type: string; url?: string; content?: string }[]): TreeNodeData {
  // Sort items to ensure parent directories are created before their children
  items.sort((a, b) => a.path.localeCompare(b.path));

  // Find the common root path
  let commonPrefix = '';
  if (items.length > 0) {
      const firstPathParts = items[0].path.split('/');
      commonPrefix = firstPathParts[0] + '/';
  }
  
  const rootName = commonPrefix;
  const root: TreeNodeData = {
    name: rootName,
    path: rootName,
    type: 'folder',
    children: [],
  };
  
  const nodeMap: { [path: string]: TreeNodeData } = { [rootName]: root };

  for (const item of items) {
    const parts = item.path.split('/');
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLastPart = i === parts.length - 1;
      const isFolder = !isLastPart || item.type === 'tree' || item.type === 'folder';
      
      const nodeName = isFolder ? `${part}/` : part;
      const parentPath = currentPath;
      currentPath += nodeName;

      if (!nodeMap[currentPath]) {
        const parentNode = nodeMap[parentPath] || root;
        const newNode: TreeNodeData = {
          name: nodeName,
          path: currentPath,
          type: isFolder ? 'folder' : 'file',
          children: isFolder ? [] : undefined,
          url: isFolder ? undefined : item.url,
          content: isFolder ? undefined : item.content,
        };
        
        nodeMap[currentPath] = newNode;
        // Handle case where items might not have a single root folder
        if (parentNode) {
            parentNode.children!.push(newNode);
        } else if (!parentPath) { // Top-level item
            root.children!.push(newNode);
        }
      }
    }
  }

  // If the root has only one child folder, make that child the new root
  if (root.children && root.children.length === 1 && root.children[0].type === 'folder') {
      return root.children[0];
  }
  
  return root;
}


export const getGitHubTree = async (repoUrl: string): Promise<TreeNodeData> => {
  const urlMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!urlMatch) {
    throw new Error('Invalid GitHub URL');
  }
  const [, owner, repo] = urlMatch;

  const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if(!repoInfoRes.ok) throw new Error('Repository not found or API limit reached.');
  const repoInfo = await repoInfoRes.json();
  const defaultBranch = repoInfo.default_branch;

  const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
  if(!treeRes.ok) throw new Error('Could not fetch repository tree.');
  const treeData = await treeRes.json();
  
  if (!treeData.tree || treeData.truncated) {
    throw new Error('Repository is too large or the tree could not be retrieved.');
  }

  const items = treeData.tree.map((item: GitHubTreeItem) => ({
    path: item.path,
    type: item.type,
    url: item.url,
  }));

  return buildTree(items);
};

const isTextFile = (filename: string): boolean => {
    const textExtensions = [
        'txt', 'md', 'json', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'py', 'go', 'java',
        'c', 'cpp', 'h', 'cs', 'sh', 'yml', 'yaml', 'xml', 'rb', 'php', 'sql', 'dockerfile', 'toml',
        'gitignore', 'npmrc', 'nvmrc'
    ];
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? textExtensions.includes(extension) : false;
}

export const getTreeFromZip = async (file: File): Promise<TreeNodeData> => {
  const jszip = new JSZip();
  const zip = await jszip.loadAsync(file);

  const items: { path: string; type: string; content?: string }[] = [];

  // Fix: Add `JSZipObject` type to `zipObject` to resolve properties on `unknown` type.
  const filePromises = Object.values(zip.files).map(async (zipObject: JSZipObject) => {
    if (!zipObject.dir) {
      let content: string | undefined;
      if (isTextFile(zipObject.name)) {
        try {
            content = await zipObject.async('string');
        } catch(e) {
            console.warn(`Could not read file as text: ${zipObject.name}`);
        }
      } else {
        content = '[Binary File]';
      }
      items.push({
        path: zipObject.name,
        type: 'file',
        content: content,
      });
    }
  });

  await Promise.all(filePromises);

  return buildTree(items);
};