import Link from "next/link";
import { getProjects } from "@/sanity/sanity-utils";
import { TbFileText } from "react-icons/tb";

export default async function Home() {
  const projects = await getProjects();

  return (
    <main>
      <div className="container p-12 lg:p-24">
        {/* header */}
        <div className="mb-24 flex w-full flex-row items-center justify-between gap-4">
          <Link href="/" className="flex flex-col">
            <h2 className={`text-2xl font-semibold text-stone-950`}>Leo</h2>
            <p className={`text-md text-stone-500`}>Designer</p>
          </Link>

          {/* twitter link */}
          <div className="flex flex-row gap-4">
            <a
              href="https://twitter.com/leosuccarferre"
              target="_blank"
              className="cursor-pointer rounded-full bg-stone-100 p-3 px-5 text-stone-950 dark:bg-stone-800/30"
            >
              Twitter
            </a>

            {/* linkedin link */}
            <a
              href="https://www.linkedin.com/in/leosuccarferre/"
              target="_blank"
              className="cursor-pointer rounded-full bg-stone-100 p-3 px-5 text-stone-950 dark:bg-stone-800/30"
            >
              LinkedIn
            </a>

            {/* link to resume */}
            <a
              href="/Leo-SF-Resume-2023.pdf"
              target="_blank"
              className="cursor-pointer self-center rounded-full bg-stone-100 p-3 px-5 dark:bg-stone-800/30"
            >
              <TbFileText title="Resume" className="h-5 w-5 stroke-stone-950" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8"></div>
        {projects.map((project) => (
          <div key={project._id}>{project.name}</div>
        ))}
      </div>
    </main>
  );
}
