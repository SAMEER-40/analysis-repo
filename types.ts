export interface TreeNodeData {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: TreeNodeData[];
  content?: string; // For file content from zip
  url?: string;     // For GitHub blob API URL
}
