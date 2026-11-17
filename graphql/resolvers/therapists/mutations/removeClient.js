/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";

// A therapist stops working with a client. Nothing is deleted: the family's
// accounts, medals, assignments and notes stay, and the child shows up again
// under "Waiting for a therapist" so someone in the organization can take
// them on. (deletePatient, by contrast, deletes the child and parent accounts.)
export default {
  Mutation: {
    removeClient: async (_, { childCarePlanID }, context) => {
      if (!context.user) throw new UserInputError("Login required");
      if (context.user.role !== "THERAPIST")
        throw new UserInputError("Only therapists can remove clients");

      const plan = await prisma.childCarePlan.findUnique({
        where: { id: childCarePlanID },
        select: { id: true, therapistId: true, childId: true },
      });
      if (!plan) throw new UserInputError("Client not found");
      if (plan.therapistId !== context.user.id) throw new UserInputError("Access denied");

      await prisma.childCarePlan.update({
        where: { id: plan.id },
        data: { therapist: { disconnect: true } },
      });

      // Their per-client mute switches were this therapist's choice; reset them.
      if (plan.childId) {
        await prisma.user.update({
          where: { id: plan.childId },
          data: { messagesMuted: false, assignMuted: false },
        });
      }
      return true;
    },
  },
};
