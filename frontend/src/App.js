import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, []);

  if (products.length === 0) return <p>Loading...</p>;

  return (
    <>
      <h1>Product List</h1>
      <ul>
        {products.map((item) => (
          <li
            key={item.id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              listStyle: "none",
              padding: "10px",
            }}
          >
            <Link
              to={`/product/${createSlug(item.title)}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <h2>{item.title}</h2>
              <img src={item.image} alt={item.title} width="100" />
              <p>Price: ${item.price}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products`)
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((item) => createSlug(item.title) === slug);
        setProduct(foundProduct);
        console.log("Found Product:", foundProduct);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [slug]);

  if (!product) return <p>Loading product details...</p>;

  return (
    <>
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} width="300" />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <Link to="/">Back to Product List</Link>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
