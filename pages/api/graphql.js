import { ApolloServer } from "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { handleAuth } from "@helpers/api/auth";

import typeDefs from "@graphql/typeDefs";
import resolvers from "@graphql/resolvers";

// Server takes in authorization header and if user, returns user object
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: async ({ req }) => {
    
    // Takes in the athorization token and trys to retreive the user object if valid
    const token = req.headers.authorization;

    // Get the user object from the JWT token
    const user = await handleAuth(token);
    
    // Add the user to the context
    return { user };
  },
});

const startServer = apolloServer.start();
export default async function handler(req, res) {
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
