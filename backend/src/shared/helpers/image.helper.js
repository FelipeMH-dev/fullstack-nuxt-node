const axios = require("axios");

async function urlToBase64(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return `data:image/jpeg;base64,${Buffer.from(response.data).toString("base64")}`;
  } catch (error) {
    console.error("❌ Error convirtiendo URL a Base64:", error.message);
    return null;
  }
}

module.exports = { urlToBase64 };
