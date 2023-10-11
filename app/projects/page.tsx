import Link from "next/link";
import { getProjects } from "@/sanity/sanity-utils";
import { TbFileText } from "react-icons/tb";
import Image from "next/image";

import { PortableText } from "@portabletext/react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default async function Home() {
  const projects = await getProjects();

  return (
    <main>
      <div className="auto-rows grid gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <Dialog>
            <DialogTrigger
              key={project._id}
              className="flex flex-col gap-2 rounded-3xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900"
            >
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.name}
                  width={800}
                  height={400}
                  className="rounded-md object-cover"
                />
              )}
              <div className="text-lg font-semibold text-stone-900 dark:text-stone-50">
                {project.name}
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl flex-col gap-4">
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
