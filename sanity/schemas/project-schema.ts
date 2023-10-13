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
            of: [{type: 'block'}, {type: 'image'}]
        }
    ]
}

export default project;