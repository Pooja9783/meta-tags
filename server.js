const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5000; // Change as needed

// Hardcoded token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxNDc0ODM2NDYiLCJuYmYiOjE3Mzg0ODYwNTMsImV4cCI6MTczOTA5MDg1MywiaWF0IjoxNzM4NDg2MDUzfQ.ImbAZZHHvUBD5nhzxNutLbafNkd2MtItHcYyqAMMs7g"

// Function to generate an HTML page with meta tags
const generateHtml = (news) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${news.subject}</title>
        <meta name="description" content="${news.shortDescription}">
        
        <!-- Open Graph Meta Tags (for Facebook, LinkedIn, WhatsApp) -->
        <meta property="og:title" content="${news.subject}">
        <meta property="og:description" content="${news.shortDescription}">
        <meta property="og:image" content="${news.image}">
        <meta property="og:url" content="https://yourbackend.com/news/${news.id}">
        <meta property="og:type" content="article">

        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${news.subject}">
        <meta name="twitter:description" content="${news.shortDescription}">
        <meta name="twitter:image" content="${news.image}">

        <script>
          window.location.href = "https://yourfrontend.com/news/${news.id}";
        </script>
    </head>
    <body>
        <p>Redirecting...</p>
    </body>
    </html>
  `;
};

// API Route to serve dynamic meta tags
app.get("/news/:newsId", async (req, res) => {
  try {
    const newsId = req.params.newsId;
    const API_URL = `https://www.coffeewebapi.com/api/news/GetNewsToDisplayForUserWithLock/5349/1/4/1`;

    // Use hardcoded token in the request
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.returnLst.length > 0) {
      const news = response.data.returnLst[0];
      const html = generateHtml(news);
      res.send(html);
    } else {
      res.status(404).send("News not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching news data");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
