const products = [
  {id:1,name:"Smartphone Nova X Pro",category:"Смартфоны",price:4299,oldPrice:4699,rating:"4.9",reviews:128,badge:"ХИТ ПРОДАЖ",image:"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=700&q=85",description:"Стильный смартфон с ярким дисплеем, быстрой работой и камерой для важных моментов. Отличный выбор на каждый день."},
  {id:2,name:"Laptop AirBook 14",category:"Ноутбуки",price:7899,oldPrice:0,rating:"4.8",reviews:84,badge:"НОВИНКА",image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85",description:"Лёгкий и универсальный ноутбук для работы, учёбы и творчества. Минималистичный дизайн и удобство в движении."},
  {id:3,name:"Наушники SoundWave",category:"Аксессуары",price:599,oldPrice:749,rating:"4.9",reviews:96,badge:"−20%",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",description:"Комфортные наушники с насыщенным звучанием. Подойдут для музыки, фильмов и повседневных дел."},
  {id:4,name:"Smart Watch Active",category:"Гаджеты",price:899,oldPrice:0,rating:"4.7",reviews:63,badge:"ПОПУЛЯРНО",image:"https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=700&q=85",description:"Умные часы с лаконичным дизайном. Следи за активностью, получай уведомления и оставайся на связи."},
  {id:5,name:"Tablet Vision 11",category:"Гаджеты",price:2499,oldPrice:2799,rating:"4.8",reviews:51,badge:"ВЫГОДА",image:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=85",description:"Универсальный планшет для чтения, просмотра видео, заметок и развлечений. Большой экран и удобный формат."},
  {id:6,name:"Механическая клавиатура",category:"Аксессуары",price:449,oldPrice:0,rating:"4.9",reviews:42,badge:"ВЫБОР PRO",image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=85",description:"Удобная клавиатура для продуктивной работы и игр. Приятный ход клавиш и выразительный внешний вид."},
  {id:7,name:"Camera Pocket 4K",category:"Гаджеты",price:3199,oldPrice:3599,rating:"4.6",reviews:27,badge:"−11%",image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85",description:"Компактная камера для путешествий, семейных событий и творческих проектов. Лови моменты в высоком качестве."},
  {id:8,name:"PowerBank Ultra 20K",category:"Аксессуары",price:299,oldPrice:0,rating:"4.8",reviews:109,badge:"ТОП",image:"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=700&q=85",description:"Практичный внешний аккумулятор, который поможет оставаться на связи в дороге и в течение насыщенного дня."}
];
const money = value => new Intl.NumberFormat("ru-RU").format(value) + " сомони";
let activeFilter = "Все", showAll = false, searchTerm = "";
let cart = JSON.parse(localStorage.getItem("megamart-cart") || "[]");
let wishlist = new Set();
const $ = selector => document.querySelector(selector);
const productGrid = $("#productGrid");
function renderProducts(){
  let list = products.filter(p => (activeFilter === "Все" || p.category === activeFilter) && (p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm)));
  const sort = $("#sortSelect").value;
  if(sort === "low") list.sort((a,b)=>a.price-b.price);
  if(sort === "high") list.sort((a,b)=>b.price-a.price);
  if(!showAll && activeFilter === "Все" && !searchTerm) list = list.slice(0,4);
  productGrid.innerHTML = list.length ? list.map(p=>`
    <article class="product-card">
      <div class="product-image" data-details="${p.id}">
        <span class="product-badge">${p.badge}</span>
        <button class="wishlist ${wishlist.has(p.id)?"active":""}" data-wish="${p.id}" aria-label="Добавить в избранное">♥</button>
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span><h3>${p.name}</h3>
        <div class="product-rating">★ ${p.rating} <span>(${p.reviews} отзывов)</span></div>
        <div class="product-bottom"><div class="price">${money(p.price)} ${p.oldPrice?`<small><s>${money(p.oldPrice)}</s></small>`:""}</div><button class="add-cart" data-add="${p.id}" aria-label="Добавить ${p.name} в корзину">+</button></div>
      </div>
    </article>`).join("") : `<div class="empty-results">Ничего не найдено. Попробуй изменить запрос.</div>`;
  $("#showAllBtn").style.display = (activeFilter === "Все" && !searchTerm && products.length > 4) ? "inline-flex" : "none";
}
function saveCart(){localStorage.setItem("megamart-cart",JSON.stringify(cart));renderCart()}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();toast("Товар добавлен в корзину")}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0), total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  $("#cartCount").textContent=count;$("#drawerCount").textContent=`(${count})`;$("#cartTotal").textContent=money(total);
  $("#cartItems").innerHTML=cart.length?cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-item"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="quantity"><button data-qty="${p.id}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${p.id}" data-delta="1">+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Удалить">✕</button></div>`}).join(""):`<div class="empty-cart"><span>◇</span><h4>Пока здесь пусто</h4><p>Добавь товары, которые тебе понравились.</p></div>`;
}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2300)}
function openCart(){ $("#cartDrawer").classList.add("open");$("#overlay").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.classList.add("locked")}
function closeCart(){ $("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");document.body.classList.remove("locked")}
function openProduct(id){const p=products.find(x=>x.id===id);$("#modalContent").innerHTML=`<div class="modal-product"><img src="${p.image}" alt="${p.name}"><div><span class="product-category">${p.category}</span><h2>${p.name}</h2><div class="product-rating">★ ${p.rating} <span>(${p.reviews} отзывов)</span></div><p>${p.description}</p><div class="price">${money(p.price)}</div><button class="btn btn-primary" data-modal-add="${p.id}">Добавить в корзину <span>↗</span></button></div></div>`;$("#productModal").classList.add("open");$("#overlay").classList.add("open");document.body.classList.add("locked")}
function closeModal(){ $("#productModal").classList.remove("open");$("#overlay").classList.remove("open");document.body.classList.remove("locked")}
productGrid.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){addToCart(Number(add.dataset.add));return}
 const wish=e.target.closest("[data-wish]");if(wish){const id=Number(wish.dataset.wish);wishlist.has(id)?wishlist.delete(id):wishlist.add(id);renderProducts();return}
 const details=e.target.closest("[data-details]");if(details)openProduct(Number(details.dataset.details));
});
$("#filterTabs").addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;activeFilter=btn.dataset.filter;document.querySelectorAll(".filter-tab").forEach(x=>x.classList.toggle("active",x===btn));showAll=true;renderProducts()});
document.querySelectorAll(".category-card").forEach(btn=>btn.addEventListener("click",()=>{activeFilter=btn.dataset.category;showAll=true;document.querySelectorAll(".filter-tab").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));$("#catalog").scrollIntoView({behavior:"smooth"});renderProducts()}));
$("#sortSelect").addEventListener("change",renderProducts);
$("#showAllBtn").addEventListener("click",()=>{showAll=true;renderProducts();$("#showAllBtn").style.display="none"});
$("#cartTrigger").addEventListener("click",openCart);$("#cartClose").addEventListener("click",closeCart);$("#overlay").addEventListener("click",()=>{closeCart();closeModal()});
$("#cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]");const r=e.target.closest("[data-remove]");if(q){const id=Number(q.dataset.qty),item=cart.find(x=>x.id===id);item.qty+=Number(q.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart()}if(r){cart=cart.filter(x=>x.id!==Number(r.dataset.remove));saveCart()}});
$("#modalClose").addEventListener("click",closeModal);$("#modalContent").addEventListener("click",e=>{const btn=e.target.closest("[data-modal-add]");if(btn){addToCart(Number(btn.dataset.modalAdd));closeModal();openCart()}});
$("#checkoutBtn").addEventListener("click",()=>{if(!cart.length){toast("Сначала добавь товары в корзину");return}toast("Демо-режим: подключи форму оформления заказа");});
$("#searchToggle").addEventListener("click",()=>{$("#searchPanel").classList.toggle("open");$("#searchInput").focus()});$("#searchClose").addEventListener("click",()=>{$("#searchPanel").classList.remove("open");$("#searchInput").value="";searchTerm="";renderProducts()});
$("#searchInput").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();showAll=true;renderProducts();if(searchTerm)$("#catalog").scrollIntoView({behavior:"smooth"})});
$("#mobileMenuBtn").addEventListener("click",()=>{const open=$("#mainNav").classList.toggle("open");$("#mobileMenuBtn").setAttribute("aria-expanded",String(open))});
$("#mainNav").addEventListener("click",e=>{if(e.target.closest("a")){$("#mainNav").classList.remove("open");$("#mobileMenuBtn").setAttribute("aria-expanded","false")}});
$("#subscribeForm").addEventListener("submit",e=>{e.preventDefault();$("#subscribeMessage").textContent="Спасибо! Форма работает в демонстрационном режиме.";e.target.reset()});
const reviews=[{text:"«Удобный сайт, хороший выбор и быстрая обратная связь. Заказ оформил за пару минут — всё понятно и без лишних шагов.»",name:"Алишер К.",meta:"Покупатель MegaMart",avatar:"АК"},{text:"«Понравилось, что всё аккуратно разложено по категориям. Быстро нашла нужные аксессуары, оформление простое.»",name:"Мадина Р.",meta:"Покупатель MegaMart",avatar:"МР"},{text:"«Современный магазин и приятный интерфейс. Особенно удобно, что можно посмотреть детали товара и сразу добавить его в корзину.»",name:"Фирдавс Н.",meta:"Покупатель MegaMart",avatar:"ФН"}];
let reviewIndex=0;function setReview(){const r=reviews[reviewIndex];$("#reviewText").textContent=r.text;$("#reviewName").textContent=r.name;$("#reviewMeta").textContent=r.meta;$("#reviewAvatar").textContent=r.avatar}
$("#reviewPrev").addEventListener("click",()=>{reviewIndex=(reviewIndex+reviews.length-1)%reviews.length;setReview()});$("#reviewNext").addEventListener("click",()=>{reviewIndex=(reviewIndex+1)%reviews.length;setReview()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();closeModal();$("#searchPanel").classList.remove("open");$("#mainNav").classList.remove("open")}});
renderProducts();renderCart();
