const numberToMonth = (num) => {
    num = parseInt(num, 10)
    if (num === 1){
        return "January"
    }
    if (num === 2){
        return "February"
    }
    if (num === 3){
        return "March"
    }
    if (num === 4){
        return "April"
    }
    if (num === 5){
        return "May"
    }
    if (num === 6){
        return "June"
    }
    if (num === 7){
        return "July"
    }
    if (num === 8){
        return "August"
    }
    if (num === 9){
        return "September"
    }
    if (num === 10){
        return "October"
    }
    if (num === 11){
        return "November"
    }
    if (num === 12){
        return "December"
    }
}

export default numberToMonth