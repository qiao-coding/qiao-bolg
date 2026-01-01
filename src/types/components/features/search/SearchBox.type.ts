export interface SearchResult {
  id: string;
  title: string;
  content?: string;
  type: 'note' | 'notesPage';
  href: string;
}

export interface SearchBoxProps {
  className?: string;
}
