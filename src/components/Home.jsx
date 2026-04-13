import { useState, useEffect } from "react"
import Hero from "./Hero"
import ProductCard from "./ProductCard"
import BrandFilters from "./BrandFilters"


function Home({products,onAddToCart,cartItems,handleCartUpdate}) {
    
    const [activeBrand, setActiveBrand] = useState('All')
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
        
        

    

    const filteredProducts = activeBrand === 'All'
        ? products
        : products.filter(p => p.brand === activeBrand)

    return (
        <div>
            <Hero />
            <BrandFilters activeBrand={activeBrand} setActiveBrand={setActiveBrand} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '20px' }}>
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} 
                                 addToFavList={addToFavList} favList={favList} 
                                 cartItems={cartItems} handleCartUpdate={handleCartUpdate}/>
                ))}
            </div>
        </div>
    )
}

export default Home