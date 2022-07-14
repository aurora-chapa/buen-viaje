const cart = document.querySelector("#cart");
const cartItems = document.querySelector("#cart-list");
const deleteCart = document.querySelector("#delete-cart");
const productsList = document.querySelector("#products-list");
const cartButton = document.querySelector("#cart-button");
const cartDiv = document.querySelector("#cart-div")
let productsOnCart = [];

loadEventListeners();
function loadEventListeners () {
    productsList.addEventListener("click", addToCart);
    cart.addEventListener("click", deleteCartElement);
    cartButton.addEventListener("mouseover", showCart);
    window.addEventListener("click", hideCart);

    //Removes all products from cart
    deleteCart.addEventListener("click", () => {
        productsOnCart = [];
        localStorage.clear('cart');
        cleanHTML();
    });

    //Show products after reload 
    document.addEventListener('DOMContentLoaded', () => {
        productsOnCart = JSON.parse(localStorage.getItem('cart')) || [];

        cartLayout();
    })
}

function readProductContent (product) {
    //Gets product information
    const infoProduct = {
        image: product.querySelector(".main-card-product-image").src,
        title: product.querySelector(".subtitle").textContent,
        price: product.querySelector(".current-price").textContent,
        id: product.querySelector(".main-card-add-cart").getAttribute("data-id"),
        amount: 1,
    }

    //Adds amount and according to it, calculates product price
    const productAmount = productsOnCart.some( product => product.id === infoProduct.id );
    if(productAmount) {
        const products = productsOnCart.map( product => {
            const productPrice = infoProduct.price;
            const priceToString = productPrice.toString().replace(/[$,]/g, '');
            const priceToNumber = parseInt(priceToString);

            if( product.id === infoProduct.id ) {
                product.amount++;

                const priceCalculate = priceToNumber * product.amount;
                const priceToCurrency = Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                });
                const newPrice = priceToCurrency.format(priceCalculate);
                product.price = newPrice;
                return product;
            } else {
                return product;
            }
        });        
        productsOnCart = [...products]
    } else {
        productsOnCart = [...productsOnCart, infoProduct];
    }
    
    cartLayout();
}

//Adds product html to cart
function cartLayout () {
    cleanHTML();

    productsOnCart.forEach ( product => {
        const {image, title, amount, price, id} = product;

        const cartProduct = document.createElement('div');
        cartProduct.innerHTML = `
        <div class="cart-product">
            <div class="cart-product-thumb">
                <img class="cart-product-thumb-image" src="${image}">
            </div>
            <div class="cart-product-title">
                <p class="paragraph-dark">${title}</p>
            </div>
            <div class="cart-product-price">
                <p class="current-price-small">${price}</p>
            </div>
            <div class="cart-product-amount">
                <p class="paragraph-dark">${amount}</p>
            </div>
            <a href="#">
                <img src="src/icons/delete-item.svg" class="cart-product-delete" data-id="${id}">
            </a>
        </div>
        `;
        cartItems.appendChild(cartProduct);
    });

    cartStorage();
}

function showCart () {
    document.getElementById('cart').style.display = "block";
}

function hideCart (element) {
    // if (!document.contains(cart.target)) {
    //     document.getElementById('cart').style.display = "none";
    //   }
    if(element.id != "cart" && element.target.parentNode.id != "cart-div"){
        cart.style.display = 'none';
    }
}

//Adds products to storage
function cartStorage() {
    localStorage.setItem('cart', JSON.stringify(productsOnCart));
}

//Adds a product to cart
function addToCart(element) {
    element.preventDefault(); 

    if (element.target.classList.contains("main-card-grid-purchase-cta-cart")) {
        const selectedProduct = element.target.parentElement.parentElement.parentElement.parentElement.parentElement;
        readProductContent(selectedProduct);
    }
}

//Removes a product from cart
function deleteCartElement(element) {
    element.preventDefault();
    if(element.target.classList.contains("cart-product-delete")) {
        const productId = element.target.getAttribute("data-id");
        productsOnCart = productsOnCart.filter(product => product.id !== productId);

        cartLayout();
    }
}

//Prevents excedent HTML
function cleanHTML () {
    while(cartItems.firstChild) {
        cartItems.removeChild(cartItems.firstChild);
    }
}

