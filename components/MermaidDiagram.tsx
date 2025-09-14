// Fix: Implement the MermaidDiagram component to render diagrams from the AI's response.
import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';
// Fix: Use a namespace import to handle module interoperability with the CDN version of panzoom.
import * as panzoom from 'panzoom';

interface MermaidDiagramProps {
  chart: string;
}

// Generate a unique ID for each diagram to prevent mermaid rendering conflicts.
let idCounter = 0;
const generateId = () => `mermaid-diagram-${idCounter++}`;

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const [diagramId] = useState(generateId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const panzoomInstanceRef = useRef<any>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark', // Using a dark theme that fits the app's aesthetic
      securityLevel: 'loose',
      themeVariables: {
        background: '#111827', // bg-gray-900
        primaryColor: '#1F2937', // bg-gray-800
        primaryTextColor: '#F3F4F6', // text-gray-100
        lineColor: '#4B5563', // border-gray-600
        secondaryColor: '#22D3EE', // cyan-400
      }
    });

    const renderDiagram = async () => {
      // Ensure the chart content is valid and the container is available.
      if (chart && containerRef.current) {
        try {
          // mermaid.render returns an SVG string, which we can use to display the diagram.
          const { svg } = await mermaid.render(diagramId, chart);
          setSvgContent(svg);
          setError(null);
          setShowInstructions(true); // Show instructions for new diagram
        } catch (e: any) {
          console.error('Mermaid rendering failed:', e.message);
          setError('Failed to render diagram. The AI may have generated invalid syntax.');
          setSvgContent('');
        }
      }
    };
    
    renderDiagram();

    // Cleanup panzoom instance when the component unmounts or chart changes
    return () => {
      if (panzoomInstanceRef.current) {
        panzoomInstanceRef.current.dispose();
        panzoomInstanceRef.current = null;
      }
    };
    
  }, [chart, diagramId]);

  useEffect(() => {
    if (svgContent && containerRef.current) {
      const svgElement = containerRef.current.querySelector('svg');
      if (svgElement) {
        // Dispose of the old instance if it exists
        if (panzoomInstanceRef.current) {
          panzoomInstanceRef.current.dispose();
        }
        // Fix: Call the panzoom function from the module's 'default' property.
        const pz = (panzoom as any).default(svgElement, {
          maxZoom: 5,
          minZoom: 0.2,
        });
        panzoomInstanceRef.current = pz;

        // Hide instructions after a delay or first interaction
        const timer = setTimeout(() => setShowInstructions(false), 4000);
        const hideInstructions = () => {
            setShowInstructions(false);
            clearTimeout(timer);
            pz.off('panstart', hideInstructions);
            pz.off('zoom', hideInstructions);
        };
        pz.on('panstart', hideInstructions);
        pz.on('zoom', hideInstructions);

        return () => {
          clearTimeout(timer);
          // The main effect cleanup will handle disposal
        };
      }
    }
  }, [svgContent]);

  const handleZoomIn = () => panzoomInstanceRef.current?.zoomIn();
  const handleZoomOut = () => panzoomInstanceRef.current?.zoomOut();
  const handleReset = () => {
    panzoomInstanceRef.current?.moveTo(0, 0);
    panzoomInstanceRef.current?.zoomAbs(0, 0, 1);
  };

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg w-full max-w-2xl">
        <p className="font-semibold">Diagram Error</p>
        <pre className="text-sm mt-2 whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  return (
    <div className="relative w-full">
        <div
        ref={containerRef}
        className="mermaid-container p-4 bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex justify-center w-full min-h-[200px]"
        // Using dangerouslySetInnerHTML is necessary here to render the SVG string from mermaid.
        dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        {svgContent && (
        <>
            {/* Instructions Overlay */}
            <div 
                className={`absolute top-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full transition-opacity duration-500 ${showInstructions ? 'opacity-100' : 'opacity-0'}`}
            >
                Scroll to zoom, drag to pan
            </div>
            {/* Controls */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-gray-900/70 border border-gray-700 rounded-lg p-1">
                {/* Info Button */}
                <div className="relative group flex items-center">
                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md" aria-describedby="info-tooltip">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <div 
                        id="info-tooltip"
                        role="tooltip"
                        className="absolute bottom-full right-0 mb-2 w-max max-w-xs bg-gray-950/90 backdrop-blur-sm text-white text-xs rounded-md py-1.5 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 pointer-events-none"
                    >
                        Visit again for a new diagrammatic perspective
                        <div className="absolute top-full right-3 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-950/90"></div>
                    </div>
                </div>

                <div className="w-px h-5 bg-gray-600"></div>

                <button onClick={handleZoomIn} className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md" aria-label="Zoom In">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3h-6" />
                    </svg>
                </button>
                <button onClick={handleZoomOut} className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md" aria-label="Zoom Out">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                </button>
                 <div className="w-px h-5 bg-gray-600"></div>
                <button onClick={handleReset} className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md" aria-label="Reset Zoom">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
                     </svg>
                </button>
            </div>
        </>
        )}
    </div>
  );
};