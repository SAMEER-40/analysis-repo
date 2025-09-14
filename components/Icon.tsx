import React from 'react';

// Expanded IconType to include various file types
export type IconType = 
  | 'file' 
  | 'folder-open' 
  | 'folder-closed'
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'image'
  | 'zip';

interface IconProps {
  type: IconType;
}

const icons: Record<IconType, React.ReactNode> = {
  'folder-closed': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 0A2.25 2.25 0 011.5 7.5V5.25A2.25 2.25 0 013.75 3h5.25a2.25 2.25 0 011.8.9l.9 1.2H18a2.25 2.25 0 012.25 2.25v.75M3.75 9.75v7.5A2.25 2.25 0 006 19.5h12A2.25 2.25 0 0020.25 17.25v-7.5" />
    </svg>
  ),
  'folder-open': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 19.5h16.5a2.25 2.25 0 002.25-2.25V9A2.25 2.25 0 0018 6.75h-5.25a2.25 2.25 0 01-1.8-.9l-.9-1.2A2.25 2.25 0 007.5 3H3.75A2.25 2.25 0 001.5 5.25v12A2.25 2.25 0 003.75 19.5z" />
    </svg>
  ),
  'file': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  'javascript': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9 9-9-9" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-3.375" />
    </svg>
  ),
  'typescript': (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m-4.875-6.375h9.75" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 8.625a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0z" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 15.375a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0z" />
     </svg>
  ),
  'python': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l-1.5 1.5-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5-1.5-1.5M12.75 20.5l1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15" />
    </svg>
  ),
  'html': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l-3 3.5 3 3.5M17.25 7.5l3 3.5-3 3.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 4.5l-4.5 15" />
    </svg>
  ),
  'css': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104l-1.422 1.422a1.125 1.125 0 01-1.59 0L5.316 3.104A1.125 1.125 0 016.906 2.25h10.188a1.125 1.125 0 01.795 1.944l-1.422 1.422a1.125 1.125 0 01-1.59 0l-1.422-1.422a1.125 1.125 0 00-1.59 0L8.184 6.516a1.125 1.125 0 000 1.59l1.422 1.422a1.125 1.125 0 001.59 0l1.422-1.422" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M15 21a9 9 0 11-9-9" />
    </svg>
  ),
  'json': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5h7.5m-7.5 9h7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5c.828 0 1.5.895 1.5 2s-.672 2-1.5 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 16.5c-.828 0-1.5-.895-1.5-2s.672-2 1.5-2" />
    </svg>
  ),
  'image': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  'zip': (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9.75v4.5m0-4.5h-1.5m1.5 0l-4.5 4.5m0-4.5h-1.5m1.5 0l-4.5 4.5m0-4.5h-1.5m1.5 0l-4.5 4.5M3 9.75v4.5m0-4.5h1.5M3 9.75l4.5 4.5M3 9.75h1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 12v-2.25a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0121.75 9.75v2.25z" />
    </svg>
  ),
};

export const Icon: React.FC<IconProps> = ({ type }) => {
  return <>{icons[type] || icons['file']}</>;
};
