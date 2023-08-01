"use client";

import Image from "next/image";
import { motion, useScroll } from "framer-motion";

import { TbPaint, TbBinaryTree, TbFileText } from "react-icons/tb";

// const { scrollYProgress } = useScroll();

export default function Home() {
  return (
    <main>
      <div className="container p-12 lg:p-24">
        <div className="mb-24 flex w-full flex-row items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className={`text-2xl font-semibold text-stone-950`}>Leo</h2>
            <p className={`text-sm text-stone-500`}>Software Designer</p>
          </div>
          {/* twitter link */}
          <div className="flex flex-row gap-4">
            <motion.a
              href="https://twitter.com/leosuccarferre"
              target="_blank"
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 1 }}
              className="cursor-pointer rounded-full bg-stone-100 p-3 px-5 dark:bg-stone-800/30"
            >
              Twitter
            </motion.a>

            {/* linkedin link */}
            <motion.a
              href="https://www.linkedin.com/in/leosuccarferre/"
              target="_blank"
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 1 }}
              className="cursor-pointer rounded-full bg-stone-100 p-3 px-5 dark:bg-stone-800/30"
            >
              LinkedIn
            </motion.a>

            {/* link to resume */}
            <motion.a
              href="/Leo-Succar-Ferré-Resume-2023-compressed.pdf"
              target="_blank"
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 1 }}
              className="cursor-pointer self-center rounded-full bg-stone-100 p-3 px-5 dark:bg-stone-800/30"
            >
              <TbFileText title="Resume" className="h-5 w-5 stroke-stone-600" />
            </motion.a>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4 lg:col-span-3 ">
            <div className="mb-24 flex flex-col gap-4">
              <motion.div
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 1 }}
                className="flex aspect-square flex-row items-center gap-4 overflow-auto rounded-3xl bg-stone-100 p-6 dark:border-stone-700 dark:bg-stone-800/30 lg:p-8"
              >
                {[
                  ["1", "/starterkit-2023-1.png", "Plasmic StarterKit"],
                  ["2", "/starterkit-2023-2.png", "Plasmic StarterKit"],
                  ["3", "/starterkit-2023-3.png", "Plasmic StarterKit"],
                  ["4", "/starterkit-2023-4.png", "Plasmic StarterKit"],
                  ["5", "/starterkit-2023-5.png", "Plasmic StarterKit"],
                ].map(([id, file, alt]) => (
                  <Image
                    key={id}
                    className="rounded"
                    src={file}
                    alt={alt}
                    width="800"
                    height="600"
                    objectFit="contain"
                    priority
                  />
                ))}
              </motion.div>
              <div className="flex flex-row items-center gap-3">
                <div className="rounded-full bg-stone-100 p-3 dark:bg-stone-800/30">
                  <TbPaint
                    title="Visual Design"
                    className="h-5 w-5 stroke-stone-600"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-stone-950">
                    StarterKit{" "}
                  </h2>
                  <p className="text-sm text-stone-500">Plasmic, 2023</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 lg:col-span-3 ">
            <div className="mb-24 flex flex-col gap-4">
              <motion.div
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 1 }}
                className="flex aspect-square flex-row items-center justify-center gap-4 overflow-auto rounded-3xl bg-stone-100 p-6 dark:border-stone-700 dark:bg-stone-800/30 lg:p-8"
              >
                {[["1", "/field-states-2021.png", "Plasmic Field States"]].map(
                  ([id, file, name]) => (
                    <Image
                      key={id}
                      className="rounded"
                      src={file}
                      alt={name}
                      width="800"
                      height="600"
                    />
                  ),
                )}
              </motion.div>

              <div className="flex flex-row items-center gap-3">
                <div className="rounded-full bg-stone-100 p-3 dark:bg-stone-800/30">
                  <TbBinaryTree
                    title="Visual Design"
                    className="h-5 w-5 self-center stroke-stone-600"
                  />
                </div>

                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-stone-950">
                    Field States
                  </h2>

                  <p className="text-sm text-stone-500">Plasmic, 2021</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 lg:col-span-3 ">
            <div className="mb-24 flex flex-col gap-4">
              <motion.div
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 1 }}
                className="flex aspect-square flex-row items-center justify-center gap-4 overflow-auto rounded-3xl bg-stone-100 p-6 dark:border-stone-700 dark:bg-stone-800/30 lg:p-8"
              >
                {[
                  ["1", "/variants-exploration-2021.png", "Variants Panel"],
                ].map(([id, file, name]) => (
                  <Image
                    key={id}
                    className="rounded"
                    src={file}
                    alt={name}
                    width="800"
                    height="600"
                  />
                ))}
              </motion.div>

              <div className="flex flex-row items-center gap-3">
                <div className="rounded-full bg-stone-100 p-3 dark:bg-stone-800/30">
                  <TbBinaryTree
                    title="Visual Design"
                    className="h-5 w-5 self-center stroke-stone-600"
                  />
                </div>

                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-stone-950">
                    Variants Panel
                  </h2>

                  <p className="text-sm text-stone-500">Plasmic, 2021</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 lg:col-span-3 ">
            <div className="mb-24 flex flex-col gap-4">
              <motion.div
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 1 }}
                className="flex aspect-square flex-row items-center justify-center gap-4 overflow-auto rounded-3xl bg-stone-100 p-6 dark:border-stone-700 dark:bg-stone-800/30 lg:p-8"
              >
                {[
                  [
                    "1",
                    "/chrome-wireframe-2023.png",
                    "Plasmic Chrome Wireframe",
                  ],
                ].map(([id, file, name]) => (
                  <Image
                    key={id}
                    className="rounded"
                    src={file}
                    alt={name}
                    width="800"
                    height="600"
                    objectFit="contain"
                    priority
                  />
                ))}
              </motion.div>

              <div className="flex flex-row items-center gap-3">
                <div className="rounded-full bg-stone-100 p-3 dark:bg-stone-800/30">
                  <TbBinaryTree
                    title="Visual Design"
                    className="h-5 w-5 self-center stroke-stone-600"
                  />
                </div>

                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-stone-950">
                    Chrome Wireframe
                  </h2>

                  <p className="text-sm text-stone-500">Plasmic, 2023</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 lg:col-span-3 ">
            <div className="mb-24 flex flex-col gap-4">
              <motion.div
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 1 }}
                className="flex aspect-square flex-row items-center gap-4 overflow-auto rounded-3xl bg-[url(/ventura-13-large.jpeg)] bg-cover p-8 dark:border-stone-700 dark:bg-stone-800/30 lg:p-8"
              >
                {[
                  ["1", "/insert-menu-2023.png", "Variants Panel"],
                  ["2", "/copilot-2023-1.png", "Plasmic Copilot"],
                  ["3", "/copilot-2023-2.png", "Plasmic Copilot"],
                  ["4", "/copilot-2023-3.png", "Plasmic Copilot"],
                  ["5", "/dashboard-2023-1.png", "Plasmic Dashboard"],
                  ["6", "/dashboard-2023-2.png", "Plasmic Dashboard"],
                  ["7", "/dashboard-2023-3.png", "Plasmic Dashboard"],
                  ["8", "/dashboard-2023-4.png", "Plasmic Dashboard"],
                ].map(([id, file, alt]) => (
                  <Image
                    key={id}
                    className="rounded"
                    src={file}
                    alt={alt}
                    width="800"
                    height="600"
                    objectFit="contain"
                    priority
                  />
                ))}
              </motion.div>
              <div className="flex flex-row items-center gap-3">
                <div className="rounded-full bg-stone-100 p-3 dark:bg-stone-800/30">
                  <TbPaint
                    title="Visual Design"
                    className="h-5 w-5 self-center stroke-stone-600"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-stone-950">
                    Insert Menu, AI Copilot, Dashboard, Workspaces, Settings
                  </h2>
                  <p className="text-sm text-stone-500">Plasmic, 2023</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 lg:col-span-3 ">
            <div className="mb-24 flex flex-col gap-4">
              <motion.div
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 1 }}
                className="flex aspect-square flex-row items-center justify-center gap-4 overflow-auto rounded-3xl bg-stone-100 p-6 dark:border-stone-700 dark:bg-stone-800/30 lg:p-8"
              >
                {[["1", "/diagrams-2022.png", "Plasmic Chrome Wireframe"]].map(
                  ([id, file, name]) => (
                    <Image
                      key={id}
                      className="rounded"
                      src={file}
                      alt={name}
                      width="800"
                      height="600"
                    />
                  ),
                )}
              </motion.div>

              <div className="flex flex-row items-center gap-3">
                <div className="rounded-full bg-stone-100 p-3 dark:bg-stone-800/30">
                  <TbBinaryTree
                    title="Visual Design"
                    className="h-5 w-5 self-center stroke-stone-600"
                  />
                </div>

                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-stone-950">
                    Diagrams
                  </h2>

                  <p className="text-sm text-stone-500">Plasmic, 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
