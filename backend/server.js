const express = require("express");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Serve the React build folder
const buildPath = path.join(__dirname, "../frontend/build");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
}

console.log("Checking buildPath:", buildPath);
console.log("Does buildPath exist?", fs.existsSync(buildPath));


// ✅ Function to create slugs from product titles
const createSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};

// ✅ Serve pre-rendered HTML with Open Graph Meta Tags
app.get("/product/:slug", async (req, res) => {
  try {
    const productSlug = req.params.slug;
    
    // Fetch product data
    const productResponse = await fetch("https://fakestoreapi.com/products");
    if (!productResponse.ok) throw new Error(`Failed to fetch products: ${productResponse.status}`);
    
    const products = await productResponse.json();
    const product = products.find((p) => createSlug(p.title) === productSlug);
    
    // If product not found, return 404
    if (!product) return res.status(404).send("Product not found");

    // ✅ Read and modify index.html
    let indexHTML = fs.readFileSync(path.join(buildPath, "index.html"), "utf8");

    indexHTML = indexHTML
      .replace("<title>React App</title>", `<title>${product.title}</title>`)
      .replace(
        '<meta name="description" content="Web site created using create-react-app" />',
        `<meta name="description" content="${product.description}" />`
      )
      .replace("</head>", `
        <meta property="og:title" content="${product.title}" />
        <meta property="og:description" content="${product.description}" />
        <meta property="og:image" content="${product.image}" />
        <meta property="og:url" content="https://meta-tags-production.up.railway.app/product/${productSlug}" />
        <meta property="og:type" content="product" />
      </head>`);

    // ✅ Send the updated HTML to the client
    res.send(indexHTML);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Serve React frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
