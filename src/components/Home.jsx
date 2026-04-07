import { useState, useEffect } from "react"
import Hero from "./Hero"
import Cart from "./Cart"
import ProductCard from "./ProductCard"
import BrandFilters from "./BrandFilters"
import AxiosInstance from "./AxiosInstance"

function Home() {
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [activeBrand, setActiveBrand] = useState('All')

    useEffect(() => {
        AxiosInstance.get('products/')
            .then(res => setProducts(res.data))
            .catch(err => console.log(err))
    }, [])

    const addToCart = (product) => {
        const existing = cartItems.findIndex(item => item.id === product.id)
        if (existing >= 0) {
            // product already in cart — increase quantity
            const updated = [...cartItems]
            updated[existing].quantity += 1
            setCartItems(updated)
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }])
        }
    }

    const changeQuantity = (index, amount) => {
        const updated = [...cartItems]
        updated[index].quantity += amount
        if (updated[index].quantity <= 0) {
            updated.splice(index, 1)  // remove if quantity reaches 0
        }
        setCartItems(updated)
    }

    const removeItem = (index) => {
        const updated = [...cartItems]
        updated.splice(index, 1)
        setCartItems(updated)
    }

    const filteredProducts = activeBrand === 'All'
        ? products
        : products.filter(p => p.brand === activeBrand)

    return (
        <div>
            <Hero />
            <BrandFilters activeBrand={activeBrand} setActiveBrand={setActiveBrand} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '20px' }}>
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
            </div>
            <Cart cartItems={cartItems} onChangeQuantity={changeQuantity} onRemove={removeItem} />
        </div>
    )
}

export default Home