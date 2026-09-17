/// ========= PureMint Skincare — College PDF Assignment JS =========
const products = [
    {id:1, name:"Mint Rice Hydrating Face Toner", price:14.99, category:"face", image:"images/mint rice hydrating toner.jfif"},
    {id:2, name:"Herbal Rice Cleansing Cream", price:16.99, category:"face", image:"images/herbal rice cleanser.jfif"},
    {id:3, name:"Fragranced Mint Rice Day Moisturizer", price:18.99, category:"face", image:"images/day moisturizer.jfif"},
    {id:4, name:"Natural Herbal Rice Under Eye Balm", price:12.99, category:"face", image:"images/eye gel.jfif"},
    {id:5, name:"Cooling Mint Rice Body Lotion", price:17.99, category:"body", image:"images/body lotion.jrif.jfif"},
    {id:6, name:"Lavendar Herbal Rice Face Serum", price:20.99, category:"face", image:"images/herbal serum.jfif"},
    {id:7, name:"Mild Scent Mint Rice Scrub", price:15.49, category:"face", image:""},
    {id:8, name:"Rose Herbal Rice Night Cream", price:19.99, category:"body", image:""},
    {id:9, name:"Mint Rice Fragrance Face Mist", price:13.49, category:"body", image:""},
    {id:10, name:"Calming Herbal Rice Lip Butter", price:9.99, category:"body", image:""},
    {id:11, name:"Citrus Mint Rice Bath Cream", price:18.49, category:"body", image:""},
    {id:12, name:"Unscented Pure Rice Herbal Mask Pack", price:21.49, category:"face", image:""},
    {id:13, name:"Mint Rice Herbal Face Wash", price:18.99, category:"face", image:""},
    {id:14, name:"Jasmine Herbal Rice Body Mist", price:19.49, category:"body", image:""},
    {id:15, name:"Mint Rice Exfoliating Rice Powder", price:15.99, category:"face", image:""},
    {id:16, name:"SandalWood Herbal Rice Face Pack", price:29.99, category:"face", image:""},
    {id:17, name:"Mint Rice Herbal Hand Balm", price:14.49, category:"body", image:""},
    {id:18, name:"Rosemary Herbal Rice Hair Serum", price:28.49, category:"hair", image:""},
    {id:19, name:"Mint Rice Cooling Eye Mist", price:16.49, category:"face", image:""},
    {id:20, name:"Vanilla Herbal Rice Body Butter", price:26.99, category:"body", image:""}
];

// ========= GLOBAL CART FUNCTIONS =========
let cart;
try{
    cart = JSON.parse(localStorage.getItem("pureMintCart")) || [];
}catch(e){
    cart = [];
}
function saveCartToStorage(){
    localStorage.setItem("pureMintCart", JSON.stringify(cart));
}
function addToCart(prodId){
    const product = products.find(p=>p.id === prodId);
    if(!product){
        showToast("Product not found","error");
        return;
    }
    const existingItem = cart.find(item=>item.id === prodId);
    if(existingItem){
        existingItem.quantity +=1;
    }else{
        cart.push({id:product.id,name:product.name,price:product.price,quantity:1});
    }
    saveCartToStorage();
    renderCartBadge();
    renderCartPage();
    renderCheckoutSummary();
    showToast(`${product.name} added to cart!`,"success");
}
function renderCartBadge(){
    const badge = document.getElementById("cart-badge");
    if(!badge) return;
    badge.innerText = cart.reduce((sum,i)=>sum+i.quantity,0);
}
function renderCartPage(){
    const container = document.getElementById("cart-container");
    const subtotalEl = document.getElementById("cart-subtotal");
    if(!container) return;
    container.innerHTML="";
    if(cart.length===0){
        container.innerHTML=`<p style="text-align:center;padding:2rem;">Your shopping cart is empty.</p>`;
        if(subtotalEl) subtotalEl.innerText="0.00";
        return;
    }
    let subtotal=0;
    cart.forEach((item,idx)=>{
        const total = item.price*item.quantity;
        subtotal+=total;
        const div = document.createElement("div");
        div.className="cart-item-row";
        div.innerHTML = `<h4>${item.name}</h4>
        <p>Price:$${item.price} | Qty:${item.quantity} | Total:$${total.toFixed(2)}</p>
        <button onclick="removeCartItem(${idx})">Remove Item</button>`;
        container.appendChild(div);
    })
    if(subtotalEl) subtotalEl.innerText = subtotal.toFixed(2);
}
function removeCartItem(index){
    cart.splice(index,1);
    saveCartToStorage();
    renderCartBadge();
    renderCartPage();
    renderCheckoutSummary();
    showToast("Item removed","success");
}
function clearEntireCart(){
    cart=[]; saveCartToStorage();
    renderCartBadge();renderCartPage();renderCheckoutSummary();
    showToast("Cart cleared","success");
}
function renderCheckoutSummary(){
    const outItems = document.getElementById("checkout-order-items");
    const outSub = document.getElementById("checkout-subtotal");
    if(!outItems) return;
    outItems.innerHTML="";
    if(cart.length===0){
        outItems.innerHTML=`<p>Your cart is empty</p>`;
        if(outSub) outSub.innerText="0.00";
        return;
    }
    let subtotal=0;
    cart.forEach(item=>{
        const line = item.price*item.quantity;
        subtotal+=line;
        const div=document.createElement("div");
        div.style.padding="6px 0";
        div.innerHTML=`<p>${item.name} ×${item.quantity} — $${line.toFixed(2)}</p>`;
        outItems.appendChild(div);
    })
    if(outSub) outSub.innerText = subtotal.toFixed(2);
}
function showToast(msg,type="success"){
    const el = document.createElement("div");
    el.className = type==="success"?"toast-success":"toast-error";
    el.innerText = msg;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),2600);
}

