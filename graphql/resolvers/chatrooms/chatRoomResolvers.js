import GraphQLJSON from 'graphql-type-json';


// CHATROOM MUTATIONS
import sendMessage from './mutations/sendMessage.js';
import createChatRoom from './mutations/createChatRoom.js';

// CHATROOM QUERIES
import getUserChatRooms from './queries/getUserChatRooms.js';
import getChatFromId from './queries/getChatFromId.js';

export default {
    Query: {
        // CHATROOM QUERIES
        ...getUserChatRooms.Query,
        ...getChatFromId.Query,
    },
    Mutation: {
        // CHATROOM MUTATIONS
        ...sendMessage.Mutation,
        ...createChatRoom.Mutation,
        
    },
    JSON: GraphQLJSON,
}