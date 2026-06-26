'use client';

import { useEffect } from 'react';

export default function NotesScrollbarClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('notes-scrollbar');
    return () => {
      html.classList.remove('notes-scrollbar');
    };
  }, []);

  return <>{children}</>;
}
