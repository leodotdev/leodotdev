import { PortableTextBlock } from "sanity";

export type Book = {
    _id: string;
    _createdAt: string;
    name: string;
    author: string;
    year: string;
    slug: string;
    image: string;
    content: PortableTextBlock[];
}