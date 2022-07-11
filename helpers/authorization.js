import Router from "next/router";

export const checkAuthorization = (userRole, accessLevel) => {
    if (userRole === "MANAGER") {
        if (accessLevel === "OWNER" ) {
            Router.push("/")
        }
    }
}