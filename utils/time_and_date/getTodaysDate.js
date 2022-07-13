import numberToMonth from "./numberIntoMonth.js";
import numToDayOfTheWeek from "./numToDayOfWeek.js";

const getTodaysDate = (daysAdded=0) => {
    var today = new Date();
    today.setDate(today.getDate() + daysAdded)
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 01
    var yyyy = today.getFullYear().toString();

    let nameDate = new Date(`${numberToMonth(mm)} ${dd}, ${yyyy}`)

    let dayOfWeek = numToDayOfTheWeek(nameDate.getDay())
    
    today = mm + '/' + dd + '/' + yyyy;
    return {
        date: today, 
        day: dd, 
        month: mm, 
        year: yyyy.slice(2), 
        dayOfWeek: dayOfWeek
    }
 
}

export default getTodaysDate