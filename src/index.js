import React, { createContext, useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import './App.css'; // Importer le fichier CSS

// Contexte pour la gestion du panier
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.id === product.id);
      if (itemIndex !== -1) {
        // Si le produit existe déjà, augmenter la quantité
        const updatedItems = [...prevItems];
        updatedItems[itemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Sinon, ajouter le produit avec une quantité de 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// Composant pour l'en-tête de la page
const Header = () => (
  <header>
    <h1>Mon E-commerce</h1>
    <nav>
      <Link to="/">Accueil</Link> | <Link to="/panier">Panier</Link>
    </nav>
  </header>
);

// Composant pour afficher les détails d'un produit
const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Simuler une récupération de produit depuis une API
    const fetchProduct = () => {
      const products = [
        { id: 1, name: 'Produit 1', price: 10, description: 'Description du produit 1', category: 'Électronique' },
        { id: 2, name: 'Produit 2', price: 20, description: 'Description du produit 2', category: 'Vêtements' },
        { id: 3, name: 'Produit 3', price: 30, description: 'Description du produit 3', category: 'Électronique' },
        { id: 4, name: 'Produit 4', price: 40, description: 'Description du produit 4', category: 'Accessoires' },
        { id: 5, name: 'Produit 5', price: 50, description: 'Description du produit 5', category: 'Vêtements' },
        { id: 6, name: 'Produit 6', price: 60, description: 'Description du produit 6', category: 'Accessoires' },
      ];

      const foundProduct = products.find((product) => product.id === parseInt(id));
      setProduct(foundProduct);
    };
    fetchProduct();
  }, [id]);

  return product ? (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Prix : {product.price} €</p>
      <button onClick={() => addToCart(product)}>Ajouter au panier</button>
    </div>
  ) : (
    <p>Chargement du produit...</p>
  );
};

// Composant pour afficher une liste de produits
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(''); // Filtre par catégorie

  useEffect(() => {
    // Simuler une récupération de produits depuis une API
    const fetchProducts = () => {
      const productsData = [
        { id: 1, name: 'Produit 1', price: 10, description: 'Description du produit 1', category: 'Électronique' },
        { id: 2, name: 'Produit 2', price: 20, description: 'Description du produit 2', category: 'Vêtements' },
        { id: 3, name: 'Produit 3', price: 30, description: 'Description du produit 3', category: 'Électronique' },
        { id: 4, name: 'Produit 4', price: 40, description: 'Description du produit 4', category: 'Accessoires' },
        { id: 5, name: 'Produit 5', price: 50, description: 'Description du produit 5', category: 'Vêtements' },
        { id: 6, name: 'Produit 6', price: 60, description: 'Description du produit 6', category: 'Accessoires' },
      ];
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  // Filtrer les produits en fonction de la catégorie sélectionnée
  const filteredProducts = categoryFilter
    ? products.filter((product) => product.category === categoryFilter)
    : products;

  return (
    <div>
      <h1>Liste des Produits</h1>

      {/* Filtre par catégorie */}
      <div>
        <label htmlFor="categoryFilter">Filtrer par catégorie :</label>
        <select
          id="categoryFilter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          <option value="Électronique">Électronique</option>
          <option value="Vêtements">Vêtements</option>
          <option value="Accessoires">Accessoires</option>
        </select>
      </div>

      <div className="product-list">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Prix : {product.price} €</p>
            <Link to={`/produit/${product.id}`} className="view-details">
              Voir Détails
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant pour afficher les produits dans le panier
const Cart = () => {
  const { cartItems, totalPrice } = useContext(CartContext);

  return (
    <div>
      <h1>Panier</h1>
      {cartItems.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div className="cart-items-grid">
          {cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              {item.name} - {item.price} € x {item.quantity}
            </div>
          ))}
        </div>
      )}
      <h2>Total : {totalPrice} €</h2>
    </div>
  );
};

// Composant principal avec navigation entre ProductList et Cart
const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/produit/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
};

// Point d'entrée principal de l'application
ReactDOM.render(
  <CartProvider>
    <App />
  </CartProvider>,
  document.getElementById('root')
);
