// Fix: Implement the DescriptionPanel component to render the AI-generated analysis.
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader } from './Loader';
import { MermaidDiagram } from './MermaidDiagram';

interface DescriptionPanelProps {
  path: string | null;
  description: string;
  isLoading: boolean;
  error: string | null;
  nodeType: 'file' | 'folder' | undefined;
}

export const DescriptionPanel: React.FC<DescriptionPanelProps> = ({
  path,
  description,
  isLoading,
  error,
  nodeType,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader message={path ? `Analyzing ${path}...` : 'Loading...'} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 bg-red-900/50 p-4 rounded-md">
        <h3 className="font-bold text-lg mb-2">Analysis Failed</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-300">Select a File or Folder</h2>
        <p className="mt-2">Choose an item from the tree on the left to see an AI-powered explanation.</p>
      </div>
    );
  }

  const nodeName = path.split('/').filter(Boolean).pop();

  return (
    <div className="prose prose-invert prose-cyan max-w-none prose-pre:bg-gray-800/80 prose-pre:border prose-pre:border-gray-700">
      <div className="pb-4 border-b border-gray-700 mb-6">
         <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
            <span>{nodeName}</span>
            <span className="text-sm font-medium uppercase tracking-wider bg-gray-700 text-gray-300 px-2 py-1 rounded-md">{nodeType}</span>
         </h1>
         <p className="text-sm text-gray-500 font-mono tracking-wide">{path}</p>
      </div>
      
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            // Intercept 'mermaid' language blocks and render them with a custom component.
            if (!inline && match && match[1] === 'mermaid') {
              return (
                <div className="flex justify-center my-6">
                  <MermaidDiagram chart={String(children).replace(/\n$/, '')} />
                </div>
              );
            }
            return !inline && match ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {description}
      </ReactMarkdown>
    </div>
  );
};
