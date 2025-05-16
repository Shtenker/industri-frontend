const form = document.getElementById("orderForm");
const productList = document.getElementById("productList");

async function loadProducts() {
    // ✅ Corrected URL to fetch product list
    const response = await fetch("https://industri-backend.onrender.com/products");
    const products = await response.json();

    products.forEach(product => {
        const label = document.createElement("label");
        label.innerHTML = `
            <input type="checkbox" name="products" value="${product.id}"> ${product.name}
        `;
        productList.appendChild(label);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const selected = Array.from(document.querySelectorAll("input[name='products']:checked"))
        .map(input => ({ id: input.value }));

    // ✅ Corrected URL to submit the order to the deployed backend
    const response = await fetch("https://industri-backend.onrender.com/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: selected })
    });

    const result = await response.json();
    alert(result.message + " | Order ID: " + result.order_id);
});

loadProducts();
