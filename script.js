// ===== LOGIN & REGISTER =====
let authMode = "login";

function showRegister() {
    authMode = "register";
    document.getElementById("authTitle").innerText = "Register";
    document.getElementById("authBtn").innerText = "Daftar";
    document.getElementById("toggleText").innerHTML = `Sudah punya akun? <span onclick="showLogin()" style="cursor:pointer; color:blue;">Login</span>`;
}

function showLogin() {
    authMode = "login";
    document.getElementById("authTitle").innerText = "Login";
    document.getElementById("authBtn").innerText = "Login";
    document.getElementById("toggleText").innerHTML = `Belum punya akun? <span onclick="showRegister()" style="cursor:pointer; color:blue;">Daftar</span>`;
}

document.getElementById("authBtn").addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("authMessage");

    if (!username || !password) {
        message.innerText = "Username & password are required!";
        return;
    }

    if (authMode === "register") {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.find(u => u.username === username)) {
            message.innerText = "Username is already taken!";
            return;
        }
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));
        message.style.color = "green";
        message.innerText = "Registration successful! Please login.";
        showLogin();
    } else {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem("loginUser", username);
            message.style.color = "green";
            message.innerText = "Login successful!";
            setTimeout(() => {
                document.getElementById("authContainer").style.display = "none";
                message.innerText = "";
            }, 500);
        } else {
            message.style.color = "red";
            message.innerText = "Invalid username or password!";
        }
    }
});

// ===== CART =====
function addToCart(name, price) {
    let loginUser = localStorage.getItem("loginUser");
    if (!loginUser) {
        alert("Please login first!");
        document.getElementById("authContainer").style.display = "flex";
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let found = cart.find(item => item.name === name);
    if (found) {
        found.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} has been added to the cart!`);
    updateCart();
}

function updateCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cartItems");
    const totalEl = document.getElementById("total");
    const cartCount = document.getElementById("cart-count");

    if (!cart.length) {
        cartItems.innerHTML = "Keranjang kosong";
        totalEl.innerText = "0";
        cartCount.innerText = "0";
        return;
    }

    let total = 0;
    cartItems.innerHTML = "";
    cart.forEach((item, index) => {
        total += item.price * item.qty;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `${item.name} (${item.qty}) - Rp ${item.price} <button onclick="removeCart(${index})">Delete</button>`;
        cartItems.appendChild(div);
    });
    totalEl.innerText = total;
    cartCount.innerText = cart.reduce((a,b)=>a+b.qty,0);
}

function removeCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index,1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function toggleCart() {
    const cartBox = document.getElementById("cartBox");
    cartBox.style.display = cartBox.style.display === "flex" ? "none" : "flex";
}

// ===== CHECKOUT INSTAGRAM =====
function checkoutIG() {
    if (!localStorage.getItem("loginUser")) {
        alert("Cart is empty");
        document.getElementById("authContainer").style.display = "flex";
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.length) return alert("Your cart is empty");

    localStorage.removeItem("cart");
    updateCart();
    window.open("https://www.instagram.com/fzzm____?igsh=ZnYzaGphbnl4dW1l", "_blank");
}

// ===== LIVE CHAT =====
function toggleChat() {
    const chatBox = document.getElementById("chatBox");
    chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    if (input.value.trim() === "") return;

    let chats = JSON.parse(localStorage.getItem("liveChat")) || [];

    // pesan user
    chats.push({
        sender: "user",
        message: input.value,
        time: new Date().toLocaleTimeString()
    });

    localStorage.setItem("liveChat", JSON.stringify(chats));
    input.value = "";
    loadChat();

    // ===== AUTO REPLY TERIMA KASIH (HANYA SEKALI) =====
    const alreadySent = localStorage.getItem("adminAutoOnce");

    if (!alreadySent) {
        setTimeout(() => {
            let chats = JSON.parse(localStorage.getItem("liveChat")) || [];

            chats.push({
                sender: "admin",
                message: "Thank you 😊 Our admin will reply shortly.",
                time: new Date().toLocaleTimeString()
            });

            localStorage.setItem("liveChat", JSON.stringify(chats));
            localStorage.setItem("adminAutoOnce", "true");

            loadChat();
        }, 800);
    }
}


function loadChat() {
    const chatBody = document.getElementById("chatBody");
    let chats = JSON.parse(localStorage.getItem("liveChat")) || [];

    chatBody.innerHTML = "";

    chats.forEach(chat => {
        const div = document.createElement("div");
        div.className = chat.sender === "admin" ? "admin-msg" : "user-msg";
        div.innerText = chat.message;
        chatBody.appendChild(div);
    });

    chatBody.scrollTop = chatBody.scrollHeight;
}

setInterval(loadChat, 1000);


function sendAdmin() {
    const input = document.getElementById("chatInput");
    if (!input.value.trim()) return;

    let chats = JSON.parse(localStorage.getItem("liveChat")) || [];
    chats.push({
        sender: "admin",
        message: input.value,
        time: new Date().toLocaleTimeString()
    });

    localStorage.setItem("liveChat", JSON.stringify(chats));
    input.value = "";
    loadChat();
}
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345"; // bebas, untuk demo


function loginAdmin() {
    const username = prompt("Username Admin:");
    const password = prompt("Password Admin:");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem("isAdmin", "true");
        alert("Login admin berhasil");
        window.location.href = "admin.html";
    } else {
        alert("Admin login failed");
    }
}





// ===== SEARCH =====
function searchProduct() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        const title = product.querySelector("h3").innerText.toLowerCase();
        if (title.includes(searchValue)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

// ===== INIT =====
updateCart();

localStorage.removeItem("adminAutoOnce");
localStorage.removeItem("liveChat");

