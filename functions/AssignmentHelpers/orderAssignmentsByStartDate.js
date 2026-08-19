let i = 0

export default function orderAssignmentsByStartDate(array){
    let ordered = array.sort(compareDatesDescending);
    return ordered
}

const compareDatesDescending = (a, b) => {
    try{
        const dateA = new Date(a.dateStart);
        const dateB = new Date(b.dateStart);
        i = i + 1
        return dateB - dateA;
    }
    catch(error){
        i = i + 1
        return null
    }
};
