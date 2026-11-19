const products = [
  {id:1,name:"Fresh Green Apple",category:"Fresh Fruit",price:180,old:220,unit:"1 kg",rating:4.8,image:"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80",badge:"Sale"},
  {id:2,name:"Organic Broccoli",category:"Vegetables",price:120,old:150,unit:"500 g",rating:4.9,image:"https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=80",badge:"Sale"},
  {id:3,name:"Sweet Red Strawberry",category:"Fresh Fruit",price:260,old:0,unit:"500 g",rating:4.7,image:"https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=500&q=80",badge:""},
  {id:4,name:"Fresh Organic Carrot",category:"Vegetables",price:80,old:100,unit:"1 kg",rating:4.8,image:"https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=500&q=80",badge:"Sale"},
  {id:5,name:"Farm Fresh Milk",category:"Dairy",price:95,old:0,unit:"1 litre",rating:4.6,image:"https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80",badge:""},
  {id:6,name:"Fresh Orange",category:"Fresh Fruit",price:160,old:190,unit:"1 kg",rating:4.8,image:"https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=500&q=80",badge:"Sale"},
  {id:7,name:"Red Bell Pepper",category:"Vegetables",price:140,old:0,unit:"500 g",rating:4.5,image:"https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=500&q=80",badge:""},
  {id:8,name:"Fresh Brown Eggs",category:"Dairy",price:150,old:170,unit:"12 pcs",rating:4.9,image:"https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=500&q=80",badge:"Sale"}
];
let activeFilter="All", searchTerm="", cart=[], wishlist=new Set();
const grid=document.getElementById("productGrid");
const money=n=>"৳"+n.toFixed(2);
function showToast(message){document.getElementById("toastMessage").textContent=message;bootstrap.Toast.getOrCreateInstance(document.getElementById("liveToast"),{delay:2100}).show();}
function renderProducts(){
 let list=products.filter(p=>(activeFilter==="All"||p.category===activeFilter)&&(`${p.name} ${p.category}`.toLowerCase().includes(searchTerm)));
 const sort=document.getElementById("sortSelect").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price); if(sort==="high")list.sort((a,b)=>b.price-a.price);
 grid.innerHTML=list.map(p=>`<div class="col-6 col-md-4 col-lg-3"><article class="product-card"><div class="product-image">${p.badge?`<span class="product-badge">${p.badge}</span>`:""}<button class="wish-btn ${wishlist.has(p.id)?"active":""}" data-wish="${p.id}" aria-label="Add ${p.name} to wishlist"><i class="bi ${wishlist.has(p.id)?"bi-heart-fill":"bi-heart"}"></i></button><img src="${p.image}" alt="${p.name}" loading="lazy"></div><div class="product-info"><h3>${p.name}</h3><div class="rating">★★★★★ <span>(${p.rating})</span></div><div class="product-bottom"><div class="product-price">${money(p.price)} <del>${p.old?money(p.old):""}</del><small class="d-block text-muted fw-normal">${p.unit}</small></div><button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to cart"><i class="bi bi-bag-plus"></i></button></div></div></article></div>`).join("");
 document.getElementById("emptyState").classList.toggle("d-none",list.length!==0);
}
function renderCart(){
 const count=cart.reduce((s,i)=>s+i.qty,0),total=cart.reduce((s,i)=>s+i.price*i.qty,0);
 document.getElementById("cartCount").textContent=count;document.getElementById("cartTotal").textContent=money(total);document.getElementById("cartSubtotal").textContent=money(total);
 document.getElementById("cartItems").innerHTML=cart.length?cart.map(i=>`<div class="cart-line"><img src="${i.image}" alt=""><div><b>${i.name}</b><small>${money(i.price)} / ${i.unit}</small><div class="qty-controls"><button data-qty="${i.id}" data-change="-1">−</button><span>${i.qty}</span><button data-qty="${i.id}" data-change="1">+</button></div></div><button class="remove-item" data-remove="${i.id}" aria-label="Remove"><i class="bi bi-trash"></i></button></div>`).join(""):'<p class="text-muted">Your cart is empty. Add something fresh!</p>';
}
function addToCart(id){const p=products.find(x=>x.id===id),found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({...p,qty:1});renderCart();showToast(`${p.name} added to cart`);}
grid.addEventListener("click",e=>{const add=e.target.closest("[data-add]"),wish=e.target.closest("[data-wish]");if(add)addToCart(Number(add.dataset.add));if(wish){const id=Number(wish.dataset.wish);wishlist.has(id)?wishlist.delete(id):wishlist.add(id);document.getElementById("wishCount").textContent=wishlist.size;renderProducts();showToast(wishlist.has(id)?"Added to wishlist":"Removed from wishlist");}});
document.getElementById("cartItems").addEventListener("click",e=>{const qty=e.target.closest("[data-qty]"),remove=e.target.closest("[data-remove]");if(qty){const item=cart.find(x=>x.id===Number(qty.dataset.qty));item.qty+=Number(qty.dataset.change);if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);renderCart();}if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));renderCart();}});
document.getElementById("searchForm").addEventListener("submit",e=>{e.preventDefault();searchTerm=document.getElementById("searchInput").value.trim().toLowerCase();renderProducts();document.getElementById("products").scrollIntoView({behavior:"smooth"});});
document.getElementById("searchInput").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts();});
document.getElementById("filterPills").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;document.querySelectorAll(".filter-pill").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
document.querySelectorAll(".category-link").forEach(a=>a.addEventListener("click",()=>{activeFilter=a.dataset.category;document.querySelectorAll(".filter-pill").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));renderProducts();}));
document.getElementById("sortSelect").addEventListener("change",renderProducts);
document.getElementById("showAll").addEventListener("click",()=>{activeFilter="All";searchTerm="";document.getElementById("searchInput").value="";document.querySelectorAll(".filter-pill").forEach(x=>x.classList.toggle("active",x.dataset.filter==="All"));renderProducts();});
document.getElementById("wishlistButton").addEventListener("click",()=>{if(!wishlist.size){showToast("Your wishlist is empty");return;}activeFilter="All";searchTerm="";renderProducts();showToast(`${wishlist.size} item(s) saved in your wishlist`);});
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();const email=document.getElementById("newsletterEmail").value;showToast(`Thanks! ${email} is subscribed.`);e.target.reset();});
document.getElementById("checkoutButton").addEventListener("click",()=>showToast(cart.length?"Demo checkout: your cart is ready!":"Your cart is empty"));
renderProducts();renderCart();
