import { motion } from "framer-motion";
import adidasF50 from "../assets/shoe.webp";

export default function Hero() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${adidasF50})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="hero-content"
      >
        <h1 style={{color: 'white'}}>Speed. Power. Precision.</h1>
        <p style={{color: 'white' }}>Discover the new Adidas F50 collection</p>
      </motion.div>
    </section>
  );
}