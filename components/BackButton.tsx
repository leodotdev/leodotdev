import { TbArrowLeft } from "react-icons/tb";
import Link from "next/link";

export function BackButton() {
  return (
    <Link
      href="/projects"
      className="text-md flex items-center rounded-full bg-primary px-4 py-2 pr-5 font-medium text-primary-foreground hover:bg-primary/90"
    >
      <TbArrowLeft className="mr-1 h-4 w-4 " />
      Back to Projects
    </Link>
  );
}
