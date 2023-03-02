import { UserInputError } from "apollo-server-errors";
import { getUserObject } from "@helpers/api/auth";
import { ConsoleSqlOutlined } from "@ant-design/icons";

export default {
  Query: {
    getUser: async (_, {}, context) => {

      // console.log("GET_USER CONTEXT ::: ", context)

      /////////////////
      // LOGIN CHECK //
      if (!context.user) throw new UserInputError("Login required");

      //////////////////////////
      // SELECTS VALID FIELDS //
      let userObject = await getUserObject(context.user);

      ///////////////////////////////
      // SUBSCRIPTION STATUS CHECK //
      let subscriptionStatus;
      let daysLeft;

             // IF //
      // Organization Owner //
      if (userObject.ownedOrganization) {

                // IF //
        //  No Subscription ID (no Payment) //
        if (!userObject.ownedOrganization.stripeSubscriptionID) {

          // Days since Org.CreateAt
          daysLeft = parseInt(
            8 -
              (new Date().getTime() -
                new Date(userObject.ownedOrganization.createdAt).getTime()) /
                (1000 * 3600 * 24)
          )

          if (daysLeft <= 0) {
            subscriptionStatus = "expiredOwner";
          } 
          else {
            subscriptionStatus = "trial";
          }

        } 
        
            // IF //
        //  No Subscription ID (no Payment) //
        else {
          subscriptionStatus = "active";
        }

      } 
      
             // IF //
      // Guardian User //      
      else if (userObject.role === "GUARDIAN") {

          // IF //
        // User Paid //
        if (userObject.soloStripeSubscriptionID) {
          subscriptionStatus = "active";
        } 

              // IF //
        // User Did not Pay //
        else {
          daysLeft = parseInt(
            0 -
              (new Date().getTime() -
                new Date(userObject.createdAt).getTime()) /
                (1000 * 3600 * 24)
          );
          if (daysLeft <= 0) {
            console.log("Expired USer")
            subscriptionStatus = "expiredOwner";
          } else {
            console.log("Trial Guardian")
            subscriptionStatus = "trial";
          }
        }
      } 
      
             // IF //
      // Therapist User //
      else {
        if (userObject.organizations) {
          if (userObject.organizations[0]) {
            const organization = userObject.organizations[0].organization;

            if (!organization.stripeSubscriptionID) {
              daysLeft = parseInt(
                8 -
                  (new Date().getTime() -
                    new Date(organization.createdAt).getTime()) /
                    (1000 * 3600 * 24)
              );
              console.log(daysLeft);
              if (daysLeft <= 0) {
                subscriptionStatus = "expiredNotOwner";
              } else {
                subscriptionStatus = "trial";
              }
            } else {
              subscriptionStatus = "active";
            }
          }
        }
      }

      userObject.subscriptionStatus = subscriptionStatus;

      return userObject;
    },
  },
};
