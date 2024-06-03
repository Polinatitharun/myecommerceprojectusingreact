import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ cart, addToCart }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addedToCart, setAddedToCart] = useState([]); // State to track if each product is added to cart
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Initialize the addedToCart state array with false values for each product
    setAddedToCart(Array(products.length).fill(false));
  }, [products]);

  const fetchProducts = async (category = '') => {
    try {
      const url = category ? `https://fakestoreapi.in/api/products/category?type=${category}` : 'https://fakestoreapi.in/api/products';
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  const isInCart = (product) => {
    return cart && Array.isArray(cart) && cart.some(item => item.id === product.id);
  };

  const handleAddToCart = (product, index) => {
    addToCart(product);
    // Update the addedToCart state array to mark the corresponding product as added to cart
    setAddedToCart(prevState => prevState.map((val, i) => i === index ? true : val));
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  return (
    <div id="dashboard">
      <h1>Select the Category here</h1>
      <div id="category-buttons">
        <button onClick={() => handleCategoryClick('audio')}>Audio</button>
        <button onClick={() => handleCategoryClick('gaming')}>Gaming</button>
        <button onClick={() => handleCategoryClick('appliances')}>Appliances</button>
      </div>
      <div id="product-container">
        {products.map((product, index) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.title} />
            <h2>{product.title}</h2>
            <div className="product-price">
              <p>Price: ${product.price}</p>
              {isInCart(product) ? (
                <button onClick={handleGoToCart}>Go to Cart</button>
              ) : (
                <button onClick={() => handleAddToCart(product, index)} disabled={addedToCart[index]}>
                  {addedToCart[index] ? "Added to Cart" : "Add to Cart"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
