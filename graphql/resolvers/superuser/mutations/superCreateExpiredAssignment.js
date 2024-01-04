/* eslint-disable import/no-anonymous-default-export */
import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import VIDEOS from "@constants/videos";
var dateFormat = require("dateformat");

export default {
  Mutation: {
    superCreateExpiredAssignment: async (
      _,
      { 
        superUserKey,
      },
      context
    ) => {

    ///////////
    // Const //
    const videoIDs =  ['squat']

    //////////////
    // Security // 
    if (!context.user){
        throw new UserInputError("Login required");
    }
    if ( context.user.email.toLowerCase() !== "nlanese21@gmail.com" ){
        throw new UserInputError("Acccess Denied! Super class actions are restricted to Super Users only.")
    }
    if (superUserKey !== `${process.env.SUPER_USER_SECRET_KEY}`){
        throw new UserInputError("Acccess Denied! Super Key was incorrect.")
    }

      ////////////////////////////////////////
      // Locates Test User (OStrichdevtext) //
      let guardian = await prisma.user.findUnique({
        where: {
          email: 'ostrichdevtest@gmail.com'
        },
        select: {
          id :true,
          child: {
            select: {
              id: true
            }
          }
        }
      })

      let child = await prisma.user.findUnique({
        where: {
          id: guardian.children[0].id
        },
        select: {
          childCarePlans: {
            select :{
              id: true
            }
          }
        }
      })
      let childCarePlan = await prisma.childCarePlan.findUnique({
        where: {
          id: child.childCarePlans[0].id,
        },
        select: {
          id: true,
          child: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              guardian: {
                select: {
                  id: true,
                },
              },
            },
          },
          therapist: {
            select: {
              id: true,
            },
          },
        },
      });

      ///////////////////////////
      // Valid Care Plan Check //
      if (!childCarePlan) {
        throw new UserInputError("Child care plan does not exist");
      }

      ///////////////////////////
      // Valid Care Plan Check //
      if (childCarePlan.therapist.id !== context.user.id) {
        throw new UserInputError("Access denied");
      }

      //////////////////////////
      // Valid Video ID Check //
      let videoValid = true;
      videoIDs.map((videoID) => {
        if (!VIDEOS[videoID]) {
          videoValid = false;
        }
      });
      if (!videoValid) {
        throw new UserInputError(
          "One of your video ids is not a valid contentful ID"
        );
      }


      ////////////////////////
      // Creates Assginment //
      let newAssignment = await prisma.assignment.create({
        data: {
          dateStart: new Date((new Date()).valueOf() - (1000*3600*48)),
          dateDue: new Date((new Date()).valueOf() - (1000*3600*24)),
          title: "Expiration Test",
          description: "This is a test",
          childCarePlan: {
            connect: {
              id: childCarePlanID,
            },
          },
        },
      });
      console.log("Assignment Created")

      ////////////////////////////////////////////////////
      // Creates VIDEO Isnatnce for Each Assigned Video //
      for (var i = 0; i < videoIDs.length; i++) {
        let videoID = videoIDs[i];
        await prisma.video.create({
          data: {
            contentfulID: videoID,
            title: VIDEOS[videoID].title,
            description: "",
            level: VIDEOS[videoID].level,
            assignments: {
              connect: {
                id: newAssignment.id,
              },
            },
          },
        });
      }

      return true;
    },
  },
};
