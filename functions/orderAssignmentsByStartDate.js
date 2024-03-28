let i = 0

export default function orderAssignmentsByStartDate(array){
    console.log("SortingThis...")
    console.log(array)
    let ordered = array.sort(compareDatesDescending);
    console.log("Done.")
    console.log(ordered)
    return ordered
}

const compareDatesDescending = (a, b) => {
    console.log("Iteration ", i)
    try{
        console.log("Comparing...")
        const dateA = new Date(a.dateStart);
        const dateB = new Date(b.dateStart);
        console.log(dateA, " --- " , dateB)
        i = i + 1
        return dateB - dateA;
    }
    catch(error){
        console.warn("There was an issue with the date format in this assignment...")
        console.log(dateA, " --- ", dateB)
        i = i + 1
        return null
    }
};
