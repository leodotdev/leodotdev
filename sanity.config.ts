import {defineConfig} from 'sanity';
import {deskTool} from 'sanity/desk';
import {visionTool} from '@sanity/vision';
import project from './sanity/schemas/project-schema';

const config = defineConfig({
    projectId: "jyqe7nab",
    dataset: "production",
    title: "leo.dev",
    apiVersion: "2023-10-07",
    basePath: "/admin",
    plugins: [deskTool(), visionTool()],
    schema: { types:[project] }
})

export default config;