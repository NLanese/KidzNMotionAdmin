import { UserInputError } from "apollo-server-errors";
import AVATAR_PIECES from "@constants/avatarPieces";
import prisma from "@utils/prismaDB";

export default {
  Query: {
    getUserAvatarPieces: async (_, { childID }, context) => {
      // Can take in a logged in child or a user id of a child
      if (!context.user) throw new UserInputError("Login required");

      if (context.user.role !== "CHILD" && !childID)
        throw new UserInputError(
          "Only children can access avatar pieces, or pass in a child ID"
        );

      // Assign an interum child user to hold the logged in user, if an id is passed, this object will be overwritten
      let childUser = context.user;

      if (childID) {
        // Find the child based on the ID to ensure that a child is being request
        let searchedChildUser = await prisma.user.findUnique({
          where: {
            id: childID,
          },
          select: {
            guardianId: true,
            id: true,
            role: true,
            unlockedAvatarPieces: true,
          },
        });

        // If they are not, then return user input error
        if (!searchedChildUser) {
          throw new UserInputError("The child does not exist");
        }
        if (searchedChildUser.role !== "CHILD") {
          throw new UserInputError("The user being accessed is not a child");
        }

        childUser = searchedChildUser;
      } else {
        // If no child id is passed and the user is achild, then get all of their unlocked avatar pieces
        childUser = await prisma.user.findUnique({
          where: {
            id: context.user.id,
          },
          select: {
            guardianId: true,
            id: true,
            role: true,
            unlockedAvatarPieces: true,
          },
        });
      }

      let avatarPiecesArray = Object.values(AVATAR_PIECES);

      for (var i = 0; i < avatarPiecesArray.length; i++) {
        if (
          childUser.unlockedAvatarPieces &&
          childUser.unlockedAvatarPieces.ids
        ) {
          // Check to see if the piece is unlocked
          if (childUser.unlockedAvatarPieces.ids.includes(avatarPiecesArray[i].id)) {
            avatarPiecesArray[i].unlocked = true;
          } else {
            avatarPiecesArray[i].unlocked = false;
          }
        } else {
          avatarPiecesArray[i].unlocked = false;
        }
      }

      return avatarPiecesArray;
    },
  },
};
