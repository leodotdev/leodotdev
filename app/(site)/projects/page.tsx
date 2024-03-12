import { getProjects } from "@/sanity/sanity-utils";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import localFont from "next/font/local";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import Link from "next/link";

const ReallySansLargeUltra = localFont({
  src: "../../../public/fonts/ReallySansLarge-Ultra.woff",
});

const ReallySansLargeBlack = localFont({
  src: "../../../public/fonts/ReallySansLarge-Black.woff",
});

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
    },
  };

  return (
    <div className="py-32 md:py-24  ">
      <div className={ReallySansLargeBlack.className}>
        <div className="flex flex-col gap-6 border-0 px-12 text-center">
          <Link href="/" className="">
            <div className={ReallySansLargeUltra.className}>
              <h2 className="-mb-6 flex flex-col text-center text-[88px] font-black leading-none text-stone-950 md:text-[128px] dark:text-stone-50">
                Leo
              </h2>
              <h2 className="-gap-4 flex flex-col text-center text-[88px] font-black leading-none text-stone-950 md:text-[128px] dark:text-stone-50">
                Succar
              </h2>
            </div>
          </Link>
          <h2 className="text-4xl text-stone-950 dark:text-stone-50">
            I&#39;m a Senior Product & Design Systems Designer at{" "}
            <Link href="https://bitgo.com" target="_blank">
              <span className="text-sky-500 hover:underline ">BitGo</span>
            </Link>
            .
          </h2>
          <h2 className="text-4xl text-stone-950 dark:text-stone-50">
            Previously, I was with{" "}
            <Link
              className={ReallySansLargeBlack.className}
              href="https://plasmic.app"
              target="_blank"
            >
              <span className="text-pink-500 hover:underline ">Plasmic</span>,
            </Link>{" "}
            <Link
              className={ReallySansLargeBlack.className}
              href="https://meta.com"
              target="_blank"
            >
              <span className="text-blue-500 hover:underline">Meta</span>
            </Link>
            , and{" "}
            <Link
              className={ReallySansLargeBlack.className}
              href="https://sourcegraph.com"
              target="_blank"
            >
              <span className="text-violet-500 hover:underline">
                Sourcegraph
              </span>
            </Link>
            .
          </h2>
        </div>
      </div>

      <div className="auto-rows grid gap-6 p-12 md:grid-cols-3">
        <Card className="rounded-3xl shadow-none md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Work Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-4">
              <li className="flex w-full items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/logo-bg.svg" />
                    <AvatarFallback className="text-stone-500">
                      B
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-medium">
                      Senior Product & Design Systems Designer
                    </h4>
                    <a
                      className="text-sm text-stone-500 underline hover:text-blue-500"
                      href="https://www.bitgo.com/"
                      target="_blank"
                    >
                      BitGo
                    </a>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end">
                  <p className="text-sm">2023–Present</p>
                  <p className="text-sm">Remote</p>
                </div>
              </li>
              <Separator />
              <li className="flex w-full items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/logo-pl.svg" />
                    <AvatarFallback className="text-stone-500">
                      P
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-medium">Founding Designer</h4>
                    <a
                      className="text-sm text-stone-500 underline hover:text-blue-500"
                      href="https://plasmic.app"
                      target="_blank"
                    >
                      Plasmic
                    </a>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end">
                  <p className="text-sm">2020–2023</p>
                  <p className="text-sm">Remote</p>
                </div>
              </li>
              <Separator />
              <li className="flex w-full items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/logo-fb.svg" />
                    <AvatarFallback className="text-stone-500">
                      F
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-medium">
                      Product & Design Systems Designer
                    </h4>
                    <span className="text-sm text-stone-500">
                      <a
                        className="underline hover:text-blue-500"
                        href="https://www.meta.com"
                        target="_blank"
                      >
                        Facebook
                      </a>{" "}
                      (now Meta), xDesign & Core Systems
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end">
                  <p className="text-sm">2018–2020</p>
                  <p className="text-sm">Menlo Park, CA</p>
                </div>
              </li>
              <Separator />
              <li className="flex w-full items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/logo-sg.svg" />
                    <AvatarFallback className="text-stone-500">
                      S
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-medium">Lead Product Designer</h4>
                    <a
                      className="text-sm text-stone-500 underline hover:text-blue-500"
                      href="https://sourcegraph.com"
                      target="_blank"
                    >
                      Sourcegraph
                    </a>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end">
                  <p className="text-sm">2017–2018</p>
                  <p className="text-sm">San Francisco, CA</p>
                </div>
              </li>
              <Separator />
              <li className="flex w-full items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/logo-ze.svg" />
                    <AvatarFallback className="text-stone-500">
                      Z
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-medium">Senior Product Designer</h4>
                    <span className="text-sm text-stone-500">
                      <a
                        className="underline hover:text-blue-500"
                        href="https://zenefits.com"
                        target="_blank"
                      >
                        Zenefits
                      </a>{" "}
                      (now TriNet)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end">
                  <p className="text-sm">2016</p>
                  <p className="text-sm">San Francisco, CA</p>
                </div>
              </li>
              <Separator />
              <li className="flex w-full items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/logo-sd.svg" />
                    <AvatarFallback className="text-stone-500">
                      S
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-medium">Product Designer</h4>
                    <span className="text-sm text-stone-500">
                      <a
                        className="underline hover:text-blue-500"
                        href="https://govos.com"
                        target="_blank"
                      >
                        SeamlessDocs
                      </a>{" "}
                      (now GovOS)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end">
                  <p className="text-sm">2014–2015</p>
                  <p className="text-sm">Miami, FL</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="rounded-3xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Favorite Tools</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h4 className="text-sm text-stone-500">Design</h4>
              <p>
                Figma, Photoshop, Illustrator, Play, Procreate, FigJam, tldraw
              </p>
            </div>
            <Separator />
            <div className="flex flex-col gap-1">
              <h4 className="text-sm text-stone-500">Low-code</h4>
              <p>Framer, Webflow, Toddle, Plasmic</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-1">
              <h4 className="text-sm text-stone-500">Development</h4>
              <p>HTML, CSS, Tailwind CSS, shadcn/ui, Radix, Cody, Copilot</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="auto-rows grid gap-6 md:grid-cols-1">
        {projects.map((project) => (
          // project card
          <Dialog key={project._id}>
            <DialogTrigger className="group flex flex-col items-stretch gap-2 overflow-clip rounded-3xl  bg-stone-200/50 p-4 hover:bg-stone-200 dark:bg-stone-800/50 dark:hover:bg-stone-800">
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.name}
                  width={800}
                  height={400}
                  loading="lazy"
                  className="aspect-[3/2] rounded-xl object-cover transition group-hover:translate-y-5 group-hover:scale-[1.666]"
                />
              )}
              <div className="flex flex-col">
                <div className="flex text-left font-medium text-stone-950 dark:text-stone-50">
                  {project.name}
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <div>{project.client}</div>
                  <div>{project.year}</div>
                </div>
              </div>
            </DialogTrigger>

            <DialogContent className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-auto md:max-w-5xl">
              <DialogHeader>{project.name}</DialogHeader>
              <Image
                src={project.image}
                alt={project.name}
                width={1200}
                height={800}
                loading="lazy"
                className="w-100 object-cover"
              />
              <div className="text-md flex flex-col gap-6 text-stone-950 dark:text-stone-50">
                {project.embed && (
                  <iframe
                    height="600"
                    src={project.embed}
                    allowFullScreen
                  ></iframe>
                )}
                <PortableText value={project.content} components={components} />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
