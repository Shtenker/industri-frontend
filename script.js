const form = document.getElementById("orderForm");
const productList = document.getElementById("productList");

let productsLoaded = false;

async function loadProducts() {
    if (productsLoaded) return;
    productsLoaded = true;

    productList.innerHTML = "";

    try {
        const response = await fetch("https://industri-backend.onrender.com/products");
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        const products = await response.json();
        products.forEach(product => {
            const label = document.createElement("label");
            label.innerHTML = `
                <input type="checkbox" name="products" value="${product.articleNumber}">
                ${product.name} — ${product.description} (${product.price} USD)
            `;
            productList.appendChild(label);
        });
        console.log("Products loaded successfully.");
    } catch (error) {
        console.error("Error loading products:", error);
        productList.innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selected = Array.from(document.querySelectorAll("input[name='products']:checked"))
        .map(input => ({ id: input.value }));

    if (selected.length === 0) {
        alert("Please select at least one product before submitting.");
        return;
    }

    try {
        const response = await fetch("https://industri-backend.onrender.com/submit-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products: selected })
        });

        if (!response.ok) {
            const text = await response.text();  
            throw new Error(`Server error: ${response.status} - ${text}`);
        }

        const result = await response.json();
        alert(result.message + " | Order ID: " + result.order_id);
        form.reset();
    } catch (error) {
        alert("Failed to submit order: " + error.message);
        console.error("Submit order error:", error);
    }
});

loadProducts();
