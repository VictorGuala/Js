// - HTML - DOM - //

let productsDOM = document.getElementsByClassName("products") 
let addButtonDOM = document.getElementsByClassName("addButton") 

// Carrito - Array de productos JSON //
let buyCart = []
let productsArr = []

const fetchProducts = async () => {
    try {
        const res = await fetch('./data/products.json')
        const data = await res.json()
        for (i=0; i<data.length; i++){
            productsArr.push(data[i])
            productsDOM[i].children[1].textContent = productsArr[i].name
            productsDOM[i].children[2].textContent = `$` + productsArr[i].price
        }
    } catch (error) {
        console.log(error)
    }
}

fetchProducts()

// Acciones //

for (button of addButtonDOM) {
    button.addEventListener("click", addCart)
}

$("#showCart").on("click", showCart)

$("#removeCart").on("click", emptyCart)

let counterHTML = document.createElement("h3")
counterHTML.innerHTML = " (" + buyCart.length + ") "
$("#counter").append(counterHTML)


// API - Clima //

navigator.geolocation.getCurrentPosition(mostrarGeo)
function mostrarGeo(position){
    var lat = position.coords.latitude
    var long = position.coords.longitude
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/weather',
        type: 'GET',
        data: {
            lat: lat,
            lon: long,
            appid: 'f08969ce7afd98e3b62850ecee404a35',
            dataType: 'jsonp',
            units: 'metric'
        },
        success: function (data) {
            let icono = data.weather[0].icon
            let iconoURL = 'https://openweathermap.org/img/w/' + icono + ".png"
            $('#icono').attr("src", iconoURL)
            $('#weather').append(`<p>${data.name} - ${data.weather[0].main}  -  ${data.main.temp_max}º</p>`)
        }
    })
}

// FUNCIONES //

function addCart (e) {
    let targetId = e.target.id

    let itemInput = document.getElementsByClassName("itInput")

    for (i=0; i<buyCart.length; i++){
        if (buyCart[i].id === targetId) {
            let inputValue = itemInput[i]
            inputValue.value++
            buyCart[i].quantity++
            cartTotal()
            return null;
        }
    }

    buyCart.push(productsArr[targetId])
    renderCart(targetId)
    updateContent(targetId)
    animateBuy()
}

function renderCart(targetId) {
    let carritoHTML = document.createElement("li")
    carritoHTML.innerHTML = `<input type="counter" class="itInput" style="width: 20px; text-align: center;" value="${productsArr[targetId].quantity}">`+ " - " + productsArr[targetId].name + " - " + " $" + productsArr[targetId].price 
    $("#cart").append(carritoHTML)
    cartTotal()
}

function cartTotal(){
    let total = 0;
    let itemCartTotal = document.getElementById("total")
    buyCart.forEach((Product)=> {
        const precio = Product.price
        total = total + precio * Product.quantity
    })
    itemCartTotal.innerHTML = `TOTAL= $${total}`
    storageCart()
}

function storageCart(){
    sessionStorage.setItem("buyCart", JSON.stringify(buyCart))
}

window.onload = function(){
    let sStorage = JSON.parse(sessionStorage.getItem('buyCart'));
    if (sStorage !== null){
        for (i=0; i<sStorage.length; i++){
            buyCart.push(sStorage[i])
            let carritoHTML = document.createElement("li")
            carritoHTML.innerHTML = `<input type="counter" class="itemInput" style="width: 20px; text-align: center;" value="${sStorage[i].quantity}">`+ " - " + sStorage[i].name + " - " + " $" + sStorage[i].price 
            $("#cart").append(carritoHTML)
            cartTotal()
            updateContent()
        }
    }    
}

function updateContent () {
    counterHTML.innerHTML = " (" + buyCart.length + ") "
}

function animateBuy () {
    $("#alert").fadeIn()
               .delay(1000)
               .fadeOut() 
}

// Funcion que muestra el buyCart si es que tiene productos, quitando el display none que tiene por default
function showCart () {
    if (buyCart.length == 0) {
        $("#noCart").fadeIn()
        .delay(1000)
        .fadeOut() 
    } else {
        $("#cart").slideDown()
    }
}

function emptyCart () {
    $("#cart").hide("slow")
    $("#cart").html('')
    for (i=0; i<buyCart.length; i++){
        buyCart[i].quantity = 1
    }
    buyCart = []
    counterHTML.innerHTML = " (" + buyCart.length + ") "
    let itemCartTotal = document.getElementById("total")
    itemCartTotal.innerHTML = `TOTAL= $ 0`
    sessionStorage.clear()
}