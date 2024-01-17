import { ImportOutlined } from '@ant-design/icons';
import GraphQLJSON from 'graphql-type-json';

import getAllMedalTypes from './queries/getAllMedalTypes.js';
import getAllUserMedals from './queries/getAllUserMedals.js';

export default {
    Query: {
        ...getAllMedalTypes.Query,
        ...getAllUserMedals.Query
    },
    Mutation: {

    },
    JSON: GraphQLJSON,
}