import { getProjects } from "@/sanity/sanity-utils";
import { getBooks } from "@/sanity/sanity-utils";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { Playfair_Display } from "next/font/google";
const playfairDisplay = Playfair_Display({
  weight: "400", // Specify the weight you need (Playfair Display supports multiple weights)
  subsets: ["latin"], // Optional: specify subsets
});

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
      {/* navigation */}
      <div className="sticky left-4 right-4 top-4 z-50 px-6  md:px-12">
        <div className="flex w-full justify-between rounded-3xl border bg-secondary/20 p-1 backdrop-blur-md">
          <div className="flex w-full flex-1 flex-wrap content-stretch items-stretch justify-stretch gap-1">
            <Link
              href="https://twitter.com/leosuccarferre"
              target="_blank"
              className="text-md flex items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary"
            >
              My Twitter
              <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/leosuccarferre/"
              target="_blank"
              className="text-md flex items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary"
            >
              My LinkedIn
              <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
            </Link>
            <Link
              href="https://cal.com/leo.dev/20min"
              target="_blank"
              className="text-md flex items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary"
            >
              Book a call w/ me
              <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
            </Link>
            <Link
              href=""
              className="text-md flex cursor-pointer items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary"
            >
              <CopyToClipboard className="flex" textToCopy="leo@leo.dev">
                Copy my email
                <TbCopy className="h-4 w-4 self-start text-stone-500" />
              </CopyToClipboard>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-md flex items-center rounded-full bg-transparent px-4 py-2 pr-3 hover:bg-secondary hover:no-underline ">
                My résumés
                <TbChevronDown className="h-4 w-4 text-stone-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link
                    href="/Leo-SF-Resume-May-2025.pdf"
                    target="_blank"
                    className="flex pr-0"
                  >
                    Adobe PDF
                    <TbArrowUpRight className="h-4 w-4 self-start text-stone-500" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/Leo-SF-Resume-May-2025.docx"
                    target="_blank"
                    className="flex pr-0"
                  >
                    Word DOCX
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
                    href="https://read.cv/leo.dev"
                    target="_blank"
                    className="flex pr-0"
                  >
                    Read.cv
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

      {/* unicorn
      <iframe
        src="https://unicorn.studio/embed/AyFghFWYp37UJfD7Sn7P?preview=true"
        // width="1022px"
        height="300px"
        loading="lazy"
        className="-mt-12 w-full mix-blend-exclusion dark:mix-blend-lighten"
      ></iframe> */}

      <div className="mt-16 flex flex-col gap-12">
        <div className="flex flex-col px-6 md:px-12">
          <p className="font-semibold">Leo Succar</p>
          <p className=" max-w-xl text-stone-500">
            Product Designer experienced in systems and tools, focused on
            AI-first workflows, crafting design systems and end-to-end
            experiences across web and native. Currently with{" "}
            <Link href="https://meta.com" target="_blank">
              <span className="text-blue-500 underline decoration-dotted hover:decoration-solid">
                Meta
              </span>
            </Link>{" "}
            and{" "}
            <Link href="https://plasmic.app" target="_blank">
              <span className="text-pink-500 underline decoration-dotted hover:decoration-solid">
                Plasmic
              </span>
            </Link>
            .
          </p>

          {/* <div>
            Formerly with{" "}
            <Link href="https://meta.com" target="_blank">
              <span className="text-blue-500 underline decoration-dotted hover:decoration-solid">
                Meta
              </span>
            </Link>
            ,{" "}
            <Link href="https://sourcegraph.com" target="_blank">
              <span className="text-violet-500 underline decoration-dotted hover:decoration-solid">
                Sourcegraph
              </span>
            </Link>
            , and{" "}
            <Link href="https://bitgo.com" target="_blank">
              <span className="text-sky-500 underline decoration-dotted hover:decoration-solid">
                BitGo
              </span>
            </Link>
            .
          </div> */}
        </div>

        <Separator />

        {/* experience */}
        <div>
          <div className="px-6 pb-12 md:px-12">
            <div className="font-semibold">Experience</div>
            <div className=" text-stone-500">
              My work and employment history.
            </div>
          </div>

          <ul className="flex flex-col gap-4 px-6  md:px-12">
            <li className="flex w-full items-center justify-between">
              <div className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarImage src="/logo-me.svg" />
                  <AvatarFallback className="text-stone-500">P</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <a
                    className="underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
                    href="https://www.meta.com"
                    target="_blank"
                  >
                    Meta
                  </a>
                  <div className="italic text-stone-500">
                    Product Designer (Contract)
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p>2024–Present</p>
                <p className="text-stone-500">Remote</p>
              </div>
            </li>
            <Separator />
            <li className="flex w-full items-center justify-between">
              <div className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarImage src="/logo-pl.svg" />
                  <AvatarFallback className="text-stone-500">P</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <a
                    className="w-fit  underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                    href="https://plasmic.app"
                    target="_blank"
                  >
                    Plasmic
                  </a>
                  <div className="italic text-stone-500">Founding Designer</div>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p>2020–Present</p>
                <p className="text-stone-500">Remote</p>
              </div>
            </li>
            <Separator />
            <li className="flex w-full items-center justify-between">
              <div className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarImage src="/logo-bg.svg" />
                  <AvatarFallback className="text-stone-500">B</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <a
                    className="w-fit  underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                    href="https://www.bitgo.com/"
                    target="_blank"
                  >
                    BitGo
                  </a>
                  <div className="italic text-stone-500">
                    Senior Product & Design Systems Designer (Contract)
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p>2023–&#39;24</p>
                <p className="text-stone-500">Remote</p>
              </div>
            </li>
            <Separator />
            <li className="flex w-full items-center justify-between">
              <div className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarImage src="/logo-fb.svg" />
                  <AvatarFallback className="text-stone-500">F</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div>
                    Facebook (now{" "}
                    <a
                      className="underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
                      href="https://www.meta.com"
                      target="_blank"
                    >
                      Meta
                    </a>
                    )
                  </div>
                  <div className="text-stone-500">
                    <i>Product & Design Systems Designer</i>, xDesign & Core
                    Systems
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p>2018–&#39;20</p>
                <p className="text-stone-500">Menlo Park, CA</p>
              </div>
            </li>
            <Separator />
            <li className="flex w-full items-center justify-between">
              <div className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarImage src="/logo-sg.svg" />
                  <AvatarFallback className="text-stone-500">S</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <a
                    className="w-fit  underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
                    href="https://sourcegraph.com"
                    target="_blank"
                  >
                    Sourcegraph
                  </a>
                  <div className="italic text-stone-500">
                    Lead Product Designer
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p>2017–&#39;18</p>
                <p className="text-stone-500">San Francisco, CA</p>
              </div>
            </li>
            <Separator />
            <li className="flex w-full items-center justify-between">
              <div className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarImage src="/logo-ze.svg" />
                  <AvatarFallback className="text-stone-500">Z</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div>
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
                  <div className="text-stone-500">
                    <i>Senior Product Designer</i>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p>2016</p>
                <p className="text-stone-500">San Francisco, CA</p>
              </div>
            </li>
            <Separator />
            <li className="flex w-full items-center justify-between">
              <div className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarImage src="/logo-sd.svg" />
                  <AvatarFallback className="text-stone-500">S</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div>
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
                  <div className="italic text-stone-500">Product Designer</div>
                </div>
              </div>
              <div className="flex flex-col items-end text-end">
                <p>2014–&#39;15</p>
                <p className="text-stone-500">Miami, FL</p>
              </div>
            </li>
          </ul>
        </div>

        {/* <Card className="rounded-3xl bg-white dark:bg-black/50 shadow-none dark:bg-black/50">
          <CardHeader>
            <CardTitle className=">Favorite Tools</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h4 className=" text-stone-500">Design</h4>
              <p>
                Figma, Photoshop, Illustrator, Play, Procreate, FigJam, tldraw
              </p>
            </div>
            <Separator />
            <div className="flex flex-col gap-1">
              <h4 className=" text-stone-500">Low-code</h4>
              <p>Framer, Webflow, Toddle, Plasmic</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-1">
              <h4 className=" text-stone-500">Development</h4>
              <p>HTML, CSS, Tailwind CSS, shadcn/ui, Radix, Cody, Copilot</p>
            </div>
          </CardContent>
        </Card> */}

        <Separator />

        <div>
          <div className="px-6 pb-12 md:px-12">
            <div className="font-semibold">References</div>
            <div className=" text-stone-500">
              Folks I&#39;ve had the pleasure of working with.
            </div>
          </div>

          <div className="relative -mb-12 flex w-full snap-x snap-mandatory items-center gap-6 overflow-x-auto px-6 pb-12 md:px-12">
            <div className="flex h-fit max-w-lg shrink-0 snap-center flex-col gap-4 rounded-xl border border-yellow-500/20 bg-yellow-50/40 p-6 text-yellow-950 dark:border-yellow-500/10 dark:bg-yellow-950/20 dark:text-yellow-50/80">
              <div className={playfairDisplay.className}>
                <blockquote className="flex flex-col gap-2 text-lg font-extralight leading-[1.5]">
                  <p>
                    &#34;Leo volunteered to design for the Sticker Admin Tool
                    for the Story Creation Team, which is one of our most
                    important tools, to be used to deploy/manage sticker assets
                    in sticker tray for public users.
                  </p>
                  <p>
                    Historically, it has been a huge pain point as the old tool
                    is lacking a lot of functionalities and very inefficient to
                    use.
                  </p>
                  <p>
                    Leo dedicated himself to this project with full passion and
                    went full speed. After several iterations, the design was
                    perfected and received very positive feedback from people
                    across the whole Story Creation Team, which also made it to
                    the &#39;Story of the Week.&#39;&#34;
                  </p>
                </blockquote>
              </div>
              <div className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-yellow-500/20 text-yellow-900/80 dark:text-yellow-50/80">
                    JY
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p>James Yu</p>
                  <p className="text-yellow-900/60 dark:text-yellow-50/40">
                    Senior Software Engineer, Meta
                  </p>
                </div>
              </div>
            </div>

            <div className="flex h-fit max-w-lg shrink-0 snap-center flex-col gap-4 rounded-xl border border-lime-500/20 bg-lime-50/40 p-6 text-lime-950 dark:border-lime-500/10 dark:bg-lime-950/20 dark:text-lime-50/80">
              <div className={playfairDisplay.className}>
                <blockquote className="flex flex-col gap-2 text-lg font-extralight leading-[1.5]">
                  <p>
                    &#34;Leo is a deep thinker who lives in-between design and
                    code. While at BitGo, Leo took ownership of the design
                    system by streamlining components, testing new UI elements
                    within the product, and bridging those components with our
                    UI repository. He&#39;s excited to live in these two worlds
                    by supporting both the design and front-end engineering
                    teams.
                  </p>
                  <p>
                    Previously, he led some of BitGo&#39;s newest market growing
                    spaces, including BitGo Prime and Go products, helping
                    connect our users with partner services.
                  </p>
                  <p>
                    Leo has a level head and pragmatic style required to design,
                    build, launch, and maintain complex systems.&#34;
                  </p>
                </blockquote>
              </div>
              <div className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-lime-500/20 text-lime-900/80 dark:text-lime-50/80">
                    AL
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p>Alexander Lambert</p>
                  <p className="text-lime-900/60 dark:text-lime-50/40">
                    Design Director, BitGo
                  </p>
                </div>
              </div>
            </div>

            <div className="flex h-fit max-w-lg shrink-0 snap-center flex-col gap-4 rounded-xl border border-green-500/20 bg-green-50/40 p-6 text-green-950 dark:border-green-500/10 dark:bg-green-950/20 dark:text-green-50/80">
              <div className={playfairDisplay.className}>
                <blockquote className="flex flex-col gap-2 text-lg font-extralight leading-[1.5]">
                  &#34;Rarely do you meet a creative with such a lethal
                  combination of technical skills and fundamental design
                  ability. Leo can handle any project from classic graphic
                  design to robust web projects using the latest technology with
                  ease. It was a pleasure to work with someone who was never out
                  of their element.&#34;
                </blockquote>
              </div>
              <div className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-green-500/20 text-green-900/80 dark:text-green-50/80">
                    JH
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p>Justin Harsch</p>
                  <p className="text-green-900/60 dark:text-green-50/40">
                    Design Director, Benenson Strategy Group
                  </p>
                </div>
              </div>
            </div>

            <div className="flex h-fit max-w-lg shrink-0 snap-center flex-col gap-4 rounded-xl border border-emerald-500/20 bg-emerald-50/40 p-6 text-emerald-950 dark:border-emerald-500/10 dark:bg-emerald-950/20 dark:text-emerald-50/80">
              <div className={playfairDisplay.className}>
                <blockquote className="flex flex-col gap-2 text-lg font-extralight leading-[1.5]">
                  &#34;I can&#39;t stress the relief I felt every time Leo and I
                  worked together. He is one of the most reliable partners and
                  brings an incredible amount of creativity and expertise to
                  every project.&#34;
                </blockquote>
              </div>
              <div className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-emerald-500/20 text-emerald-900/80 dark:text-emerald-50/80">
                    MB
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p>Melissa Bazillion</p>
                  <p className="text-emerald-900/60 dark:text-emerald-50/40">
                    Marketing Strategist, MassMutual
                  </p>
                </div>
              </div>
            </div>

            <div className="flex h-fit max-w-lg shrink-0 snap-center flex-col gap-4 rounded-xl border border-teal-500/20 bg-teal-50/40 p-6 text-teal-950 dark:border-teal-500/10 dark:bg-teal-950/20 dark:text-teal-50/80">
              <div className={playfairDisplay.className}>
                <blockquote className="flex flex-col gap-2 text-lg font-extralight leading-[1.5]">
                  &#34;[Leo is] killing it on the design front! Thank you so
                  much for your hard work and always pushing for what&#39;s best
                  for the customer! It&#39;s been super fun working together and
                  I&#39;m beyond excited to get [our project] out to the
                  world!&#34;
                </blockquote>
              </div>
              <div className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-teal-500/20 text-teal-900/80 dark:text-teal-50/80">
                    BT
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p>Bryce Truman</p>
                  <p className="text-teal-900/60 dark:text-teal-50/40">
                    Product Manager, BitGo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="px-6 font-semibold md:px-12">Book Shelf</div>

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
                    className="flex h-20 w-20 rounded-xl object-cover transition group-hover:scale-[1.5]"
                  />
                )}
                <div className="flex items-end justify-between">
                <div className="flex flex-col text-left font-medium text-stone-950 dark:text-stone-50">
                  <div>{book.name}</div>
                  <div className=" text-stone-500">{book.client}</div>
                </div>
                <div className=" text-stone-500">{book.year}</div>
              </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea> */}

        <Separator />

        <div>
          <div className="px-6 pb-12 md:px-12">
            <div className="font-semibold">Projects</div>
            <div className=" text-stone-500">
              Shots and embeds of my past work.
            </div>
          </div>

          <div className="auto-rows grid grid-cols-1 gap-6 md:grid-cols-2 md:px-12">
            {projects.map((project) => (
              // project card
              <Dialog key={project._id}>
                <DialogTrigger className="group flex flex-col items-stretch gap-6 overflow-clip rounded-xl border bg-secondary p-6 hover:bg-secondary/40 dark:bg-secondary/40 dark:hover:bg-secondary">
                  <div className="flex flex-col text-left  text-stone-950 dark:text-stone-50">
                    <div className="truncate">{project.name}</div>
                    <div className="flex flex-row justify-between text-stone-500">
                      <div className="flex-1">{project.client}</div>
                      <div className="text-right">{project.year}</div>
                    </div>
                  </div>

                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={800}
                      height={400}
                      loading="lazy"
                      className="-mb-40 aspect-[4/3] rounded-sm object-cover transition group-hover:-translate-y-[44px] group-hover:shadow-2xl md:-mb-28"
                    />
                  )}
                </DialogTrigger>

                <DialogContent className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-auto rounded-lg md:max-w-5xl">
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
                        className="hidden md:inline"
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
        </div>

        <div className="flex flex-col gap-4 p-6 md:p-12">
          <div className=" text-stone-500">
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
