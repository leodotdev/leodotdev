import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {visionTool} from '@sanity/vision';
import project from './sanity/schemas/project-schema';
import book from './sanity/schemas/book-schema';

const config = defineConfig({
    projectId: "jyqe7nab",
    dataset: "production",
    title: "leo.dev",
    apiVersion: "2023-10-07",
    basePath: "/studio",
    plugins: [structureTool(), visionTool()],
    schema: { types:[project, book] }
})

export default config;