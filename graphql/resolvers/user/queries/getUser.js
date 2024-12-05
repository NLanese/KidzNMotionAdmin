import { UserInputError } from "apollo-server-errors";
import { getUserObject } from "@helpers/api/auth";
import { ConsoleSqlOutlined } from "@ant-design/icons";

export default {
  Query: {
    getUser: async (_, {}, context) => {

      /////////////////
      // LOGIN CHECK //
      if (!context.user) throw new UserInputError("Login required");


      /////////////////////////////
      // SELECTS ALL USER FIELDS //
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
            // subscriptionStatus = "expiredOwner";
            subscriptionStatus = "active"
          } 
          else {
            subscriptionStatus = "trial";
          }
        } 
        
        // IF //
        //  Yes Subscription ID (Yes Payment) //
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

        
        let orgStatus = userObject.organizations ? userObject.organizations.length > 0 ? userObject.organizations[0].organization : false: false
        console.log(orgStatus)
        
        // IF //
        // User is NOT SOLO //
        if (orgStatus) {
          if (userObject.organizations[0].organization.stripeSubscriptionID){
            subscriptionStatus = "active"
          }
          else{
            daysLeft = parseInt(
              8 -
                (new Date().getTime() -
                  new Date(userObject.organizations[0].organization.createdAt).getTime()) /
                  (1000 * 3600 * 24)
            )
            if (daysLeft <= 0) {
              // subscriptionStatus = "expiredOwner";
              subscriptionStatus = "active"
            } 
            // else {
            //   subscriptionStatus = "org_trial";
            // }
          }
        }

        // IF //
        // User is SOLO USER // 
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


      userObject.subscriptionStatus = subscriptionStatus;

      return userObject;
    },
  },
};

