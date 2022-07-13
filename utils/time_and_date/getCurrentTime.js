

const fixOver12 = (num) => {
    if (num > 12){
        return parseInt(num, 10) - 12
    }
    else return num
}

const am_pm = (num) => {
    if (num > 12){
        return "PM"
    }
    else{
        return "AM"
    }
}

const getCurrentTime = () => {
    var today = new Date();
    var time = fixOver12(today.getHours()) + ":" + today.getMinutes() + am_pm(today.getHours())
    return time
}

export default getCurrentTime