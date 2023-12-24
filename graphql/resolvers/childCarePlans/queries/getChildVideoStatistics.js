import prisma from "@utils/prismaDB";
import { UserInputError } from "apollo-server-errors";
import VIDEOS from "@constants/videos";

function setVideoStats(videoStats, medalObject, videoObject) {
  var weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  let difference =
    weekAgo.getTime() - new Date(medalObject.createdAt).getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));

  if (TotalDays <= 0) {

    if (
      !videoStats.weekStats.individualVideoDetailedStats[videoObject.contentfulID]
    ) {
      videoStats.weekStats.individualVideoDetailedStats[videoObject.contentfulID] = {
        bronze: 0,
        silver: 0,
        gold: 0
      }
    }
    
    videoStats.weekStats.individualVideoDetailedStats[videoObject.contentfulID][medalObject.level.toLowerCase()] += 1


    if (medalObject.level === "BRONZE") {
      videoStats.weekStats.videoStats.totalVideoPlayThroughs += 1;

      if (
        !videoStats.weekStats.individualVideoStats[videoObject.contentfulID]
      ) {
        videoStats.weekStats.individualVideoStats[videoObject.contentfulID] = 1;
        videoStats.weekStats.videoStats.totalUniqueVideosWatched += 1;
      } else {
        videoStats.weekStats.individualVideoStats[
          videoObject.contentfulID
        ] += 1;
      }
    }

    if (medalObject.level === "GOLD") {


      videoStats.weekStats.medalStats.goldEarned += 1;
    } else if (medalObject.level === "SILVER") {
      videoStats.weekStats.medalStats.silverEarned += 1;
    } else {
      videoStats.weekStats.medalStats.bronzeEarned += 1;
    }


  }

  if (
    !videoStats.allTimeStats.individualVideoDetailedStats[videoObject.contentfulID]
  ) {
    videoStats.allTimeStats.individualVideoDetailedStats[videoObject.contentfulID] = {
      bronze: 0,
      silver: 0,
      gold: 0
    }
  }
  
  videoStats.allTimeStats.individualVideoDetailedStats[videoObject.contentfulID][medalObject.level.toLowerCase()] += 1



  if (medalObject.level === "BRONZE") {
    videoStats.allTimeStats.videoStats.totalVideoPlayThroughs += 1;

    if (
      !videoStats.allTimeStats.individualVideoStats[videoObject.contentfulID]
    ) {
      videoStats.allTimeStats.individualVideoStats[
        videoObject.contentfulID
      ] = 1;
      videoStats.allTimeStats.videoStats.totalUniqueVideosWatched += 1;
    } else {
      videoStats.allTimeStats.individualVideoStats[
        videoObject.contentfulID
      ] += 1;
    }
  }

  if (medalObject.level === "GOLD") {


    videoStats.allTimeStats.medalStats.goldEarned += 1;
  } else if (medalObject.level === "SILVER") {
    videoStats.allTimeStats.medalStats.silverEarned += 1;
  } else {
    videoStats.allTimeStats.medalStats.bronzeEarned += 1;
  }
  return videoStats;
}

export default {
  Query: {
    getChildVideoStatistics: async (_, { childID }, context) => {
      if (!context.user) throw new UserInputError("Login required");

      // Find the child care plan that we are tyring to edot
      let child = await prisma.user.findUnique({
        where: {
          id: childID,
        },
        select: {
          childCarePlans: {
            where: {
              active: true,
            },
            select: {
              id: true,
              level: true,
              allVideoStatus: true,
              weeklyVideoStatus: true,
              therapist: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              comments: {
                select: {
                  id: true,
                  content: true,
                  createdAt: true,
                  therapist: {
                    select: {
                      id: true,
                    },
                  },
                  videoId: true,
                  assignmentId: true,
                },
              },
              assignments: {
                select: {
                  id: true,
                  createdAt: true,
                  dateStart: true,
                  dateDue: true,
                  seen: true,
                  title: true,
                  description: true,

                  videos: {
                    select: {
                      id: true,
                      contentfulID: true,
                      completed: true,
                      medals: {
                        select: {
                          id: true,
                          image: true,
                          description: true,
                          level: true,
                        },
                      },
                    },
                  },
                },
              },
              therapist: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  title: true,
                  id: true,
                },
              },
            },
          },
          videos: {
            select: {
              id: true,
              contentfulID: true,
              completed: true,
              medals: {
                select: {
                  id: true,
                  createdAt: true,
                  image: true,
                  description: true,
                  level: true,
                },
              },
            },
          },
        },
      });
  
      // If they are not, then return user input error
      if (!child) {
        throw new UserInputError("Child does not exist");
      }

      // Loop through the child care plan assignments to get all the video statistics
      let videoStats = {
        allTimeStats: {
          medalStats: {
            goldEarned: 0,
            silverEarned: 0,
            bronzeEarned: 0,
          },
          videoStats: {
            totalVideoPlayThroughs: 0,
            totalUniqueVideosWatched: 0,
          },

          individualVideoStats: {},
          individualVideoDetailedStats: {},
        },
        weekStats: {
          medalStats: {
            goldEarned: 0,
            silverEarned: 0,
            bronzeEarned: 0,
          },
          videoStats: {
            totalVideoPlayThroughs: 0,
            totalUniqueVideosWatched: 0,
          },

          individualVideoStats: {},
          individualVideoDetailedStats: {},
        },
      };



      child.childCarePlans.map((childCarePlan) => {
        childCarePlan.assignments.map((assignmentObject) => {
          if (assignmentObject.videos) {
            assignmentObject.videos.map((videoObject) => {
              if (videoObject.medals) {
                videoObject.medals.map((medalObject) => {
                  videoStats = setVideoStats(videoStats, medalObject, videoObject)
                });
              }
            });
          }
        });
      });

      child.videos.map((videoObject) => {
        if (videoObject.medals) {
          videoObject.medals.map((medalObject) => {
            videoStats = setVideoStats(videoStats, medalObject, videoObject)
          });
        }
      });

      return videoStats;
    },
  },
};
