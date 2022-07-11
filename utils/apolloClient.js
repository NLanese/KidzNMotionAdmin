import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createHttpLink } from "apollo-link-http";

const httpLink = createHttpLink({
    uri: process.env.GRAPHQL_URL,
  });

  
  // Auth for token
const authLink = setContext((_, { headers }) => {
    let token = localStorage.getItem("token");
    return {
      headers: {
        ...headers,
        authorization: token,
      },
    };
  });

// Initialize Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  fetchPolicy: 'network-only'
});

export default client;