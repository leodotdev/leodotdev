const book = {
    name: 'book',
    title : 'Books',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type:'string'
        },
        {
            name: 'author',
            title: 'Author',
            type:'string'
        },
        {
            name: 'year',
            title: 'Year Read',
            type:'string'
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
            title: 'Year Read, Newest First',
            by: [{field: 'year', direction: 'asc'}],
        }
    ]
}

export default book;