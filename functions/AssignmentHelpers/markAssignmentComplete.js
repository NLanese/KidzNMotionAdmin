export default function markAssignmentComplete(assignment, prisma){
    await prisma.assignment.update({
                where: {
                  id: assignment.id
                },
                data: {
                  completed: true
                }
              })
}