import { Navigation } from "@/components/Navigation";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <Navigation />

      <main className="mx-auto max-w-screen-lg px-6 md:px-12">
        {/* Hero Section */}
        <section className="min-h-[50vh] py-24">
          <h1 className="mb-4 text-6xl font-bold">Hi, I&apos;m Leo</h1>
          <p className="text-xl text-muted-foreground">
            Web, Software, Product Designer
          </p>
        </section>

        {/* Experience Section */}
        <section id="experience" className="min-h-screen py-16">
          <h2 className="mb-8 text-4xl font-bold">Experience</h2>
          <div className="space-y-8">
            <div className="border-l-2 border-muted pl-6">
              <h3 className="text-xl font-semibold">Senior Product Designer</h3>
              <p className="text-muted-foreground">
                Company Name • 2022 - Present
              </p>
              <p className="mt-2">Description of role and achievements...</p>
            </div>
            <div className="border-l-2 border-muted pl-6">
              <h3 className="text-xl font-semibold">Product Designer</h3>
              <p className="text-muted-foreground">
                Another Company • 2020 - 2022
              </p>
              <p className="mt-2">Description of role and achievements...</p>
            </div>
            {/* Add more experience items */}
          </div>
        </section>

        {/* References Section */}
        <section id="references" className="min-h-screen py-16">
          <h2 className="mb-8 text-4xl font-bold">References</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-6">
              <blockquote className="italic">
                &ldquo;Leo is an exceptional designer who brings creativity and
                technical expertise to every project.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm font-semibold">John Doe</p>
              <p className="text-sm text-muted-foreground">CEO, Tech Company</p>
            </div>
            <div className="rounded-lg border p-6">
              <blockquote className="italic">
                &ldquo;Working with Leo was a game-changer for our product
                design.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm font-semibold">Jane Smith</p>
              <p className="text-sm text-muted-foreground">
                Product Manager, Startup
              </p>
            </div>
            {/* Add more references */}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="min-h-screen py-16">
          <h2 className="mb-8 text-4xl font-bold">Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/projects" className="group">
              <div className="overflow-hidden rounded-lg border transition-colors hover:bg-secondary">
                <div className="aspect-video bg-muted"></div>
                <div className="p-4">
                  <h3 className="font-semibold group-hover:underline">
                    Project Name
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Brief description
                  </p>
                </div>
              </div>
            </Link>
            {/* Add more project cards */}
          </div>
        </section>
      </main>
    </div>
  );
}
