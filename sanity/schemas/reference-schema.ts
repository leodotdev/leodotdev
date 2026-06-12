const reference = {
    name: 'reference',
    title: 'References',
    type: 'document',
    fields: [
        {
            name: 'order',
            title: 'Order',
            type: 'number'
        },
        {
            name: 'name',
            title: 'Name',
            type: 'string'
        },
        {
            name: 'title',
            title: 'Title',
            type: 'string'
        },
        {
            name: 'company',
            title: 'Company',
            type: 'string'
        },
        {
            name: 'linkedinUrl',
            title: 'LinkedIn URL',
            type: 'url'
        },
        {
            name: 'initials',
            title: 'Initials',
            type: 'string'
        },
        {
            name: 'quote',
            title: 'Quote',
            type: 'text',
            rows: 4
        }
    ],
    orderings: [
        {
            name: 'orderAsc',
            title: 'Order, Ascending',
            by: [{ field: 'order', direction: 'asc' }]
        }
    ]
}

export default reference;
