import prisma from "@utils/prismaDB"

const allVideos = await prisma.video.findMany;

export default async function createParentAndChild(
    email, encryptedPassword, username,
    role, title, phoneNumber, firstName, lastName,
    organizationInviteKey, solo
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
    return{
        child: childUser,
        guardian: baseUser
    }
}