import EmptyFavourites from "./EmptyFavourites";
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react"
function Favourites({products,addToFavList,favList}){
const favoriteProducts = products.filter(item => favList.includes(item.id));

  // 2. Keep your save logic if you want to sync storage from here, 
  // but usually, it's better to keep this only in App.jsx to avoid duplication.
//   useEffect(() => {
//     localStorage.setItem('fav_list', JSON.stringify(favList));
//     console.log("Storage synced:", favList);
//   }, [favList]);
return (
    favoriteProducts.length === 0 ? <EmptyFavourites />:
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '20px' }}>
                    {favoriteProducts.map(product => (
                        <ProductCard key={product.id} product={product} 
                        inFavPage= {true} favList={favList}addToFavList={addToFavList} />
                    ))}
                </div>
    );
}

export default Favourites;