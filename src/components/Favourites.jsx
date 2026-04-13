import ProductCard from "./ProductCard";

function Favourites({products,onAddToCart}){

const favlist = JSON.parse(localStorage.getItem('fav_list'));
products = products.filter( item =>  favlist.includes(item.id) )

return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '20px' }}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} fromFav= {true} />
                    ))}
                </div>
    );
}

export default Favourites;