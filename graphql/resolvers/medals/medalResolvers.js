import { ImportOutlined } from '@ant-design/icons';
import GraphQLJSON from 'graphql-type-json';

import getAllMedalTypes from './queries/getAllMedalTypes.js';

export default {
    Query: {
        ...getAllMedalTypes.Query,
    },
    Mutation: {

    },
    JSON: GraphQLJSON,
}