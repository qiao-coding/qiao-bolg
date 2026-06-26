import NotesScrollbarClient from './NotesScrollbarClient';

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return <NotesScrollbarClient>{children}</NotesScrollbarClient>;
}
