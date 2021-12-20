// products
import {productsData} from "./products.js" ;


// variables
const modal = document.querySelector('.cart-modal');
const backDrop = document.querySelector('.back-drop');
const cartBtn = document.querySelector('.right-section i');
const closeBtn = document.querySelector('.close-cart');
const productsWrapper = document.querySelector('.products-wrapper');
const cart = document.querySelector('.items');
const cartNumber = document.querySelector('.item-counter');
const addedTocartIds = [];
const totalPriceSpan = document.querySelector('.total-price');
let totalPrice = 0;
const productModal = document.querySelector('.product-modal');
const closeProdModalBtn = document.querySelector('.close-prod-modal');

// steps
cartBtn.addEventListener('click' , openModal);
closeBtn.addEventListener('click' , closeModal);
backDrop.addEventListener('click' , closeModal);
cart.addEventListener('click' , countProductNumber);
document.addEventListener('DOMContentLoaded',()=>{
    const products = new Products();
    const allProducts = products.getProducts();
    const uiDisplayer = new UI();
    uiDisplayer.displayProducts(allProducts);

    const cartItems = new LocalStorage();
    cartItems.localCartRun(allProducts);
})
productsWrapper.addEventListener('click' , (e)=>{
    let identifierClass = [... e.target.classList];
    if(identifierClass[0] === 'add-to-cart-btn')
    {
        addToCart(e , true);
    }
    else if (identifierClass[0] === 'product-image')
    {
        const clickedParentClass = [... e.target.parentElement.parentElement.classList];
        const clickeId = clickedParentClass[1].split('product-number-');
        openProductModal(productIdentifier(clickeId[1] ,false));
    }
})
closeProdModalBtn.addEventListener('click' , closeProdModal);


class Products{
    getProducts(){
        return productsData;
    }
}
class UI{
    displayProducts(prods){ 
        prods.forEach(element=>{
            let prodsHtml = document.createElement('div');
            prodsHtml.classList.add('product' , `product-number-${element.id}`);
            let prodsHtmlText = `<div class="product-image-wrapper">
                <img src="${element.imageUrl}" class="product-image"/>
            </div>
            <div class="products-details">
                <span class="product-name">
                     ${element.title}
                </span>
                <span class="product-price">
                    <span>${element.price}</span>$
                </span>
            </div>
            <div class="add-to-cart">
                <button class="add-to-cart-btn">
                    Add to cart
                </button>
            </div>`;
            prodsHtml.innerHTML = prodsHtmlText;
            productsWrapper.appendChild(prodsHtml);
        });
    }
    displayCartItems(clicked){

        const savedArray = new LocalStorage;
        savedArray.saveItems(clicked.id);

        if(validateCart(clicked.id , addedTocartIds)){
            let cartitem = document.createElement('div');
            cartitem.classList.add('item');
            cartitem.classList.add(`item-${clicked.id}`);
            let cartitemText = `<div class="cart-img">
            <img src="${clicked.imageUrl}" class="cart-image"/>
            </div>
            <div class="cart-name">
            <p>
            ${clicked.title}
            </p>
            </div>
            <div class="cart-item-count">
            <i class="fas fa-chevron-up"></i>
            <span>
            1
            </span>
            <i class="fas fa-chevron-down"></i>
            </div>
            <div class="cart-item-price">
            <span>${clicked.price}</span>$
            </div>`;
            addedTocartIds.push(clicked.id);
            cartitem.innerHTML = cartitemText;
            cart.appendChild(cartitem);
            totalPriceFunc(clicked.id , true);
            cartNumber.style.transform = "scale(1.5)";
            cartNumber.textContent = cart.children.length;
            setTimeout( ()=>{
                cartNumber.style.transform = "scale(1)";
            }, 500)
        }
    }
}

