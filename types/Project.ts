import { PortableTextBlock } from "sanity";

export type Project = {
    _id: string;
    _createdAt: string;
    name: string;
    client: string;
    year: string;
    slug: string;
    image: string;
    embed: string;
    categories?: string[];
    content: PortableTextBlock[];
}