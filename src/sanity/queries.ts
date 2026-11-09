// GROQ for the site's reads. Plain strings; the server functions in
// src/server/content.ts run them against Sanity's API CDN.

const PROJECT_FIELDS = `
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
`

export const PROJECTS = `*[_type == "project"] | order(year desc) {${PROJECT_FIELDS}}`

export const EXPERIENCES = `*[_type == "experience"] | order(order asc) {
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

export const REFERENCES = `*[_type == "reference"] | order(order asc) {
  _id,
  order,
  name,
  title,
  company,
  linkedinUrl,
  initials,
  quote
}`
