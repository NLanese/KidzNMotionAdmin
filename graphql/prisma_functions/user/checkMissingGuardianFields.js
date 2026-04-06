export default function findMissingGuardianFields(childFirstName, childLastName, childDateOfBirth){
    var missingFields = ""
    if (!childFirstName) {
        missingFields += "childFirstName, ";
    }
    if (!childLastName) {
        missingFields += "childLastName, ";
    }
    if (!childDateOfBirth) {
        missingFields += "childDateOfBirth, ";
    }
    return missingFields
}