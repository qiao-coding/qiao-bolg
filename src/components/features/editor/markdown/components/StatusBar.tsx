import React from 'react';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  theme: 'light' | 'dark';
}

const StatusBar: React.FC<StatusBarProps> = ({ wordCount, charCount, theme }) => (
  <div className={`flex items-center justify-between px-4 py-2 text-sm border-t ${theme === 'dark'
    ? 'border-gray-700 text-gray-400'
    : 'border-gray-200 text-gray-600'
    }`}>
    <div className="flex items-center gap-4">
      <div>
        字数: <span className="font-semibold">{wordCount}</span>
      </div>
      <div>
        字符: <span className="font-semibold">{charCount}</span>
      </div>
    </div>
  </div>
);

export default StatusBar;
