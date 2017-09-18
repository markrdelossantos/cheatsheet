import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from 'graphql';

const dummyTags = {
    0: {tag: "docker"},
    1:  {tag: "rain"}
}

const dummyData = {
    0: {
        tag: [0,1],
        title: "how to Life",
        body: "Resign"
    },
    1: {
        tag: [1],
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
            type: new GraphQLList(GraphQLString),
            resolve: note => note.tag.map(idx => dummyTags[idx].tag)
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
            resolve: (root, args) => {
                const fkPromise = new Promise((resolve)=>{   
                    setTimeout(()=> resolve(), 5000);
                });
                return fkPromise.then(()=>{return dummyData[args.id]});
            }
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

