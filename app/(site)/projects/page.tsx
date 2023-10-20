import { getProjects } from "@/sanity/sanity-utils";
import Image from "next/image";

import { PortableText } from "@portabletext/react";

import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function Home() {
  const projects = await getProjects();
  const client = createClient({
    projectId: "jyqe7nab",
    dataset: "production",
    apiVersion: "2023-10-07",
  });

  const ContentImageComponent = ({ value }: { value: any }) => {
    return (
      <Image
        src={urlBuilder(client).image(value).fit("max").auto("format").url()}
        alt={value.alt || " "}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full"
      />
    );
  };

  const components = {
    types: {
      image: ContentImageComponent,
      // Any other custom types you have in your content
      // Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
    },
  };

  return (
    <main>
      <div className="auto-rows grid gap-4 md:grid-cols-3">
        {projects.map((project) => (
          // project card
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
                <div className="flex font-medium text-stone-900 dark:text-stone-50">
                  {project.name}
                </div>
                <div className="text-md flex justify-between text-stone-500 dark:text-stone-500">
                  <div>{project.client}</div>
                  <div>{project.year}</div>
                </div>
              </div>
            </DialogTrigger>

            <DialogContent className=" max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-auto md:max-w-5xl">
              <DialogHeader>{project.name}</DialogHeader>
              <Image
                src={project.image}
                alt={project.name}
                width={1200}
                height={800}
                className="w-100 object-cover"
              />
              <div className="text-md flex flex-col gap-2 text-stone-900 dark:text-stone-50">
                <PortableText value={project.content} components={components} />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </main>
  );
}
