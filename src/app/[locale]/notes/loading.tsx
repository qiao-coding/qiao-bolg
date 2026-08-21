import TechBackgroundNoGrid from "@/components/ui/public/background_img";
import { RotatingCube } from "@/components/features/mol/RotatingCube";

export default function NotesLoading() {
  return (
    <TechBackgroundNoGrid>
      <section className="flex flex-col justify-center items-center min-h-screen" aria-busy="true">
        <RotatingCube />
        <p className="text-lg font-medium text-muted-foreground">加载中...</p>
      </section>
    </TechBackgroundNoGrid>
  );
}
