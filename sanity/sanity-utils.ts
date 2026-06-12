import { Project } from "@/types/Project";
import { Book } from "@/types/Book";
import { Experience } from "@/types/Experience";
import { Reference } from "@/types/Reference";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";

export async function getProjects(): Promise<Project[]> {
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

export async function getProject(slug: string): Promise<Project | null> {
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

export async function getExperiences(): Promise<Experience[]> {
    return client.fetch(
        groq`*[_type == "experience"] | order(order asc) {
            _id,
            order,
            logo,
            company,
            companyUrl,
            position,
            location,
            duration,
            displayName,
            altCompany,
            altCompanyUrl,
            team,
            contract,
            project,
            projectUrl,
            projectCompany,
            projectCompanyUrl,
            roundLogo
        }`
    )
}

export async function getReferences(): Promise<Reference[]> {
    return client.fetch(
        groq`*[_type == "reference"] | order(order asc) {
            _id,
            order,
            name,
            title,
            company,
            linkedinUrl,
            initials,
            quote
        }`
    )
}