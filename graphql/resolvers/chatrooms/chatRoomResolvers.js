import GraphQLJSON from 'graphql-type-json';

// USER QUERIES
import getUserChatRooms from './queries/getUserChatRooms.js';
import getChatFromId from './queries/getChatFromId.js';

export default {
    Query: {
        // USER QUERIES
        ...getUserChatRooms.Query,
        ...getChatFromId.Query,
    },
    JSON: GraphQLJSON,
}