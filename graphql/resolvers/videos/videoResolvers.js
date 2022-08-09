import { ImportOutlined } from '@ant-design/icons';
import GraphQLJSON from 'graphql-type-json';

import addVideo from './kingAddVideo';

export default {
    Query: {

    },
    Mutation: {
        ...addVideo
    },
    JSON: GraphQLJSON,
}