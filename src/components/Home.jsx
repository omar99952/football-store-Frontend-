import { useState, useEffect } from "react"
import Hero from "./Hero"
import ProductCard from "./ProductCard"
import BrandFilters from "./BrandFilters"
import AxiosInstance from "./AxiosInstance"

function Home({ cartItems, handleCartUpdate, addToFavList, favList }) {
    // 1. Keep track of all products for the active brand
    const [allProducts, setAllProducts] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [activeBrand, setActiveBrand] = useState('All');

    const fetchProducts = async (brandName = "") => {
        const response = await AxiosInstance.get('/products/', {
            params: { brand: brandName }
        });
        // Save the brand-specific list to our master state
        setAllProducts(response.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 2. Client-side filtering: Filter the brand-list by price
    const displayedProducts = allProducts.filter(product => {
        const price = Number(product.price);
        return price >= priceRange[0] && price <= priceRange[1];
    });

    return (
        <div>
            <Hero />
            {/* 3. Pass onPriceChange to update the range state */}
            <BrandFilters 
                fetchProducts={fetchProducts} 
                activeBrand={activeBrand} 
                setActiveBrand={setActiveBrand} 
                onPriceChange={(newRange) => setPriceRange(newRange)}
            />
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '20px' }}>
                {displayedProducts.length > 0 ? (
                    displayedProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            addToFavList={addToFavList} 
                            favList={favList} 
                            cartItems={cartItems} 
                            handleCartUpdate={handleCartUpdate}
                        />
                    ))
                ) : (
                    <div style={{ color: '#888', width: '100%', textAlign: 'center', padding: '50px' }}>
                        No products found in this price range.
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home