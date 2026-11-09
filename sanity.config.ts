import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {visionTool} from '@sanity/vision';
import project from './src/sanity/schemas/project-schema';
import book from './src/sanity/schemas/book-schema';
import experience from './src/sanity/schemas/experience-schema';
import reference from './src/sanity/schemas/reference-schema';

const config = defineConfig({
    projectId: "jyqe7nab",
    dataset: "production",
    title: "leo.dev",
    apiVersion: "2023-10-07",
    plugins: [structureTool(), visionTool()],
    schema: { types:[project, book, experience, reference] }
})

export default config;