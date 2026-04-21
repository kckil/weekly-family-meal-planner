import React from 'react';

interface IconProps {
  path: React.ReactNode;
  size?: number;
  strokeWidth?: number;
  fill?: string;
}

function Icon({ path, size = 18, strokeWidth = 1.6, fill = 'none' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
}

export const Icons = {
  Calendar:  <Icon path={<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>} />,
  List:      <Icon path={<><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></>} />,
  Book:      <Icon path={<><path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4zM4 16a4 4 0 0 1 4-4h12"/></>} />,
  History:   <Icon path={<><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></>} />,
  Plus:      <Icon path={<><path d="M12 5v14M5 12h14"/></>} />,
  Upload:    <Icon path={<><path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/></>} />,
  Download:  <Icon path={<><path d="M12 4v12M6 10l6 6 6-6"/><path d="M4 20h16"/></>} />,
  Copy:      <Icon path={<><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></>} />,
  Check:     <Icon path={<path d="M4 12l5 5L20 6"/>} />,
  X:         <Icon path={<path d="M6 6l12 12M18 6L6 18"/>} />,
  Sparkle:   <Icon path={<><path d="M12 3l1.8 4.8L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.2zM19 15l.9 2.4L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.6z"/></>} />,
  Clock:     <Icon path={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />,
  Search:    <Icon path={<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>} />,
  Moon:      <Icon path={<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z"/>} />,
  Sun:       <Icon path={<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></>} />,
  Drag:      <Icon path={<><circle cx="9" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="15" cy="18" r="1.2"/></>} fill="currentColor" strokeWidth={0}/>,
  Trash:     <Icon path={<><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></>} />,
  Edit:      <Icon path={<><path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M14 6l4 4"/></>} />,
};
