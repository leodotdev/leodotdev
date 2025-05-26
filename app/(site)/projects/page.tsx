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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Link from "next/link";

import { TbArrowUpRight } from "react-icons/tb";
import { ProjectsClient } from "./projects-client";
import { ProjectsWrapper } from "./projects-wrapper";
import { Navigation } from "@/components/Navigation";

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
    <ProjectsWrapper>
      <div>
        {/* navigation */}
        <Navigation />

        {/* unicorn
      <iframe
        src="https://unicorn.studio/embed/AyFghFWYp37UJfD7Sn7P?preview=true"
        // width="1022px"
        height="300px"
        loading="lazy"
        className="-mt-12 w-full mix-blend-exclusion dark:mix-blend-lighten"
      ></iframe> */}

        <div className="mt-12 flex flex-col gap-12">
          <div className="flex flex-col px-6 md:px-12">
            <p className="font-semibold">Leo Succar</p>
            <p className=" max-w-xl text-muted-foreground">
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
              <div className=" text-muted-foreground">
                My work and employment history.
              </div>
            </div>

            <div className="flex flex-col gap-4 px-6 md:px-12">
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/logo-me.svg" />
                    <AvatarFallback className="text-muted-foreground">
                      P
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col md:flex-row md:gap-2">
                    <a
                      className="underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
                      href="https://www.meta.com"
                      target="_blank"
                    >
                      Meta
                    </a>
                    <span className="hidden text-muted-foreground md:inline">
                      ·
                    </span>
                    <div className="italic text-muted-foreground">
                      Product Designer (Contract)
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end md:flex-row md:gap-2">
                  <p className="text-muted-foreground">Remote</p>
                  <span className="hidden text-muted-foreground md:inline">
                    ·
                  </span>
                  <p>2024–Present</p>
                </div>
              </div>
              <Separator />
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/logo-pl.svg" />
                    <AvatarFallback className="text-muted-foreground">
                      P
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col md:flex-row md:gap-2">
                    <a
                      className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                      href="https://plasmic.app"
                      target="_blank"
                    >
                      Plasmic
                    </a>
                    <span className="hidden text-muted-foreground md:inline">
                      ·
                    </span>
                    <div className="italic text-muted-foreground">
                      Founding Designer
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end md:flex-row md:gap-2">
                  <p className="text-muted-foreground">Remote</p>
                  <span className="hidden text-muted-foreground md:inline">
                    ·
                  </span>
                  <p>2020–Present</p>
                </div>
              </div>
              <Separator />
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/logo-bg.svg" />
                    <AvatarFallback className="text-muted-foreground">
                      B
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col md:flex-row md:gap-2">
                    <a
                      className="underline decoration-dotted hover:text-blue-500 hover:decoration-solid"
                      href="https://www.bitgo.com/"
                      target="_blank"
                    >
                      BitGo
                    </a>
                    <span className="hidden text-muted-foreground md:inline">
                      ·
                    </span>
                    <div className="italic text-muted-foreground">
                      Senior Product & Design Systems Designer (Contract)
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end md:flex-row md:gap-2">
                  <p className="text-muted-foreground">Remote</p>
                  <span className="hidden text-muted-foreground md:inline">
                    ·
                  </span>
                  <p>2023–&#39;24</p>
                </div>
              </div>
              <Separator />
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/logo-fb.svg" />
                    <AvatarFallback className="text-muted-foreground">
                      F
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col md:flex-row md:gap-2">
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
                    <span className="hidden text-muted-foreground md:inline">
                      ·
                    </span>
                    <div className="italic text-muted-foreground">
                      Product & Design Systems Designer
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end md:flex-row md:gap-2">
                  <p className="text-muted-foreground">Menlo Park, CA</p>
                  <span className="hidden text-muted-foreground md:inline">
                    ·
                  </span>
                  <p>2018–&#39;20</p>
                </div>
              </div>
              <Separator />
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/logo-sg.svg" />
                    <AvatarFallback className="text-muted-foreground">
                      S
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col md:flex-row md:gap-2">
                    <a
                      className="underline decoration-dotted hover:text-blue-500  hover:decoration-solid"
                      href="https://sourcegraph.com"
                      target="_blank"
                    >
                      Sourcegraph
                    </a>
                    <span className="hidden text-muted-foreground md:inline">
                      ·
                    </span>
                    <div className="italic text-muted-foreground">
                      Lead Product Designer
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end md:flex-row md:gap-2">
                  <p className="text-muted-foreground">San Francisco, CA</p>
                  <span className="hidden text-muted-foreground md:inline">
                    ·
                  </span>
                  <p>2017–&#39;18</p>
                </div>
              </div>
              <Separator />
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/logo-ze.svg" />
                    <AvatarFallback className="text-muted-foreground">
                      Z
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col md:flex-row md:gap-2">
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
                    <span className="hidden text-muted-foreground md:inline">
                      ·
                    </span>
                    <div className="italic text-muted-foreground">
                      Senior Product Designer
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end md:flex-row md:gap-2">
                  <p className="text-muted-foreground">San Francisco, CA</p>
                  <span className="hidden text-muted-foreground md:inline">
                    ·
                  </span>
                  <p>2016</p>
                </div>
              </div>
              <Separator />
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-row items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/logo-sd.svg" />
                    <AvatarFallback className="text-muted-foreground">
                      S
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col md:flex-row md:gap-2">
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
                    <span className="hidden text-muted-foreground md:inline">
                      ·
                    </span>
                    <div className="italic text-muted-foreground">
                      Product Designer
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end md:flex-row md:gap-2">
                  <p className="text-muted-foreground">Miami, FL</p>
                  <span className="hidden text-muted-foreground md:inline">
                    ·
                  </span>
                  <p>2014–&#39;15</p>
                </div>
              </div>
            </div>
          </div>

          {/* <Card className="rounded-3xl bg-white dark:bg-black/50 shadow-none dark:bg-black/50">
          <CardHeader>
            <CardTitle className=">Favorite Tools</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h4 className=" text-muted-foreground">Design</h4>
              <p>
                Figma, Photoshop, Illustrator, Play, Procreate, FigJam, tldraw
              </p>
            </div>
            <Separator />
            <div className="flex flex-col gap-1">
              <h4 className=" text-muted-foreground">Low-code</h4>
              <p>Framer, Webflow, Toddle, Plasmic</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-1">
              <h4 className=" text-muted-foreground">Development</h4>
              <p>HTML, CSS, Tailwind CSS, shadcn/ui, Radix, Cody, Copilot</p>
            </div>
          </CardContent>
        </Card> */}

          <Separator />

          <div>
            <div className="px-6 pb-12 md:px-12">
              <div className="font-semibold">References</div>
              <div className=" text-muted-foreground">
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
                      important tools, to be used to deploy/manage sticker
                      assets in sticker tray for public users.
                    </p>
                    <p>
                      Historically, it has been a huge pain point as the old
                      tool is lacking a lot of functionalities and very
                      inefficient to use.
                    </p>
                    <p>
                      Leo dedicated himself to this project with full passion
                      and went full speed. After several iterations, the design
                      was perfected and received very positive feedback from
                      people across the whole Story Creation Team, which also
                      made it to the &#39;Story of the Week.&#39;&#34;
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
                      &#34;Leo is a deep thinker who lives in between design and
                      code. While at BitGo, Leo took ownership of the design
                      system by streamlining components, testing new UI elements
                      within the product, and bridging those components with our
                      UI repository. He&#39;s excited to live in these two
                      worlds by supporting both the design and front-end
                      engineering teams.
                    </p>
                    <p>
                      Previously, he led some of BitGo&#39;s newest market
                      growing spaces, including BitGo Prime and Go products,
                      helping connect our users with partner services.
                    </p>
                    <p>
                      Leo has a level head and pragmatic style required to
                      design, build, launch, and maintain complex systems.&#34;
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
                    design to robust web projects using the latest technology
                    with ease. It was a pleasure to work with someone who was
                    never out of their element.&#34;
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
                    &#34;I can&#39;t stress the relief I felt every time Leo and
                    I worked together. He is one of the most reliable partners
                    and brings an incredible amount of creativity and expertise
                    to every project.&#34;
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
                    much for your hard work and always pushing for what&#39;s
                    best for the customer! It&#39;s been super fun working
                    together and I&#39;m beyond excited to get [our project] out
                    to the world!&#34;
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
                <div className="flex flex-col text-left font-medium text-zinc-950 dark:text-zinc-50">
                  <div>{book.name}</div>
                  <div className=" text-muted-foreground">{book.client}</div>
                </div>
                <div className=" text-muted-foreground">{book.year}</div>
              </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea> */}

          <Separator />

          <ProjectsClient projects={projects} />

          <div className="flex flex-col gap-4 p-6 md:p-12">
            <div className=" text-muted-foreground">
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
    </ProjectsWrapper>
  );
}
