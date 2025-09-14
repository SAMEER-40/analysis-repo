import React, { useState, useCallback } from 'react';

interface HomeProps {
  onAnalyzeRepo: (url: string) => void;
  onAnalyzeZip: (file: File) => void;
}

export const Home: React.FC<HomeProps> = ({ onAnalyzeRepo, onAnalyzeZip }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmitRepo = (e: React.FormEvent) => {
    e.preventDefault();
    const regex = /^(https?:\/\/)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+(\/)?$/;
    if (regex.test(repoUrl)) {
      setError('');
      onAnalyzeRepo(repoUrl);
    } else {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)');
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        setError('');
        onAnalyzeZip(file);
      } else {
        setError('Please upload a valid .zip file.');
      }
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7v5c0 2.21 3.582 4 8 4s8-1.79 8-4V7" />
          </svg>
          <h1 className="text-4xl font-bold text-gray-100">AI Architecture Inspector</h1>
        </div>
        <p className="text-lg text-gray-400 mb-10">Get AI-powered explanations for any project structure.</p>

        {error && <p className="text-red-400 mb-4 bg-red-900/50 p-3 rounded-md">{error}</p>}

        <div className="space-y-8">
          {/* GitHub Repo Input */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-200 mb-3">Analyze a Public GitHub Repository</h2>
            <form onSubmit={handleSubmitRepo} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="e.g., https://github.com/reactjs/react.dev"
                className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                aria-label="GitHub Repository URL"
              />
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-md transition-colors whitespace-nowrap">
                Analyze URL
              </button>
            </form>
          </div>

          {/* Separator */}
          <div className="flex items-center">
             <hr className="flex-grow border-gray-700" />
             <span className="px-4 text-gray-500">OR</span>
             <hr className="flex-grow border-gray-700" />
          </div>
          
          {/* File Upload */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Upload a Project .zip File</h2>
             <label
              htmlFor="zip-upload"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md cursor-pointer transition-colors ${isDragging ? 'border-cyan-500 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V16a4 4 0 01-4 4H7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v1" />
              </svg>
              <p className="text-gray-400">
                <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500 mt-1">ZIP file only</p>
              <input
                id="zip-upload"
                type="file"
                className="hidden"
                accept=".zip,application/zip"
                onChange={(e) => handleFileChange(e.target.files)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
