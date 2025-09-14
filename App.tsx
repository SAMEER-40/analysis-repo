import React, { useState, useCallback } from 'react';
import { Home } from './components/Home';
import { TreeView } from './components/TreeView';
import { DescriptionPanel } from './components/DescriptionPanel';
import { Loader } from './components/Loader';
import { TreeNodeData } from './types';
import { getGitHubTree, getTreeFromZip } from './services/fileTreeService';
import { explainFile, explainFolder } from './services/geminiService';

const App: React.FC = () => {
    const [treeData, setTreeData] = useState<TreeNodeData | null>(null);
    const [selectedNode, setSelectedNode] = useState<TreeNodeData | null>(null);
    const [description, setDescription] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const resetState = () => {
        setTreeData(null);
        setSelectedNode(null);
        setDescription('');
        setError(null);
        setIsLoading(false);
        setLoadingMessage('');
    };
    
    const handleAnalyzeRepo = useCallback(async (url: string) => {
        resetState();
        setIsLoading(true);
        setLoadingMessage('Fetching repository structure...');
        try {
            const tree = await getGitHubTree(url);
            setTreeData(tree);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred while fetching the repository.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleAnalyzeZip = useCallback(async (file: File) => {
        resetState();
        setIsLoading(true);
        setLoadingMessage('Analyzing zip file...');
        try {
            const tree = await getTreeFromZip(file);
            setTreeData(tree);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred while processing the zip file.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchGitHubFileContent = async (node: TreeNodeData): Promise<string> => {
        if (!node.url) {
            throw new Error('No URL found for this GitHub file.');
        }
        const res = await fetch(node.url);
        if (!res.ok) {
            throw new Error(`Failed to fetch file content: ${res.statusText}`);
        }
        const blob = await res.json();
        if (blob.encoding !== 'base64' || !blob.content) {
            // Handle empty files from GitHub that might not have a content field
            if (blob.size === 0) return ''; 
            return '[Binary File]';
        }
        try {
            return atob(blob.content);
        } catch(e) {
            console.warn(`Failed to decode base64 content for ${node.path}`, e);
            return '[Binary File]'; // Treat as binary if decoding fails
        }
    };

    const handleNodeSelect = useCallback(async (node: TreeNodeData) => {
        setSelectedNode(node);
        setDescription('');
        setError(null);
        setIsLoading(true);

        try {
            if (node.type === 'folder') {
                setLoadingMessage(`Analyzing folder: ${node.name}...`);
                const desc = await explainFolder(node);
                setDescription(desc);
            } else if (node.type === 'file') {
                setLoadingMessage(`Analyzing file: ${node.name}...`);
                let content = node.content;
                
                // For GitHub files, content is not pre-loaded. Fetch it.
                if (content === undefined && node.url) {
                    content = await fetchGitHubFileContent(node);
                }

                if (content === undefined) {
                    content = '[Binary File]';
                }
                
                const nodeWithContent = { ...node, content };
                // Pass the entire treeData for context
                const desc = await explainFile(nodeWithContent, treeData);
                setDescription(desc);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [treeData]); // Add treeData as a dependency

    const renderMainContent = () => {
        if (isLoading && !treeData) {
            return <div className="flex items-center justify-center h-full"><Loader message={loadingMessage} /></div>;
        }

        if (error && !treeData) {
            return (
                <div className="w-full h-full flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl text-center">
                        <h2 className="text-2xl font-semibold text-red-400 mb-4">Analysis Failed</h2>
                        <p className="text-red-300 mb-6 bg-red-900/50 p-4 rounded-md">{error}</p>
                        <button onClick={resetState} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-md transition-colors">
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }
        
        if (!treeData) {
            return <Home onAnalyzeRepo={handleAnalyzeRepo} onAnalyzeZip={handleAnalyzeZip} />;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-12 h-full overflow-hidden">
                <aside className="col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-2 bg-gray-900/70 p-4 overflow-y-auto border-r border-gray-800">
                    <button onClick={resetState} className="flex items-center gap-2 w-full mb-4 text-left text-lg font-bold text-gray-200 hover:text-cyan-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        New Analysis
                    </button>
                    <TreeView data={treeData} onNodeSelect={handleNodeSelect} selectedNodePath={selectedNode?.path ?? null} />
                </aside>
                <section className="col-span-12 md:col-span-8 lg:col-span-9 xl:col-span-10 p-6 md:p-8 lg:p-12 overflow-y-auto">
                    <DescriptionPanel
                        path={selectedNode?.path ?? null}
                        description={description}
                        isLoading={isLoading}
                        error={error}
                        nodeType={selectedNode?.type}
                    />
                </section>
            </div>
        );
    };

    return (
        <main className="h-screen w-screen bg-gray-900 text-white font-sans overflow-hidden">
            {renderMainContent()}
        </main>
    );
};

export default App;