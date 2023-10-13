import { getProjects } from "@/sanity/sanity-utils";
import Image from "next/image";

import { PortableText } from "@portabletext/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function Home() {
  const projects = await getProjects();

  return (
    <main>
      <div className="auto-rows grid gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <Dialog key={project._id}>
            <DialogTrigger className="flex flex-col items-stretch gap-2 rounded-3xl  bg-stone-200/50 p-4 hover:bg-stone-200 dark:bg-stone-800/50 dark:hover:bg-stone-800">
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.name}
                  width={800}
                  height={400}
                  className="aspect-[4/3] rounded-lg object-cover"
                />
              )}
              <div className="flex flex-col">
                <div className="flex text-lg font-semibold text-stone-900 dark:text-stone-50">
                  {project.name}
                </div>
                <div className="text-md flex justify-between text-stone-500 dark:text-stone-500">
                  <div>{project.client}</div>
                  <div>{project.year}</div>
                </div>
              </div>
            </DialogTrigger>

            <DialogContent className=" max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2srem)] overflow-auto md:max-w-4xl">
              <DialogHeader>{project.name}</DialogHeader>
              <Image
                src={project.image}
                alt={project.name}
                width={1200}
                height={800}
                className="w-100 object-cover"
              />
              <div className="text-md text-stone-900 dark:text-stone-50">
                <PortableText value={project.content} />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </main>
  );
}
