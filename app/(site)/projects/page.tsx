import { getProjects } from "@/sanity/sanity-utils";
import { getBooks } from "@/sanity/sanity-utils";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { ThemeSwitcher } from "../../theme-switcher";

import { Button } from "@/components/ui/button";

import CopyToClipboard from "@/components/CopyToClipboard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Link from "next/link";

import { TbArrowUpRight, TbChevronDown, TbCopy } from "react-icons/tb";

export default async function Home() {
  const projects = await getProjects();
  const books = await getBooks();
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
    <div>
      <iframe
        src="https://unicorn.studio/embed/AyFghFWYp37UJfD7Sn7P"
        width="100%"
        height="274px"
        loading="lazy"
      ></iframe>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-6 border-0 px-6 pt-12 md:px-12">
          <Link href="/" className="">
            <p className="font-bold">Leo Succar</p>
            <p className="text-stone-500">
              Web, Software, Product, Visual Designer
            </p>
          </Link>
          <div>
            I&#39;m a Product & Design Systems Designer, currently with{" "}
            <Link href="https://plasmic.app" target="_blank">
              <span className="text-pink-500 underline decoration-dotted hover:decoration-solid">
                Plasmic
              </span>
            </Link>{" "}
            and{" "}
            <Link href="https://bitgo.com" target="_blank">
              <span className="text-sky-500 underline decoration-dotted hover:decoration-solid">
                BitGo
              </span>
            </Link>
            .
          </div>
          <div>
            Formerly, I was with{" "}
            <Link href="https://meta.com" target="_blank">
              <span className="text-blue-500 underline decoration-dotted hover:decoration-solid">
                Meta
              </span>
            </Link>{" "}
            and{" "}
            <Link href="https://sourcegraph.com" target="_blank">
              <span className="text-violet-500 underline decoration-dotted hover:decoration-solid">
                Sourcegraph
              </span>
            </Link>
            .
          </div>
        </div>

        {/* navigation */}
        <div className="sticky left-4 right-4 top-4 z-50 px-6 md:px-12">
          <div className="flex w-full justify-between rounded-3xl border p-1 backdrop-blur-lg">
            <div className="flex w-full flex-1 flex-wrap content-stretch items-stretch justify-stretch gap-1">
              <Link
                href="https://twitter.com/leosuccarferre"
                target="_blank"
                className="text-md flex items-center rounded-full bg-secondary px-4 py-2 pr-3 hover:bg-secondary/80"
              >
                Twitter
                <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/leosuccarferre/"
                target="_blank"
                className="text-md flex items-center rounded-full bg-secondary px-4 py-2 pr-3 hover:bg-secondary/80"
              >
                LinkedIn
                <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
              </Link>
              <Link
                href="https://cal.com/leo.dev/20min"
                target="_blank"
                className="text-md flex items-center rounded-full bg-secondary px-4 py-2 pr-3 hover:bg-secondary/80"
              >
                Book a Call
                <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
              </Link>
              <Link
                href=""
                className="text-md flex cursor-pointer items-center rounded-full bg-secondary px-4 py-2 pr-3 hover:bg-secondary/80"
              >
                <CopyToClipboard className="flex" textToCopy="leo@leo.dev">
                  Email
                  <TbCopy className="h-4 w-4 self-start text-stone-500" />
                </CopyToClipboard>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-md flex items-center rounded-full bg-secondary px-4 py-2 pr-3 hover:bg-secondary/80 hover:no-underline">
                  Résumé
                  <TbChevronDown className="h-4 w-4 text-stone-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link
                      href="https://read.cv/leo.dev"
                      target="_blank"
                      className="flex pr-0"
                    >
                      Read.cv
                      <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
                    </Link>
                  </DropdownMenuItem>{" "}
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
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <ThemeSwitcher />
                </TooltipTrigger>
                <TooltipContent side="bottom">Theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="px-6 md:px-12">
          <div className="font-bold">Experience</div>
          <div className="text-sm text-stone-500">
            Work and employment history.
          </div>
        </div>

        <div className="-mx-[1px] rounded-3xl border bg-white dark:bg-black">
          <ul className="flex flex-col">
            <li className="flex w-full items-center justify-between p-6 md:px-12 md:pt-12 ">
              <div className="flex flex-row items-center gap-2">
                <Avatar>
                  <AvatarImage src="/logo-bg.svg" />
                  <AvatarFallback className="text-stone-500">B</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-medium">
                    Senior Product & Design Systems Designer
                  </div>
                  <a
                    className="w-fit text-sm text-stone-500 underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                    href="https://www.bitgo.com/"
                    target="_blank"
                  >
                    BitGo
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p className="text-sm">2023–Present</p>
                <p className="text-sm text-stone-500">Remote</p>
              </div>
            </li>
            <Separator />
            <li className="flex w-full items-center justify-between p-6 md:px-12 ">
              <div className="flex flex-row items-center gap-2">
                <Avatar>
                  <AvatarImage src="/logo-pl.svg" />
                  <AvatarFallback className="text-stone-500">P</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-medium">Founding Designer</div>
                  <a
                    className="w-fit text-sm text-stone-500 underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
                    href="https://plasmic.app"
                    target="_blank"
                  >
                    Plasmic
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p className="text-sm">2020–Present</p>
                <p className="text-sm text-stone-500">Remote</p>
              </div>
            </li>
            <Separator />
            <li className="flex w-full items-center justify-between p-6 md:px-12 ">
              <div className="flex flex-row items-center gap-2">
                <Avatar>
                  <AvatarImage src="/logo-fb.svg" />
                  <AvatarFallback className="text-stone-500">F</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-medium">
                    Product & Design Systems Designer
                  </div>
                  <div className="text-sm text-stone-500">
                    Facebook (now{" "}
                    <a
                      className="underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
                      href="https://www.meta.com"
                      target="_blank"
                    >
                      Meta
                    </a>
                    ), xDesign & Core Systems
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p className="text-sm">2018–2020</p>
                <p className="text-sm text-stone-500">Menlo Park, CA</p>
              </div>
            </li>
            <Separator />
            <li className="flex w-full items-center justify-between p-6 md:px-12 ">
              <div className="flex flex-row items-center gap-2">
                <Avatar>
                  <AvatarImage src="/logo-sg.svg" />
                  <AvatarFallback className="text-stone-500">S</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-medium">Lead Product Designer</div>
                  <a
                    className="w-fit text-sm text-stone-500 underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
                    href="https://sourcegraph.com"
                    target="_blank"
                  >
                    Sourcegraph
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p className="text-sm">2017–2018</p>
                <p className="text-sm text-stone-500">San Francisco, CA</p>
              </div>
            </li>
            <Separator />
            <li className="flex w-full items-center justify-between p-6 md:px-12 ">
              <div className="flex flex-row items-center gap-2">
                <Avatar>
                  <AvatarImage src="/logo-ze.svg" />
                  <AvatarFallback className="text-stone-500">Z</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-medium">Senior Product Designer</div>
                  <div className="text-sm text-stone-500">
                    Zenefits (now{" "}
                    <a
                      className="underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
                      href="https://zenefits.com"
                      target="_blank"
                    >
                      TriNet
                    </a>
                    )
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p className="text-sm">2016</p>
                <p className="text-sm text-stone-500">San Francisco, CA</p>
              </div>
            </li>
            <Separator />
            <li className="flex w-full items-center justify-between p-6 md:px-12 md:pb-12">
              <div className="flex flex-row items-center gap-2">
                <Avatar>
                  <AvatarImage src="/logo-sd.svg" />
                  <AvatarFallback className="text-stone-500">S</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-medium">Product Designer</div>
                  <div className="text-sm text-stone-500">
                    SeamlessDocs (now{" "}
                    <a
                      className="underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
                      href="https://govos.com"
                      target="_blank"
                    >
                      GovOS
                    </a>
                    )
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p className="text-sm">2014–2015</p>
                <p className="text-sm text-stone-500">Miami, FL</p>
              </div>
            </li>
          </ul>

          {/* <Card className="rounded-3xl bg-white dark:bg-black/50 shadow-none dark:bg-black/50">
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

        <div className="px-6 md:px-12">
          <div className="font-bold">References</div>
          <div className="text-sm text-stone-500">
            Folks I&#39;ve had the pleasure of working with.
          </div>
        </div>

        <Carousel>
          <CarouselPrevious />
          <CarouselContent>
            <CarouselItem>
              <div className="flex flex-col gap-4 rounded-3xl border bg-white p-6 dark:bg-black md:p-12">
                <blockquote className="flex flex-col gap-4">
                  <p>
                    &#34;Leo volunteered to design for the Sticker Admin Tool
                    for the Story Creation Team, which is one of our most
                    important tools, to be used to deploy/manage sticker assets
                    in sticker tray for public users. Historically it has been a
                    huge pain point as the old tool is lacking a lot of
                    functionalities and very inefficient to use.
                  </p>
                  <p>
                    Leo dedicated himself to this project with full passion and
                    went full speed. After several iterations, the design was
                    perfected and received very positive feedback from people
                    across the whole Story Creation Team, which also made it to
                    the &#39;Story of the Week.&#39;&#34;
                  </p>
                </blockquote>
                <p className="text-sm text-stone-500">
                  - James Yu, Senior Software Engineer, Meta
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex flex-col gap-4 rounded-3xl border bg-white p-6 dark:bg-black md:p-12">
                <blockquote className="text-xl">
                  &#34;Leo is a deep thinker who lives in-between design and
                  code. While at BitGo, Leo took ownership of the design system
                  by streamlining components, testing new UI elements within the
                  product, and bridging those components with our UI repository.
                  He&#39;s excited to live in these two worlds by supporting
                  both the design and front-end engineering teams. Previously,
                  he led some of BitGo&#39;s newest market growing spaces,
                  including BitGo Prime and Go products, helping connect our
                  users with partner services. Leo has a level head and
                  pragmatic style required to design, build, launch, and
                  maintain complex systems.&#34;
                </blockquote>
                <p className="text-sm text-stone-500">
                  - Alexander Lambert, Design Director, BitGo
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex flex-col gap-4 rounded-3xl border bg-white p-6 dark:bg-black md:p-12">
                <blockquote className="text-xl">
                  &#34;Rarely do you meet a creative with such a lethal
                  combination of technical skills and fundamental design
                  ability. Leo can handle any project from classic graphic
                  design to robust web projects using the latest technology with
                  ease. It was a pleasure to work with someone who was never out
                  of their element.&#34;
                </blockquote>
                <p className="text-sm text-stone-500">
                  - Justin Harsch, Design Director, Benenson Strategy Group
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex flex-col gap-4 rounded-3xl border bg-white p-6 dark:bg-black md:p-12">
                <blockquote className="text-xl">
                  &#34;I can&#39;t stress the relief I felt every time Leo and I
                  worked together. He is one of the most reliable partners and
                  brings an incredible amount of creativity and expertise to
                  every project.&#34;
                </blockquote>
                <p className="text-sm text-stone-500">
                  - Melissa Bazillion, Marketing Strategist, MassMutual
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="flex flex-col gap-4 rounded-3xl border bg-white p-6 dark:bg-black md:p-12">
                <blockquote className="text-xl">
                  &#34;You are all killing it on the design front! Thank you so
                  much for your hard work and always pushing for what&#39;s best
                  for the customer! It&#39;s been super fun working together and
                  I&#39;m beyond excited to get [our project] out to the
                  world!&#34;
                </blockquote>
                <p className="text-sm text-stone-500">
                  - Bryce Truman, Product Manager, BitGo
                </p>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselNext />
        </Carousel>

        {/* <div className="px-6 font-bold md:px-12">Book Shelf</div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex overflow-x-auto">
          {books.map((book) => (
            // book card
            <div key={book._id}>
              <div className="group flex shrink-0">
                {book.image && (
                  <Image
                    src={book.image}
                    alt={book.name}
                    width={100}
                    height={200}
                    loading="lazy"
                    className="flex h-20 w-20 rounded-sm object-cover transition group-hover:scale-[1.5]"
                  />
                )}
                <div className="flex items-end justify-between">
                <div className="flex flex-col text-left font-medium text-stone-950 dark:text-stone-50">
                  <div>{book.name}</div>
                  <div className="text-sm text-stone-500">{book.client}</div>
                </div>
                <div className="text-sm text-stone-500">{book.year}</div>
              </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea> */}

        <div className="px-6 md:px-12">
          <div className="font-bold">Projects</div>
          <div className="text-sm text-stone-500">
            Shots and embeds of past work.
          </div>
        </div>

        <div className="auto-rows grid gap-6 md:gap-12 ">
          {projects.map((project) => (
            // project card
            <Dialog key={project._id}>
              <DialogTrigger className="group -mx-[1px] flex flex-col items-stretch justify-between gap-4 overflow-clip rounded-3xl border bg-white p-6 dark:bg-black md:p-12">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col text-left text-stone-950 dark:text-stone-50">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-stone-500">
                      {project.client}
                    </div>
                  </div>
                  <div className="text-sm text-stone-500">{project.year}</div>
                </div>
                {project.image && (
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={800}
                    height={400}
                    loading="lazy"
                    className="-mb-12 aspect-[3/2] w-full overflow-visible rounded-sm object-cover transition group-hover:-translate-y-24 md:-mb-32"
                  />
                )}
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
                  <PortableText
                    value={project.content}
                    components={components}
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        <div className="flex flex-col gap-4 p-6 md:p-12">
          <div className="font-bold">Thanks for visiting!</div>

          <div className="text-sm text-stone-500">
            Built using{" "}
            <a
              className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
              target="_blank"
              href="https://nextjs.org/"
            >
              NextJS
            </a>
            ,{" "}
            <a
              className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
              target="_blank"
              href="https://tailwindcss.com/"
            >
              TailwindCSS
            </a>
            ,{" "}
            <a
              className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
              target="_blank"
              href="https://ui.shadcn.com/"
            >
              ShadcnUI
            </a>{" "}
            +{" "}
            <a
              className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
              target="_blank"
              href="https://www.radix-ui.com/"
            >
              RadixUI
            </a>
            , and{" "}
            <a
              className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
              target="_blank"
              href="https://www.sanity.io/"
            >
              SanityCMS
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
