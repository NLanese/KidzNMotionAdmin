const numToDayOfTheWeek = (num) => {
    if (num === 1){
        return "MONDAY"
    }
    else if (num === 2){
        return "TUESDAY"
    }
    else if (num === 3){
        return "WEDNESDAY"
    }
    else if (num === 4){
        return "THURSDAY"
    }
    else if (num === 5){
        return "FRIDAY"
    }
    else if (num === 6){
        return "SATURDAY"
    }
    else if (num === 0){
        return "SUNDAY"
    }
}

export default numToDayOfTheWeek