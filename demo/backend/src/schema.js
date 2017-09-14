import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from 'graphql';

const dummyTags = {
    0: "docker",
    1:  "rain"
}

const dummyData = {
    0: {
        tag: [dummyTags[0], dummyTags[1]],
        title: "how to Life",
        body: "Resign"
    },
    1: {
        tag: [dummyTags[1]],
        title: "how to Raise",
        body: "Resign"
    }
}

const NoteType = new GraphQLObjectType({
    name: 'Note',
    description: 'The actual note',
    fields: () => ({
        title: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        tag: {
            type: new GraphQLList(TagType)
        }
    })
});

const TagType = new GraphQLObjectType({
    name: 'Tag',
    description: 'A certain category of notes',
    fields: () => ({
        tag: {
            type: GraphQLString,
        }
    })
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: '...',
    fields: () => ({
        note: {
            type: NoteType,
            args: {
                id: {type: GraphQLString}
            },
            resolve: (root, args) => dummyData[args.id]
        },
        tag: {
            type: TagType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve: (root, args) => dummyTags[args.id]
        }
    })

})

export default new GraphQLSchema({
    query: QueryType
})

