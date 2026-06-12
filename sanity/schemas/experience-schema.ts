const experience = {
    name: 'experience',
    title: 'Experience',
    type: 'document',
    fields: [
        {
            name: 'order',
            title: 'Order',
            type: 'number'
        },
        {
            name: 'logo',
            title: 'Logo',
            type: 'string'
        },
        {
            name: 'company',
            title: 'Company',
            type: 'string'
        },
        {
            name: 'companyUrl',
            title: 'Company URL',
            type: 'url'
        },
        {
            name: 'position',
            title: 'Position',
            type: 'string'
        },
        {
            name: 'location',
            title: 'Location',
            type: 'string'
        },
        {
            name: 'duration',
            title: 'Duration',
            type: 'string'
        },
        {
            name: 'displayName',
            title: 'Display Name',
            type: 'string'
        },
        {
            name: 'altCompany',
            title: 'Alt Company',
            type: 'string'
        },
        {
            name: 'altCompanyUrl',
            title: 'Alt Company URL',
            type: 'url'
        },
        {
            name: 'team',
            title: 'Team',
            type: 'string'
        },
        {
            name: 'contract',
            title: 'Contract',
            type: 'boolean'
        },
        {
            name: 'project',
            title: 'Project',
            type: 'string'
        },
        {
            name: 'projectUrl',
            title: 'Project URL',
            type: 'url'
        },
        {
            name: 'projectCompany',
            title: 'Project Company',
            type: 'string'
        },
        {
            name: 'projectCompanyUrl',
            title: 'Project Company URL',
            type: 'url'
        },
        {
            name: 'roundLogo',
            title: 'Round Logo',
            type: 'boolean'
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

export default experience;
