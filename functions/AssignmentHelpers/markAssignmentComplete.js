import { createNotification } from "@helpers/api/notifications";


export default async function markAssignmentComplete(assignment, prisma, childUser){
    await prisma.assignment.update({
        where: {
            id: assignment.id
        },
        data: {
            completed: true
        }
    })
    createNotification(
        (childUser + " has completed an Assignment"),
        ("The Assignment with " + assignment.videos.length() + " that was assigned ", assignment.dateStart + " has been completed."),
        "MESSAGE",
        childUser.id,
        childUser.id
    )

}