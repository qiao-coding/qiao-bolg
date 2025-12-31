import React from 'react';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  theme: 'light' | 'dark';
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, title, onClick, theme }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded transition-colors ${theme === 'dark'
      ? 'hover:bg-gray-700'
      : 'hover:bg-gray-100'
      }`}
    title={title}
    aria-label={title}
  >
    {icon}
  </button>
);

export default ToolbarButton;
