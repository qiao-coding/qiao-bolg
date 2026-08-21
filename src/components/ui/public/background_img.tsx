import { type ReactNode } from "react";

interface TechBackgroundNoGridProps {
  children: ReactNode;
}

const TechBackgroundNoGrid: React.FC<TechBackgroundNoGridProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-brand-paper text-foreground">
      <div className="blog-theme-bg relative min-h-screen w-full overflow-hidden">
        <div className="blog-theme-decor pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,132,189,0.045)_1px,transparent_1px),linear-gradient(rgba(255,132,189,0.035)_1px,transparent_1px)] bg-[size:40px_40px] opacity-45 dark:bg-[linear-gradient(90deg,rgba(185,215,242,0.045)_1px,transparent_1px),linear-gradient(rgba(185,215,242,0.035)_1px,transparent_1px)] dark:opacity-35" />
        <div className="relative">
        {children}
        </div>
      </div>
    </div>
  );
};

export default TechBackgroundNoGrid;
