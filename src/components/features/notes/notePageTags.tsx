'use client'

export function NotePageTags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-8 pt-6 border-t transition-all duration-300 border-border">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">标签：</span>
        {tags.map((tag, index) => (
          <div
            key={index}
            className="text-sm px-3 py-1.5 
            rounded-full transition-all duration-300
             bg-card text-card-foreground border-[1.5px] border-border
             hover:bg-card/80 hover:shadow-md"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}

