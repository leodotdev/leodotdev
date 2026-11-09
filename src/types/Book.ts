import type { PortableTextBlock } from "@portabletext/types";

export type Book = {
    _id: string;
    _createdAt: string;
    name: string;
    author: string;
    year: string;
    slug: string;
    image: string;
    url?: string;
    content: PortableTextBlock[];
}