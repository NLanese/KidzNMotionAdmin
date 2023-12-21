
// Goes through every value in an Object, running the callback function on them, and returning the updated object
export function mapObjectKeys(obj, callback){
    let keys = Object.keys(obj)
    return keys.map( (key, i) => {
        return (callback(obj[key], key, i))
    })
}

// Goes through every value in an Object, running the callback function on them, returning the original object
export function forEachObjectKeys(obj, callback){
    let keys = Object.keys(obj)
    keys.forEach( (key, i) => {
        (callback(obj[key], key, i))
    })
}

// Filters through every value in an Object, running the callback function on them, and returning the objects that pass through the function as true
export function filterObjectKeys(obj, condition, callback=(obj, key, i) => {return obj}){
    let keys = Object.keys(obj)
    return keys.map( (key, i) => {
        if (condition(obj[key], key)){
            return (callback(obj[key], key, i))
        }
    })
}