import prisma from "@utils/prismaDB"

const allVideos = await prisma.video.findMany;

export default async function createParentAndChild(
    email, encryptedPassword, username,
    role, title, phoneNumber, firstName, lastName,
    solo
){
    // Create Guardianm
    let baseUser = await prisma.user.create({
        data: {
        email: email,
        password: encryptedPassword,
        username: username,
        role: role,
        title: title,
        phoneNumber: phoneNumber,
        firstName: firstName,
        lastName: lastName,
        soloSubscriptionStatus: "Active",
        solo: solo,
        },
    });

    // Create the child for the guardian account
    let childUser = await prisma.user.create({
        data: {
          email: makeRandomString(60) + "@kidz-n-motion.com",
          password: makeRandomString(60),
          role: "CHILD",
          firstName: childFirstName,
          lastName: childLastName,
          childDateOfBirth: childDateOfBirth,
          guardian: {
            connect: {
              id: baseUser.id,
            },
          },
        },
    });

    // Creates a Child Care Plan
    await prisma.childCarePlan.create({
        data: {
          child: {
            connect: {
              id: childUser.id,
            },
          },
        }
    })

    // Finds Full Child Object with Care Plan
    childUser = await prisma.user.findUnique({
        where: {
            id: childUser.id
        },
        data: {
            id: true,
            childCarePlans: {
                select: {
                    id: true
                }
            } 
        }
    })

    return{
        child: childUser,
        guardian: baseUser
    }
}