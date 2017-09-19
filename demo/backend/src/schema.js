import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from 'graphql';

import {getNoteByQuery} from "./dbUtils";

const NoteType = new GraphQLObjectType({
    name: 'Note',
    description: 'The actual note',
    fields: () => ({
        title: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        }
    })
});

// const TagType = new GraphQLObjectType({
//     name: 'Tag',
//     description: 'A certain category of notes',
//     fields: () => ({
//         tag: {
//             type: GraphQLString,
//         }
//     })
// });

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: '...',
    fields: () => ({
        note: {
            type: NoteType,
            args: {
                tagQuery: {type: GraphQLString}
            },
            resolve: (root, args) => {return getNoteByQuery(args.tagQuery)}
        }
    })

})

export default new GraphQLSchema({
    query: QueryType
})

