import Link from "next/link";
import { getProjects } from "@/sanity/sanity-utils";
import { TbFileText } from "react-icons/tb";
import Image from "next/image";

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

        <div className="grid grid-cols-2 gap-4 md:grid-cols-12">
          {projects.map((project) => (
            <div
              key={project._id}
              className="rounded-lg border border-gray-500 p-4"
            >
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.name}
                  width={800}
                  height={400}
                  className="rounded-lg object-cover"
                />
              )}
              <div className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text font-extrabold text-transparent">
                {project.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
