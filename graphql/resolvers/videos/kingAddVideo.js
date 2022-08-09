/* eslint-disable import/no-anonymous-default-export */
import dotenv from "dotenv";
import prisma from "@utils/prismaDB";

dotenv.config();

export default {
    Mutation: {
        addVideo: async (_, {
            contentfulID,
            previewPic,
            title,
            description,
            kingWillySecret
        }) => {

            // Authorization
            if (process.env.KING_WILLY_SECRET !== kingWillySecret){
                throw new Error ("Error: Unauthorized Access Attempted! Only Kidz-N-Motion Agents can add Videos to the Database. If you believe this is you, please contact nick@kingwillystudios.com")
            }

            console.log("Create?")

            // Creates The Video
            try{
                return await prisma.video.create({
                    data: {
                        contentfulID: contentfulID,
                        previewPic: previewPic,
                        title: title,
                        description: description,
                    }
                }).catch(err){
                    console.log(err)
                }
            } catch(err){
                console.log(err)
            }
            
        }
    }
}