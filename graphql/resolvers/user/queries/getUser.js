import { UserInputError } from "apollo-server-errors";
import { getUserObject } from "@helpers/api/auth";
import { ConsoleSqlOutlined } from "@ant-design/icons";

export default {
  Query: {
    getUser: async (_, {}, context) => {

      console.log("1")

      /////////////////
      // LOGIN CHECK //
      if (!context.user) throw new UserInputError("Login required");

      console.log("2")


      /////////////////////////////
      // SELECTS ALL USER FIELDS //
      let userObject = await getUserObject(context.user);

      console.log("3")

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
            // subscriptionStatus = "expiredOwner";
            subscriptionStatus = "active"
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

        console.log("3.5")


          // IF //
        // User Paid //
        if (userObject.soloStripeSubscriptionID) {
          subscriptionStatus = "active";
        } 

          // IF //
        // User Did not Pay //
        else {
          daysLeft = parseInt(
            8 -
              (new Date().getTime() -
                new Date(userObject.createdAt).getTime()) /
                (1000 * 3600 * 24)
          );
          if (daysLeft <= 0) {
            // subscriptionStatus = "expiredOwner";
            subscriptionStatus = "active"
          } else {
            subscriptionStatus = "trial";
          }
        }

        console.log("3.8")
        console.log(userObject.organizations)
        
        let orgStatus = userObject.organizations ? userObject.organizations[0].organization.stripeSubscriptionID : false

          // IF //
        // Org Did Not Pay //
        if (orgStatus) {

        }
        else{
          daysLeft = parseInt(
            8 -
              (new Date().getTime() -
                new Date(userObject.createdAt).getTime()) /
                (1000 * 3600 * 24)
          );
          if (daysLeft <= 0) {
            // subscriptionStatus = "expiredNotOwner";
            subscriptionStatus = "active"
          } else {
            subscriptionStatus = "trial - not owner";
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
                // subscriptionStatus = "expiredNotOwner";
                subscriptionStatus = "active"
              } else {
                subscriptionStatus = "trial";
              }
            } else {
              subscriptionStatus = "active";
            }
          }
        }
      }

      console.log("4")


      userObject.subscriptionStatus = subscriptionStatus;

      return userObject;
    },
  },
};
