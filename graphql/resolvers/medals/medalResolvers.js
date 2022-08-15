import { ImportOutlined } from '@ant-design/icons';
import GraphQLJSON from 'graphql-type-json';

import getAllMedals from './queries/getAllMedals.js';

export default {
    Query: {
        ...getAllMedals.Query,
    },
    Mutation: {

    },
    JSON: GraphQLJSON,
}