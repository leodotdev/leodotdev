"use client";

import { motion } from "framer-motion";

import { TbFileText } from "react-icons/tb";

import Link from "next/link";

// const { scrollYProgress } = useScroll();

export default function Home() {
  return (
    <main>
      <div className="container p-12 lg:p-24">
        {/* header */}
        <div className="mb-24 flex w-full flex-row items-center justify-between gap-4">
          <Link href="/" className="flex flex-col">
            <h2 className={`text-2xl font-semibold text-stone-950`}>Leo</h2>
            <p className={`text-md text-stone-500`}>Designer</p>
          </Link>

          {/* twitter link */}
          <div className="flex flex-row gap-4">
            <motion.a
              href="https://twitter.com/leosuccarferre"
              target="_blank"
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 1 }}
              className="cursor-pointer rounded-full bg-stone-100 p-3 px-5 text-stone-950 dark:bg-stone-800/30"
            >
              Twitter
            </motion.a>

            {/* linkedin link */}
            <motion.a
              href="https://www.linkedin.com/in/leosuccarferre/"
              target="_blank"
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 1 }}
              className="cursor-pointer rounded-full bg-stone-100 p-3 px-5 text-stone-950 dark:bg-stone-800/30"
            >
              LinkedIn
            </motion.a>

            {/* link to resume */}
            <motion.a
              href="/Leo-SF-Resume-2023.pdf"
              target="_blank"
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 1 }}
              className="cursor-pointer self-center rounded-full bg-stone-100 p-3 px-5 dark:bg-stone-800/30"
            >
              <TbFileText title="Resume" className="h-5 w-5 stroke-stone-950" />
            </motion.a>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8"> SOON…</div>
      </div>
    </main>
  );
}