class LocalStorage{
    localitems (){
        let localProductsIds = localStorage.getItem('localProds') ? 
        JSON.parse(localStorage.getItem('localProds')) : [];

        return localProductsIds;
    }
    saveItems(prod){
        let localProductsIds = localStorage.getItem('localProds') ? 
        JSON.parse(localStorage.getItem('localProds')) : [];
        if(!localProductsIds.some(element=>{
            return element == prod;
        })){
            localProductsIds.push(prod);
        }
        localStorage.setItem(('localProds') , JSON.stringify(localProductsIds));
    }
    localCartRun(prods){
        let localProductsIds = localStorage.getItem('localProds') ? 
        JSON.parse(localStorage.getItem('localProds')) : [];

        localProductsIds.forEach(prodId =>{
            prods.forEach(product =>{
                if(prodId === product.id)
                {
                    const cartItems = new UI();
                    cartItems.displayCartItems(productIdentifier(product.id,false));
                    buttonText(localProductsIds);
                }
            })
        })
    }
}
// functions
function openModal(){
    modal.style.transform = 'translateY(0)';
    modal.style.zIndex = '10';
    modal.style.opacity = '1';
    backDrop.style.display = "block";
}
function closeModal(){
    modal.style.transform = 'translateY(-100vh)';
    modal.style.zIndex = '-1';
    modal.style.opacity = '0';
    backDrop.style.display = "none";
}
function validateCart(inCart , arr)
{
    return !arr.some(ids=>{
        return ids === inCart;
    })
}
function totalPriceFunc(id , plusOrMines){
    // addedTocartIds.push(obj.id);
    // totalPrice += obj.price;
    // totalPriceSpan.textContent = totalPrice + "$";
    const allProducts = new Products();
    const allProdsData = allProducts.getProducts();
    allProdsData.forEach(prods =>{
        if(prods.id == id)
        {
            if(plusOrMines)
            {
                totalPrice += prods.price;
                totalPriceSpan.textContent = totalPrice + "$";
            }
            else
            {
                totalPrice -= prods.price;
                totalPriceSpan.textContent = totalPrice + "$";
            }
        }
    })
    

}
function countProductNumber(e){
    const clickedItem  = [... e.target.classList];
    if(clickedItem[1] === "fa-chevron-up")
    {
        const clickedParent = e.target.parentElement.parentElement;
        const idCartArr = [...clickedParent.classList];
        const idCart = idCartArr[1].split('item-');
        totalPriceFunc(idCart[1] ,true);
        const countedNumber = e.target.nextElementSibling;
        countedNumber.textContent = parseInt(countedNumber.textContent) + 1;
    }
    else if(clickedItem[1] === "fa-chevron-down")
    {
        const countedNumber = e.target.previousElementSibling;
        const clickedParent = e.target.parentElement.parentElement;
        const idCartArr = [...clickedParent.classList];
        const idCart = idCartArr[1].split('item-');
        if(parseInt(countedNumber.textContent) !== 1)
        {
            totalPriceFunc(idCart[1] ,false);
            countedNumber.textContent = parseInt(countedNumber.textContent) - 1;
        }
        else{
            totalPriceFunc(idCart[1] ,false);
            addedTocartIds.splice(addedTocartIds.indexOf(parseInt(idCart[1])) ,1);
            const localItems = new LocalStorage();
            const localIds = localItems.localitems();
            localIds.splice(addedTocartIds.indexOf(parseInt(idCart[1])) ,1);
            localStorage.setItem('localProds' , JSON.stringify(localIds));
            addToCart(productIdentifier(idCart[1]) , false);
            clickedParent.remove();
            cartNumber.textContent = cart.children.length;
        }
    }
}
function addToCart(clicked , toggele){
    if(toggele){
        clicked.target.textContent = "added to Cart";
        const cartItems = [...clicked.target.parentElement.parentElement.classList];
        const cartItemId = cartItems[1].split('product-number-');
        const uiCart = new UI();
        uiCart.displayCartItems(productIdentifier(cartItemId[1] ,false));
    }
    else{
        clicked.querySelector('.add-to-cart-btn').textContent = 'Add to cart';
    }
}
function productIdentifier(id , objOrHtml = true){
    let theElement;
    if(objOrHtml)
    {
        const allprods = Array.from(productsWrapper.children);
        allprods.forEach (element =>{
            const classLists = [...element.classList];
            const idClass = classLists[1].split('product-number-');
            if(idClass[1] == id)
            {
                theElement =  element;
            } 
        });
    }
    else{
        const allprods = new Products();
        const allProdsData = allprods.getProducts();
        allProdsData.forEach(element =>{
            // console.log(element.id , id)

            if(element.id == id)
            {
                // console.log(element)
                theElement = element;
            }
        })
    }
    // console.log(theElement)
    return theElement;
}
function openProductModal(obj){
    const modalDiv = document.createElement('div');
    modalDiv.classList.add('products-details');
    const moalDivContent = `<img src="${obj.imageUrl}" />
    <div>
        <span>name : </span>
        <span>${obj.title}</span>
    </div>
    <div>
        <span>price : </span>
        <span>${obj.price}$</span>
    </div>
    <p>${obj.description}</p>
</div>
`;
    modalDiv.innerHTML = moalDivContent;
    productModal.appendChild(modalDiv);
    productModal.style.display = "flex";
    productModal.style.transform = "scale(1)";
}
function closeProdModal(){
    productModal.style.display = "none";
    productModal.style.transform = "scale(0)";
    productModal.querySelector('.products-details').remove();
}
function buttonText(arr){
    arr.forEach(id =>{
        const clicked = productIdentifier(id)
        clicked.querySelector('.add-to-cart-btn').textContent = 'Added to cart';
    })
}
// function addToLocal(array){
//     array.forEach(element =>{
        
//     })
// }
// functions to write
// product counts nad price modifiactions
// product details shower
// local storage
// 