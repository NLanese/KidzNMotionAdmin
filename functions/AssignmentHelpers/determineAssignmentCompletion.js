export default function determineAssignmentNewlyCompleted(assignment){
    let allDone = true
    if (assignment.complete){
        return false
    }
    assignment.videos.forEach(vid => {
        if (!vid.completed){
            allDone = false;
            return false
        }
    });
    return allDone
}