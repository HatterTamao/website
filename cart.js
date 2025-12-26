let cartContainer = document.getElementById("cartContainer");
let totalPriceEl = document.getElementById("totalPrice");

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Keranjang masih kosong</p>";
        totalPriceEl.innerText = "0";
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.qty;
        let div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <span>${item.name} (x${item.qty})</span>
            <span>Rp ${(item.price * item.qty).toLocaleString()}</span>
            <button onclick="removeItem(${index})">Hapus</button>
        `;
        cartContainer.appendChild(div);
    });

    totalPriceEl.innerText = total.toLocaleString();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

loadCart();
