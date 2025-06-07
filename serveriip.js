// serverIP.js

async function getServerIP() {    const backendUrl = "http://192.168.9.57:3306"; 

    try {
        console.log("Using hardcoded backend URL:", backendUrl);
        return backendUrl; // Directly return the hardcoded URL
    } catch (error) {
        console.error("Error in getServerIP (should not happen):", error);
        return null;
    }
}

export default getServerIP;