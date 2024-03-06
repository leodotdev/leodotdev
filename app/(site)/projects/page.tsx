import { getProjects } from "@/sanity/sanity-utils";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { createClient } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <main className="flex flex-col gap-6">
      <Card className="rounded-3xl shadow-none md:col-span-2">
        <Accordion type="single" collapsible>
          <AccordionItem className="border-0" value="item-1">
            <AccordionTrigger className="p-6 text-left md:p-12">
              <h2 className="pr-12 text-2xl font-semibold leading-8 text-stone-950 dark:text-stone-50">
                {/* <Image
                  width="32"
                  height="32"
                  alt="brush"
                  src="/emoji-waving-hand.svg"
                  className="inline-block align-text-bottom"
              /> */}
                I&#39;m a Web, Software, Product Designer.{" "}
                <span className="font-light text-stone-700 dark:text-stone-300">
                  I began computer arts and design at a young age using
                  Macromedia and Adobe software
                  {/* {" "}<Image
                    width="32"
                    height="32"
                    alt="brush"
                    src="/emoji-optical-disk.svg"
                    className="inline-block align-text-bottom"
                /> */}
                  , and later received my Bachelor of Arts in New Media{" "}
                  {/* <Image
                    width="32"
                    height="32"
                    alt="brush"
                    src="/emoji-scroll.svg"
                    className="inline-block align-text-bottom"
                />{" "} */}
                  at Emerson College in Boston. I am a Senior Product, Visual,
                  and Design Systems Designer,{" "}
                  {/* <Image
                    width="32"
                    height="32"
                    alt="brush"
                    src="/emoji-pencil.svg"
                    className="inline-block align-text-bottom"
                /> */}
                  and a <em>Junior</em> Design Engineer
                  {/* {" "}<Image
                    width="32"
                    height="32"
                    alt="brush"
                    src="/emoji-hammer.svg"
                    className="inline-block align-text-bottom"
                /> */}
                  .
                </span>
              </h2>
            </AccordionTrigger>

            <AccordionContent className="p-12 px-6 pt-0 text-stone-700 md:px-12 lg:px-12 xl:px-80 dark:text-stone-300">
              <p className="mb-4 text-base leading-7">
                I have now over 8 years of experience with Figma and large,
                cutting edge React-based design systems. I&#39;ve worked closely
                with full-stack engineers, designers, and product management
                teams across many domains and industries. I am primarily a
                self-taught generalist and a lifelong learner.
              </p>
              <p className="mb-4 text-base leading-7">
                I also have strong experience with modern front-end development
                and visual development tools. I&#39;ve worked with customer- and
                data-driven teams, employing qualitative and quantitative UX
                research methods like customer interviews, event tracking, user
                journeys and personas, rapidly prototyping, overseeing design
                audits, supporting accessibility and localization, and much
                more.
              </p>
              <p className="text-base leading-7">
                At Plasmic, I focused on empowering designers and others with
                access to the rest of the development stack:
                token/style/component design systems, content management
                systems, data sources and integrations, state and
                user/authentication management, A/B testing and optimization,
                code generation and deployment, and multiplayer preview, testing
                and collaboration. It&#39;s been incredible to see everything
                people make with what we&#39;ve built and be part of such an
                enthusiastic and creative community.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <div className="auto-rows grid gap-6 md:grid-cols-3">
        <Card className="rounded-3xl shadow-none md:col-span-2">
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-4">
              <li className="flex w-full flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/logo-bg.svg" />
                    <AvatarFallback className="text-stone-500">
                      B
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-medium">
                      Senior Product Designer, Design Systems Designer
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
              <li className="flex w-full flex-row items-center justify-between">
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
              <li className="flex w-full flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/logo-fb.svg" />
                    <AvatarFallback className="text-stone-500">
                      F
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h4 className="font-medium">
                      Product Designer, Design Systems Designer
                    </h4>
                    <span className="text-sm text-stone-500">
                      <a
                        className="underline hover:text-blue-500"
                        href="https://www.meta.com"
                        target="_blank"
                      >
                        Facebook
                      </a>{" "}
                      (now Meta), xDesign + Core Systems
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end text-end">
                  <p className="text-sm">2018–2020</p>
                  <p className="text-sm">Menlo Park, CA</p>
                </div>
              </li>
              <Separator />
              <li className="flex w-full flex-row items-center justify-between">
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
              <li className="flex w-full flex-row items-center justify-between">
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
              <li className="flex w-full flex-row items-center justify-between">
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
            <CardTitle>Favorite Tools</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h4 className="text-sm text-stone-500">Design</h4>
              <p className="text-sm">Figma, Sketch, Photoshop, Illustrator</p>
              <p className="text-sm">Play, Procreate, FigJam, tldraw</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-1">
              <h4 className="text-sm text-stone-500">Low-code</h4>
              <p className="text-sm">Framer, Webflow, Toddle, Plasmic</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-1">
              <h4 className="text-sm text-stone-500">Development</h4>
              <p className="text-sm">
                HTML, CSS, Tailwind CSS, shadcn/ui, Radix
              </p>
              <p className="text-sm">Cody, Copilot</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="auto-rows grid gap-6 md:grid-cols-3">
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
                  className="aspect-[3/2] rounded-lg object-cover transition group-hover:translate-y-5 group-hover:scale-[1.666]"
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
    </main>
  );
}
