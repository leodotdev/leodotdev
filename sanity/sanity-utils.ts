import { Project } from "@/types/Project";
import { Book } from "@/types/Book";
import { createClient, groq } from "next-sanity";

export async function getProjects(): Promise<Project[]> {
    const client = createClient({
        projectId: "jyqe7nab",
        dataset: "production",
        apiVersion: "2023-10-07",
        useCdn: true,
    });
    return client.fetch(
        groq`*[_type == "project"]| order(year desc) {
            _id,
            _createdAt,
            name,
            client,
            year,
            categories,
            description,
            "slug": slug.current,
            "image": image.asset->url,
            url,
            embed,
            content[]{
                ...,
                _type == "image" => {
                  ...,  
                  asset->
                }
              }
        }`
    )
    
}

export async function getProject(slug: string): Promise<Project> {
    const client = createClient({
        projectId: "jyqe7nab",
        dataset: "production",
        apiVersion: "2023-10-07",
        useCdn: true,
    });
    return client.fetch(
        groq`*[_type == "project" && slug.current == $slug][0]{
            _id,
            _createdAt,
            name,
            client,
            year,
            categories,
            description,
            "slug": slug.current,
            "image": image.asset->url,
            url,
            embed,
            content[]{
                ...,
                _type == "image" => {
                  ...,  
                  asset->
                }
              }
        }`,
        { slug }
    )
}

export async function getBooks(): Promise<Book[]> {
    const client = createClient({
        projectId: "jyqe7nab",
        dataset: "production",
        apiVersion: "2023-10-07",
        useCdn: true,
    });
    return client.fetch(
        groq`*[_type == "book"]| order(year desc) {
            _id,
            _createdAt,
            name,
            author,
            year,
            "slug": slug.current,
            "image": image.asset->url,
            url,
            embed,
            content[]{
                ...,
                _type == "image" => {
                  ...,  
                  asset->
                }
              }
        }`
    )
    
}