const express = require("express");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();
app.use(express.static(path.resolve(__dirname, "build")));

// Function to create slugs from product titles
const createSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};

// 🛍️ API Endpoint for Product Page with Slug
app.get("/product/:slug", async (req, res) => {
  try {
    const productSlug = req.params.slug;

    // Fetch all products from FakeStoreAPI
    const productResponse = await fetch(`https://fakestoreapi.com/products`);
    if (!productResponse.ok) throw new Error(`Failed to fetch products: ${productResponse.status}`);

    const products = await productResponse.json();

    // Find product by slug
    const product = products.find((p) => createSlug(p.title) === productSlug);
    if (!product) return res.status(404).send("Product not found");

    console.log("Fetched Product:", product);

    // Read the main HTML template
    let indexHTML = fs.readFileSync(path.resolve(__dirname, "build", "index.html"), "utf8");

    // Inject Open Graph meta tags for social media sharing
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
        <meta property="og:url" content="https://yourwebsite.com/product/${productSlug}" />
        <meta property="og:type" content="product" />
      </head>`);

    res.send(indexHTML);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Serve React frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
