import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean
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

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: '...',
    fields: () => ({
        note: {
            type: new GraphQLList(NoteType),
            args: {
                tagQuery: {type: new GraphQLList(GraphQLString)},
                operation: {type: GraphQLString},
                user: {type: GraphQLString}, // TODO should be context
                includePublic: {type: GraphQLBoolean},
            },
            resolve: (root, args, ctx) => {
                return getNoteByQuery(args.tagQuery, args.operation, args.user, args.includePublic);
            }
        }
    })
})

export default new GraphQLSchema({
    query: QueryType
})

