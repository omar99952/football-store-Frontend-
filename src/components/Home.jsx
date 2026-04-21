import { useState, useEffect } from "react"
import Hero from "./Hero"
import ProductCard from "./ProductCard"
import BrandFilters from "./BrandFilters"
import AxiosInstance from "./AxiosInstance"

function Home({cartItems,handleCartUpdate ,addToFavList,favList}) {
    const[filteredProducts ,setFilteredProducts] = useState([])
    const [activeBrand, setActiveBrand] = useState('All')
    const fetchProducts = async (brandName = "") => {
    const response = await AxiosInstance.get('/products/', {
        params: { brand: brandName } 
    });
        setFilteredProducts(response.data);
    }

    useEffect(() => {
    fetchProducts(); 
        }, []);
    return (
        <div>
            <Hero />
            <BrandFilters fetchProducts= {fetchProducts} activeBrand={activeBrand} setActiveBrand={setActiveBrand} />
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