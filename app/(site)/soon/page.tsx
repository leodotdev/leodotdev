import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TbArrowUpRight, TbCopy } from "react-icons/tb";

export default function Soon() {
  return (
    <main className="flex flex-col gap-6">
      <section>
        <div className="flex items-stretch">
          <Card className="basis-1/4 rounded-r-none">
            <CardHeader>
              <CardTitle className="text-lg">Let&#39;s go!</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Start by booking a call and if we&#39;re a good fit, I&#39;ll
                invite you to a private and secure Signal chat where we&#39;ll
                continuously collaborate.
              </p>
            </CardContent>
          </Card>
          <Card className="basis-1/4 rounded-none border-l-0">
            <CardHeader>
              <CardTitle className="text-lg">Request</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Share your design requirements and project details directly with
                me.
              </p>
            </CardContent>
          </Card>
          <Card className="basis-1/4 rounded-none border-l-0">
            <CardHeader>
              <CardTitle className="text-lg">Create</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                I&#39;ll craft your initial design draft, focusing on quality
                and alignment with your vision.
              </p>
            </CardContent>
          </Card>
          <Card className="basis-1/4 rounded-l-none border-l-0">
            <CardHeader>
              <CardTitle className="text-lg">Edit</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Provide feedback and request revisions until the design meets
                your complete satisfaction.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <section>
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left text-xl">
              What is leo.dev?
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              <span className="font-semibold">
                leo<span className="text-orange-500">.</span>dev
              </span>{" "}
              is a personalized design subscription service where I offer
              unlimited product, web, and product design tailored to your unique
              needs. As a dedicated designer with extensive experience, I&#39;m
              here to ensure your vision comes to life exactly as you imagine
              it.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left text-xl">
              <span>How does it work?</span>
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              It&#39;s simple! Once you subscribe, you&#39;ll get direct access
              to the platform. Submit your design requests, and I&#39;ll begin
              crafting your initial draft. My goal is to deliver first drafts
              within a set timeframe, allowing for prompt revisions until
              you&#39;re 100% satisfied with the final product.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left text-xl">
              <span>How is this different from other design services?</span>
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              Unlike larger agencies or freelance marketplaces, I offer a
              personal touch with the benefit of unlimited requests and
              revisions at a flat monthly rate. This means you get consistent,
              high-quality design work without the unpredictability of costs or
              the hassle of coordinating with multiple designers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left text-xl">
              <span>Who can benefit from using this?</span>
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              My service is ideal for startups, small businesses, entrepreneurs,
              and marketers looking for bespoke design solutions without the
              overhead of a full-time designer. Whether you need branding,
              website design, social media graphics, or more, I&#39;m here to
              support your vision.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left text-xl">
              <span>How quickly will I receive my designs?</span>
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              I understand the importance of deadlines and strive to deliver
              initial drafts within 1-2 business days for most projects. The
              complexity of your request may influence timing, but I&#39;m
              committed to working efficiently to meet your needs without
              sacrificing quality.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-left text-xl">
              <span>What if I&#39;m not happy with a design?</span>
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              Your complete satisfaction is my priority. If a design isn&#39;t
              quite right, let me know, and I&#39;ll make the necessary
              revisions. My unlimited revision policy ensures we refine it until
              it perfectly matches your expectations. Should a project require a
              new direction, I&#39;m more than willing to adapt my approach.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-left text-xl">
              <span>Is there a limit to how many requests I can make?</span>
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              Not at all! My subscription model is designed to accommodate
              unlimited design requests. No matter how big or small your needs,
              I&#39;m here to provide the continuous support your project
              deserves.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-left text-xl">
              <span>How do I get started?</span>
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              Beginning is easy. Choose the plan that fits your needs and sign
              up. You can start submitting design requests right away through
              the easy-to-use platform, and I&#39;ll be here to bring your ideas
              to life.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
}
