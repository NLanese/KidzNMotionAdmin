import { ImportOutlined } from '@ant-design/icons';
import GraphQLJSON from 'graphql-type-json';

import getAllVideoFiles from './queries/getAllVideoFiles.js';

export default {
    Query: {
        ...getAllVideoFiles.Query,
    },
    Mutation: {

    },
    JSON: GraphQLJSON,
}