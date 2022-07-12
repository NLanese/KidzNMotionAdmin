import GraphQLJSON from 'graphql-type-json';

// USER QUERIES
import getUserChatRooms from './queries/getUserChatRooms.js';

export default {
    Query: {
        // USER QUERIES
        ...getUserChatRooms.Query,
    },
    JSON: GraphQLJSON,
}