// ========= WISHLIST =========
let wishlistArr = JSON.parse(localStorage.getItem("pureMintWishlist")) || [];
function renderWishlistCount(){
    const wishlistCountEl = document.getElementById("wishlist-count");
    if(wishlistCountEl) wishlistCountEl.textContent = wishlistArr.length;
}

document.addEventListener("DOMContentLoaded", function(){
    renderCartBadge();
    if(document.getElementById("cart-container")) renderCartPage();
    renderCheckoutSummary();

    // Wishlist — matches HTML: shop‑product‑card , data‑cat
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");
    wishlistBtns.forEach(btn=>{
        const card = btn.closest(".shop-product-card");
        if(!card) return;
        const pid = card.dataset.id;
        if(wishlistArr.includes(pid)){
            btn.classList.add("active");
            btn.innerHTML=`<i class="fa-solid fa-heart"></i>`;
        }
    })
    renderWishlistCount();
    wishlistBtns.forEach(btn=>{
        btn.addEventListener("click",function(){
            const card = btn.closest(".shop-product-card");
            const prodId = card.dataset.id;
            if(wishlistArr.includes(prodId)){
                wishlistArr = wishlistArr.filter(id=> id!==prodId);
                btn.classList.remove("active");
                btn.innerHTML=`<i class="fa-regular fa-heart"></i>`;
                showToast("Removed from wishlist","success");
            }else{
                wishlistArr.push(prodId);
                btn.classList.add("active");
                btn.innerHTML=`<i class="fa-solid fa-heart"></i>`;
                showToast("Added to wishlist","success");
            }
            localStorage.setItem("pureMintWishlist", JSON.stringify(wishlistArr));
            renderWishlistCount();
        })
    });

    // ========= SHOP SEARCH + CATEGORY FILTER (matches your HTML id shopSearchInput, class shop‑product‑card, data‑cat) =========
    const searchInput = document.getElementById("shopSearchInput");
    const productCards = document.querySelectorAll(".shop-product-card");
    const noProductsMsg = document.getElementById("no-products");
    const filterBtns = document.querySelectorAll(".filter-btn");
    let selectedCategory = "all";

    function filterProducts(){
        if(!searchInput) return;
        const searchValue = searchInput.value.trim().toLowerCase();
        let found = false;
        productCards.forEach(card=>{
            const prodName = card.querySelector("figcaption p").textContent.trim().toLowerCase();
            const prodCat = card.dataset.cat.toLowerCase();
            const matchesSearch = prodName.includes(searchValue);
            const matchesCat = selectedCategory === "all" || prodCat === selectedCategory;
            if(matchesSearch && matchesCat){
                card.style.display = "";
                found = true;
            }else{
                card.style.display = "none";
            }
        })
        noProductsMsg.style.display = found ? "none":"block";
    }

    filterBtns.forEach(btn=>{
        btn.addEventListener("click",function(){
            filterBtns.forEach(b=>b.classList.remove("active"));
            btn.classList.add("active");
            selectedCategory = btn.dataset.filter;
            filterProducts();
        })
    })
    if(searchInput){
        searchInput.addEventListener("input", filterProducts);
    }

    // Read URL params ?cat= & ?search= from index category links
    const urlParams = new URLSearchParams(window.location.search);
    const catFromUrl = urlParams.get("cat");
    const searchFromUrl = urlParams.get("search");
    if(catFromUrl){
        selectedCategory = catFromUrl;
        filterBtns.forEach(btn=>{
            btn.classList.remove("active");
            if(btn.dataset.filter === catFromUrl) btn.classList.add("active");
        })
    }
    if(searchFromUrl && searchInput){
        searchInput.value = searchFromUrl;
    }
    if(document.querySelector(".shop-product-card")){
        filterProducts();
    }

    // ========= Hamburger Mobile Menu =========
    const hamburgerBtn = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".menu");
    if(hamburgerBtn && navMenu){
        hamburgerBtn.addEventListener("click",()=> navMenu.classList.toggle("open"));
        navMenu.querySelectorAll("a").forEach(link=>{
            link.addEventListener("click",()=>{
                if(window.innerWidth <=768) navMenu.classList.remove("open");
            })
        })
        document.addEventListener("click",(e)=>{
            if(!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) navMenu.classList.remove("open");
        })
    }
    // Dark‑mode toggle
    const themeToggleBtn = document.querySelector(".theme-toggle-btn");
    const savedTheme = localStorage.getItem("pureMintTheme");
    if(savedTheme==="dark"){
        document.body.classList.add("dark-mode");
        if(themeToggleBtn) themeToggleBtn.textContent="☀️";
    }
    if(themeToggleBtn){
        themeToggleBtn.addEventListener("click",()=>{
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            localStorage.setItem("pureMintTheme", isDark?"dark":"light");
            themeToggleBtn.textContent = isDark?"☀️":"🌓";
        })
    }
    // Sticky nav
    const pageNav = document.querySelector("nav");
    window.addEventListener("scroll",()=>{
        if(window.scrollY>40) pageNav.classList.add("sticky-nav");
        else pageNav.classList.remove("sticky-nav");
    })
    // Active nav link highlight
    function setActiveNavLink(){
        const fileName = window.location.pathname.split("/").pop();
        document.querySelectorAll(".menu a").forEach(link=>{
            link.classList.remove("nav-active");
            if(link.getAttribute("href") === fileName) link.classList.add("nav-active");
        })
    }
    setActiveNavLink();
    // Back‑to‑top button
    const backToTopBtn = document.getElementById("backToTopBtn");
    window.addEventListener("scroll",()=>{
        if(!backToTopBtn) return;
        backToTopBtn.classList.toggle("show", window.scrollY>300);
    })
    if(backToTopBtn){
        backToTopBtn.addEventListener("click",()=> window.scrollTo({top:0, behavior:"smooth"}));
    }

    // ========= PDF Form Validations: Signup / Login / Forgot Password =========
    const signupFormId = document.getElementById("signup-form");
    if(signupFormId){
        signupFormId.addEventListener("submit", function(event){
            event.preventDefault();
            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const phoneInput = document.getElementById("phone");
            const passwordInput = document.getElementById("password");
            const confirmPasswordInput = document.getElementById("confirm-password");
            const nameError = document.getElementById("name-error");
            const emailError = document.getElementById("email-error");
            const phoneError = document.getElementById("phone-error");
            const passwordError = document.getElementById("password-error");
            const confirmPasswordError = document.getElementById("confirm-password-error");
            const successMessage = document.getElementById("success-message");
            nameError.textContent = "";emailError.textContent = "";phoneError.textContent = "";
            passwordError.textContent = "";confirmPasswordError.textContent = "";successMessage.textContent = "";
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            let isValid = true;
            if(name === ""){ nameError.textContent = "Please enter your name."; isValid = false; }
            if(email === ""){ emailError.textContent = "Please enter your email."; isValid = false; }
            else if(!email.includes("@")){ emailError.textContent = "Please enter a valid email."; isValid = false; }
            if(phone === ""){ phoneError.textContent = "Please enter your phone number."; isValid = false; }
            else if(phone.length <10){ phoneError.textContent = "Please enter a valid phone number."; isValid = false; }
            if(password === ""){ passwordError.textContent = "Please enter a password."; isValid = false; }
            else if(password.length <6){ passwordError.textContent = "Password must be at least 6 characters."; isValid = false; }
            if(confirmPassword === ""){ confirmPasswordError.textContent = "Please confirm your password."; isValid = false; }
            else if(password !== confirmPassword){ confirmPasswordError.textContent = "Passwords do not match."; isValid = false; }
            if(!isValid) return;
            const user = {name:name, email:email, phone:phone, password:password};
            localStorage.setItem("user", JSON.stringify(user));
            successMessage.textContent = "Account created successfully!";
            setTimeout(()=>{ window.location.href = "login.html"; },1500);
        })
    }
    const loginFormId = document.getElementById("login-form");
    if(loginFormId){
        loginFormId.addEventListener("submit", function(event){
            event.preventDefault();
            const loginEmail = document.getElementById("login-email");
            const loginPassword = document.getElementById("login-password");
            const loginEmailError = document.getElementById("login-email-error");
            const loginPasswordError = document.getElementById("login-password-error");
            const loginSuccess = document.getElementById("login-success");
            loginEmailError.textContent = "";loginPasswordError.textContent = "";loginSuccess.textContent = "";
            const email = loginEmail.value.trim();
            const password = loginPassword.value;
            let isValid = true;
            if(email === ""){ loginEmailError.textContent = "Please enter your email."; isValid = false; }
            if(password === ""){ loginPasswordError.textContent = "Please enter your password."; isValid = false; }
            if(!isValid) return;
            const savedUser = localStorage.getItem("user");
            if(savedUser === null){ loginEmailError.textContent = "No account found. Please sign up first."; return; }
            const user = JSON.parse(savedUser);
            if(email !== user.email){ loginEmailError.textContent = "Incorrect email."; return; }
            if(password !== user.password){ loginPasswordError.textContent = "Incorrect password."; return; }
            loginSuccess.textContent = "Login successful!";
            localStorage.setItem("isLoggedIn","true");
            setTimeout(()=>{ window.location.href = "index.html"; },1500);
        })
    }
    const forgotForm = document.getElementById("forgot-form");
    if(forgotForm){
        forgotForm.addEventListener("submit", function(event){
            event.preventDefault();
            const forgotEmail = document.getElementById("forgot-email");
            const newPassword = document.getElementById("new-password");
            const confirmPassword = document.getElementById("confirm-password");
            const forgotEmailError = document.getElementById("forgot-email-error");
            const newPasswordError = document.getElementById("new-password-error");
            const confirmPasswordError = document.getElementById("confirm-password-error");
            const forgotSuccess = document.getElementById("forgot-success");
            forgotEmailError.textContent = "";newPasswordError.textContent = "";confirmPasswordError.textContent = "";forgotSuccess.textContent = "";
            const email = forgotEmail.value.trim();
            const password = newPassword.value;
            const confirmPasswordValue = confirmPassword.value;
            let isValid = true;
            if(email === ""){ forgotEmailError.textContent = "Please enter your email."; isValid = false; }
            if(password === ""){ newPasswordError.textContent = "Please enter a new password."; isValid = false; }
            else if(password.length <6){ newPasswordError.textContent = "Password must be at least 6 characters."; isValid = false; }
            if(confirmPasswordValue === ""){ confirmPasswordError.textContent = "Please confirm your password."; isValid = false; }
            else if(password !== confirmPasswordValue){ confirmPasswordError.textContent = "Passwords do not match."; isValid = false; }
            if(!isValid) return;
            const savedUser = localStorage.getItem("user");
            if(savedUser === null){ forgotEmailError.textContent = "No account found. Please create an account first."; return; }
            const user = JSON.parse(savedUser);
            if(email.toLowerCase() !== user.email.toLowerCase()){ forgotEmailError.textContent = "No account found with this email."; return; }
            user.password = password;
            localStorage.setItem("user", JSON.stringify(user));
            forgotSuccess.textContent = "Password updated successfully!";
            setTimeout(()=>{ window.location.href = "login.html"; },1500);
        })
    }

    // Other simple forms
    function handleContactSubmit(e){
        e.preventDefault();
        showToast("Message sent successfully, we will reply shortly!","success");
        e.target.reset();
    }
    function handleCheckoutSubmit(e){
        e.preventDefault();
        if(cart.length ===0){
            showToast("Cart empty, add products before checkout","error");
            return;
        }
        const orderNo = "PM‑"+Math.floor(Math.random()*99999);
        showToast(`🎉 Order placed! Order No: ${orderNo}`,"success");
        clearEntireCart();
        setTimeout(()=>window.location.href="index.html",1800);
    }
    function handleNewsletter(e){
        e.preventDefault();
        const input = e.target.querySelector("input[type='email']");
        const val = input.value.trim();
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)){
            showToast("Enter valid email address","error");
            return;
        }
        showToast("Thank‑you for subscribing PureMint Newsletter!","success");
        e.target.reset();
    }
    const contactForm = document.querySelector(".contact-form");
    if(contactForm) contactForm.addEventListener("submit", handleContactSubmit);
    const checkoutForm = document.querySelector(".checkout-form");
    if(checkoutForm) checkoutForm.addEventListener("submit", handleCheckoutSubmit);
    const newsletterForm = document.querySelector(".newsletter form");
    if(newsletterForm) newsletterForm.addEventListener("submit", handleNewsletter);
});
