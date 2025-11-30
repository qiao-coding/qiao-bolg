'use client'
import { miscellaneousType } from '@/types/miscellaneous/type';
import { MiscellaneousTimelineItem } from './MiscellaneousTimelineItem';

export function MiscellaneousTimeline({
  items,
}: {
  items: miscellaneousType[];
}) {
  return (
      <ul className="max-w-4xl mx-auto timeline timeline-vertical relative pb-20">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 -translate-x-1/2 z-0"></div>

        {items.map((item, index) => (
          <MiscellaneousTimelineItem
            key={item.id}
            item={item}
            index={index}
          />
        ))}
      </ul>
  );
}

