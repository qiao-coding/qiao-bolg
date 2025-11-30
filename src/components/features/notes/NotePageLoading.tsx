'use client'
import TechBackgroundNoGrid from '@/components/ui/public/background_img';
import LoadingPage from '@/components/ui/shadcnComponents/loadingPage';

export function NotePageLoading() {
  return (
    <article>
      <TechBackgroundNoGrid>
        <div className="fixed top-0 left-0 w-full h-full">
          <div className="w-full">
            <LoadingPage />
          </div>
        </div>
      </TechBackgroundNoGrid>
    </article>
  );
}

