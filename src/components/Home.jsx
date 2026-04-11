import { useState, useEffect } from "react"
import Hero from "./Hero"
import Cart from "./Cart"
import ProductCard from "./ProductCard"
import BrandFilters from "./BrandFilters"


function Home({products,onAddToCart}) {
    const [cartItems, setCartItems] = useState([])
    const [activeBrand, setActiveBrand] = useState('All')
    const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("football_cart");
        return savedCart ? JSON.parse(savedCart) : [];
            });
    const [favList,setFavList] = useState(() =>{
        const savedData = localStorage.getItem('fav_list')
        return savedData ? JSON.parse(savedData) : []
    }
        )
      
    function addToFavList(id){
        if (!favList.includes(id))
            setFavList([...favList,id])
        else 
            setFavList(favList.filter( item => item!== id))

    }


    useEffect(() => {
        localStorage.setItem('fav_list', JSON.stringify(favList) )
        console.log("The list has updated and saved:", favList);

        }, [favList]);
        
    useEffect(() => {
    localStorage.setItem("football_cart", JSON.stringify(cart));
  }, [cart]);    

    

    

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
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} addToFavList={addToFavList} favList={favList}/>
                ))}
            </div>
            <Cart cartItems={cartItems} onChangeQuantity={changeQuantity} onRemove={removeItem} />
        </div>
    )
}

export default Home