// export const backEndUrl = "http://localhost:8000";
export const backEndUrl = "https://tyfwt-vision.website";


/**
 * render image direction
 */
export const renderImageDir = (path = "") => {
    if (path !== "") {
        
        if (path.startsWith("/storage/uploads")) {
            return backEndUrl + path;
        } else {
            return backEndUrl+"/assets/uploads/products/"+path;
        }
    }

    return "";
}
