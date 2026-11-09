import type { PortableTextBlock } from "@portabletext/types";

export type Project = {
    _id: string;
    _createdAt: string;
    name: string;
    client: string;
    year: string;
    slug: string;
    image?: string;
    embed?: string;
    categories?: string[];
    description?: string;
    content?: PortableTextBlock[];
}