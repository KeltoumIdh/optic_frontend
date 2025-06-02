// export const backEndUrl = "http://localhost:8000";
export const backEndUrl = "https://tyfwt-vision.website";

/**
 * render image direction
 * @param {string} path - Image path
 * @param {string} context - Optional context like 'client' or 'product' to determine folder
 */
export const renderImageDir = (path = "", context = "") => {
  if (!path) return "";

  // If the path already starts with http or https, return it as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // If path starts with /storage/ format (new format)
  if (path.startsWith("/storage/")) {
    return backEndUrl + path;
  }

  // For legacy paths that might still be in the old format
  if (path.startsWith("/assets/")) {
    return backEndUrl + path;
  }

  // For cases where just the filename is stored
  if (path === "default.jpg") {
    // If context is client, use client folder
    if (context === "client") {
      return backEndUrl + "/assets/uploads/clients/" + path;
    }
    // Default to products folder
    return backEndUrl + "/assets/uploads/products/" + path;
  }

  // Determine the correct uploads folder based on context
  if (context === "client") {
    return backEndUrl + "/assets/uploads/clients/" + path;
  }

  // Default to products folder
  return backEndUrl + "/assets/uploads/products/" + path;
};
