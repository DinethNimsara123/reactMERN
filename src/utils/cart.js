import { toast } from "react-hot-toast";
import api from "./api";

// 1. Local Storage එකෙන් Cart එක ගන්නවා
export function getCart() {
    const cartString = localStorage.getItem("cart");
    if (cartString == null) {
        localStorage.setItem("cart", "[]");
        return [];
    }
    return JSON.parse(cartString);
}

// 2. Cart එකට Item එකතු කිරීම හෝ අඩු කිරීම
export function addToCart(product, qty) {
    const cart = getCart();
    const existingProductIndex = cart.findIndex((item) => item.product.productId === product.productId);

    if (existingProductIndex === -1 && qty > 0) {
        cart.push({ product: product, qty: qty });
        toast.success(`${product.name} added to cart! 🛒`);
    } else if (existingProductIndex !== -1) {
        cart[existingProductIndex].qty += qty;
        
        if (cart[existingProductIndex].qty < 1) {
            cart.splice(existingProductIndex, 1);
            toast.error(`${product.name} removed from cart!`);
        } else {
            if(qty > 0) toast.success(`Increased ${product.name} quantity! ➕`);
            if(qty < 0) toast.error(`Decreased ${product.name} quantity! ➖`);
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdate"));
}

// 3. මුළු Cart එකේම එකතුව සෙවීම
export function getTotal() {
    const cart = getCart();
    let total = 0;
    cart.forEach((item) => {
        total += item.product.price * item.qty;
    });
    return total;
}

// 4. Place Order කිරීම
export async function placeOrder(navigate) {
    const cart = getCart();
    const token = localStorage.getItem("Token");

    if (!token) {
        toast.error("Please login to place an order! 🔑");
        return;
    }

    if (cart.length === 0) {
        toast.error("Your cart is empty! 🛒");
        return;
    }

    const orderData = {
        items: cart,
        totalAmount: getTotal(),
        orderDate: new Date()
    };

    try {
        await api.post("/orders", orderData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success("Order Placed Successfully! ⚡🎉");
        localStorage.setItem("cart", "[]"); 
        window.dispatchEvent(new Event("cartUpdate"));
        
        if(navigate) navigate("/products");
    } catch (err) {
        console.error(err);
        toast.error("Failed to place order. Try again!");
    }
}