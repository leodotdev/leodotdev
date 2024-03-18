import { getProjects } from "@/sanity/sanity-utils";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { ThemeSwitcher } from "../../theme-switcher";

import { Button } from "@/components/ui/button";

import CopyToClipboard from "@/components/CopyToClipboard";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";

import { TbArrowUpRight, TbChevronDown, TbCopy } from "react-icons/tb";

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
    <div className="flex flex-col gap-12 pt-32 md:pt-24">
      <div className="flex flex-col gap-6 border-0 px-6 md:px-12">
        <Link href="/" className="">
          <div className="text-xl font-bold">Leo Succar</div>
        </Link>
        <div className="text-md">
          I&#39;m a Senior Product & Design Systems Designer at{" "}
          <Link href="https://bitgo.com" target="_blank">
            <span className="text-sky-500 underline decoration-dotted hover:decoration-solid">
              BitGo
            </span>
          </Link>
          .
        </div>
        <div className="text-md text-stone-950 dark:text-stone-50">
          Previously, I was with{" "}
          <Link href="https://plasmic.app" target="_blank">
            <span className="text-pink-500 underline decoration-dotted hover:decoration-solid">
              Plasmic
            </span>
            ,
          </Link>{" "}
          <Link href="https://meta.com" target="_blank">
            <span className="text-blue-500 underline decoration-dotted hover:decoration-solid">
              Meta
            </span>
          </Link>
          , and{" "}
          <Link href="https://sourcegraph.com" target="_blank">
            <span className="text-violet-500 underline decoration-dotted hover:decoration-solid">
              Sourcegraph
            </span>
          </Link>
          .
        </div>
      </div>

      <div className="sticky left-4 right-4 top-4 z-50 mx-auto flex w-fit max-w-screen-md flex-wrap items-center justify-center justify-self-center rounded-full border px-3 align-middle backdrop-blur-lg">
        <Link href="https://twitter.com/leosuccarferre" target="_blank">
          <Button
            variant="link"
            tabIndex={-1}
            className="text-md flex h-12 items-center rounded-none pr-3 "
          >
            Twitter
            <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
          </Button>
        </Link>
        <Link
          href="https://www.linkedin.com/in/leosuccarferre/"
          target="_blank"
        >
          <Button
            variant="link"
            tabIndex={-1}
            className="text-md flex h-12 items-center rounded-none pr-3 "
          >
            LinkedIn
            <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
          </Button>
        </Link>
        <Link href="https://cal.com/leo.dev/20min" target="_blank">
          <Button
            variant="link"
            tabIndex={-1}
            className="text-md flex h-12 items-center rounded-none pr-3 "
          >
            Book a Call
            <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
          </Button>
        </Link>
        <Link href="">
          <CopyToClipboard textToCopy="leo@leo.dev">
            <Button
              variant="link"
              tabIndex={-1}
              className="text-md flex h-12 items-center rounded-none pr-3 hover:no-underline"
            >
              Copy my Email
              <TbCopy className="h-4 w-4 self-start text-stone-500" />
            </Button>
          </CopyToClipboard>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="text-md flex h-12 items-center px-4 pr-3 font-medium text-stone-900 dark:text-stone-50">
            Résumé <TbChevronDown className="h-4 w-4 text-stone-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link
                href="/Leo-SF-Resume-2024.pdf"
                target="_blank"
                className="flex pr-0"
              >
                Adobe PDF
                <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="https://docs.google.com/document/d/17uK2emyv7p8VYtYV5M36g3mxQ0CvbhDanzWVnVvtIiE/edit?usp=sharing"
                target="_blank"
                className="flex pr-0"
              >
                Google DOC
                <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/Leo-SF-Resume-2024.docx"
                target="_blank"
                className="flex pr-0"
              >
                Word DOCX
                <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <ThemeSwitcher />
            </TooltipTrigger>
            <TooltipContent side="bottom">Theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="auto-rows gap-6 px-6 md:grid-cols-3 md:px-12">
        <ul className="flex flex-col gap-4">
          <li className="flex w-full items-center justify-between gap-4">
            <div className="flex flex-row items-center gap-2">
              <Avatar>
                <AvatarImage src="/logo-bg.svg" />
                <AvatarFallback className="text-stone-500">B</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="text-md font-medium">
                  Senior Product & Design Systems Designer
                </div>
                <a
                  className="text-sm text-stone-500 underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
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
                <AvatarFallback className="text-stone-500">P</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="text-md font-medium">Founding Designer</div>
                <a
                  className="text-sm text-stone-500 underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
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
                <AvatarFallback className="text-stone-500">F</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="text-md font-medium">
                  Product & Design Systems Designer
                </div>
                <span className="text-sm text-stone-500">
                  <a
                    className="underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
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
                <AvatarFallback className="text-stone-500">S</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="text-md font-medium">Lead Product Designer</div>
                <a
                  className="text-sm text-stone-500 underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
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
                <AvatarFallback className="text-stone-500">Z</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="text-md font-medium">
                  Senior Product Designer
                </div>
                <span className="text-sm text-stone-500">
                  <a
                    className="underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
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
                <AvatarFallback className="text-stone-500">S</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="text-md font-medium">Product Designer</div>
                <span className="text-sm text-stone-500">
                  <a
                    className="underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
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

        {/* <Card className="rounded-3xl bg-white/50 shadow-none dark:bg-black/50">
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
        </Card> */}
      </div>

      <div className="auto-rows grid gap-6 px-6 md:grid-cols-2 md:px-12">
        {projects.map((project) => (
          // project card
          <Dialog key={project._id}>
            <DialogTrigger className="group flex flex-col items-stretch gap-2 overflow-clip rounded-3xl  bg-stone-200/50 p-6 hover:bg-stone-200 dark:bg-stone-800/50 dark:hover:bg-stone-800">
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.name}
                  width={800}
                  height={400}
                  loading="lazy"
                  className="aspect-[3/2] rounded-sm object-cover transition group-hover:translate-y-5 group-hover:scale-[1.666]"
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

      <div>
        <div className="flex px-6 text-xl md:px-12">Thanks!</div>

        <div className="text-md mx-auto px-6 pb-24 md:px-12">
          Built using{" "}
          <a
            className="text-stone-950 underline decoration-dotted hover:text-blue-500 hover:decoration-solid dark:text-stone-50"
            target="_blank"
            href="https://nextjs.org/"
          >
            NextJS
          </a>
          ,{" "}
          <a
            className="text-stone-950 underline decoration-dotted hover:text-blue-500 hover:decoration-solid dark:text-stone-50"
            target="_blank"
            href="https://tailwindcss.com/"
          >
            TailwindCSS
          </a>
          ,{" "}
          <a
            className="text-stone-950 underline decoration-dotted hover:text-blue-500 hover:decoration-solid dark:text-stone-50"
            target="_blank"
            href="https://ui.shadcn.com/"
          >
            ShadcnUI
          </a>{" "}
          &{" "}
          <a
            className="text-stone-950 underline decoration-dotted hover:text-blue-500 hover:decoration-solid dark:text-stone-50"
            target="_blank"
            href="https://www.radix-ui.com/"
          >
            RadixUI
          </a>
          , and{" "}
          <a
            className="text-stone-950 underline decoration-dotted hover:text-blue-500 hover:decoration-solid dark:text-stone-50"
            target="_blank"
            href="https://www.sanity.io/"
          >
            SanityCMS
          </a>
          .
        </div>
      </div>
    </div>
  );
}
