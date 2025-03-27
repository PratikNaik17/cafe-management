// import { Link } from 'react-router-dom';
// import { useCart } from './CartContext'; 

// function Demo() {
//   const { addToCart, cartItemCount } = useCart();
//   const menuItems = [
//     { id: 1, category: 'Appetizers', name: 'Spring Rolls', price: 5.99, image: 'spring-rolls.jpg' },
//     { id: 2, category: 'Main Courses', name: 'Chicken Burger', price: 15.99, image: 'chicken-burger.jpg' },
//     // More items...
//   ];

//   return (
//     <div>
//       <header>
//         <h1>Restaurant Logo</h1>
//         <nav>
//           <Link to="/">Home</Link>
//           <Link to="/menu">Menu</Link>
//           <Link to="/orders">Orders</Link>
//           <Link to="/contact">Contact</Link>
//         </nav>
//         <button>
//           <Link to="/cart">Cart ({cartItemCount})</Link>
//         </button>
//       </header>
//       <main>
//         <h2>Menu</h2>
//         {menuItems.map(item => (
//           <div key={item.id} className="menu-item">
//             <img src={item.image} alt={item.name} />
//             <h3>{item.name}</h3>
//             <p>{item.category}</p>
//             <p>${item.price}</p>
//             <button onClick={() => addToCart(item)}>Add to Cart</button>
//           </div>
//         ))}
//       </main>
//       <footer>
//         <p>Contact Information</p>
//         <p>Social Media Links</p>
//         <p>Privacy Policy</p>
//       </footer>
//     </div>
//   );



// }
// // function Demo() {
// //   return (
// //     <div>
// //       <Home />
// //     </div>
// //   );
// // }
// export default Demo;
