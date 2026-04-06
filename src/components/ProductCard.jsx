import { motion } from "framer-motion";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="card"
    >
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={onAddToCart}>
        Add To Cart
      </button>
    </motion.div>
  );
}