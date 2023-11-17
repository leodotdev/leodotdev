import { Project } from "@/types/Project";
import { createClient, groq } from "next-sanity";

export async function getProjects(): Promise<Project[]> {
    const client = createClient({
        projectId: "jyqe7nab",
        dataset: "production",
        apiVersion: "2023-10-07",
    });
    return client.fetch(
        groq`*[_type == "project"]| order(year desc) {
            _id,
            _createdAt,
            name,
            client,
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