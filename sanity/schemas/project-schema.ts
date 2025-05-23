const project = {
    name: 'project',
    title : 'Projects',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type:'string'
        },
        {
            name: 'client',
            title: 'Client',
            type:'string'
        },
        {
            name: 'year',
            title: 'Year',
            type:'string'
        },
        {
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{type: 'string'}],
            options: {
                list: [
                    {title: 'Product Design', value: 'product-design'},
                    {title: 'Visual Design', value: 'visual-design'},
                    {title: 'Prototyping', value: 'prototyping'},
                    {title: 'Ideating & Wireframing', value: 'ideating-wireframing'},
                    {title: 'Web Design', value: 'web-design'},
                    {title: 'No-code Web Development', value: 'web-development'},
                    {title: 'Graphic Design', value: 'graphic-design'},
                    {title: 'Design System', value: 'design-system'}
                ]
            }
        },
        {
            name: 'slug',
            title: 'Slug',
            type:'slug',
            options: {
                source: 'name',
                maxLength: 96
            }
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            fields: [
                {
                    name: 'alt',
                    title: 'Alt',
                    type: 'string'
                }
            ]
        },
        {
            name: 'embed',
            title: 'Embed',
            type:'url'
        },
        {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [
                {
                  type: 'block'
                },
                // this is our first custom block which will make it possible to add block images with alt text fields into your portable text
                {
                  type: 'image',
                  asset: {
                    type: 'reference',
                  },
                    fields: [
                      {
                        name: 'alt',
                        type: 'string',
                        title: 'Alternative text',
                        description: 'Important for SEO and accessiblity.',
                          options: {
                            isHighlighted: true,
                        },
                      },
                    ],
                }
              ]
        }
    ],
    orderings: [
        {
            name: 'yearDesc',
            title: 'Year, Newest First',
            by: [{field: 'year', direction: 'asc'}],
        }
    ]
}

export default project;