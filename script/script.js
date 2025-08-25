window.onload = () => {
    // Fetch json file from directory
    async function fetchData() {
        const response = await fetch('./data.json')
        return response.json()
        .catch(error => {
            console.log(error)
        });
    }
    // Displays the dessert items into the browser
    function displayItems(data) {
        const itemDiv = $('<div></div>').attr('id', "item");
        for(let item in data) {
            const div = $('<div></div>').attr('class', 'product-item'); // Container
            const picture = $('<picture></picture>') // Picture element
            const desktopSource = $('<source>').attr({media: '(min-width: 768px)', srcset: data[item].image.desktop}) // Desktop image
            const tabletSource = $('<source>').attr({media: '(min-width: 375px)', srcset: data[item].image.tablet}) // Tablet image
            const image = $(`<img />`).attr({src: data[item].image.mobile, style: 'max-width:100%'}); // Image
            const button = $('<button>Add to Cart</button>').attr('class', 'add-cart-btn text-preset-4') // Button
            const heading = $(`<h2>${data[item].category}</h2>`).attr({class: 'text-preset-4', style: 'color: var(--rose-500); margin: -12px 0 0 0;'}); // Heading
            const name = $(`<p>${data[item].name}</p>`).attr({class: 'text-preset-3', style: 'color: var(--rose-900); margin: 4px 0;', id: 'itemName'}); // Name
            const price = $(`<p>$${data[item].price.toFixed(2)}</p>`).attr({class: 'text-preset-3', style: 'color: var(--red); margin: 0;', id: 'itemPrice'}); // Price

            // Add each elements in div element
            picture.append(desktopSource)
            picture.append(tabletSource)
            picture.append(image)
            div.append(picture);
            div.append(button);
            div.append(heading);
            div.append(name);
            div.append(price);
            itemDiv.append(div);

            // Add the div into main element
            $('h1').after(itemDiv);
        }
    }


    function clicking() {
        const div = $('.product-item'); // Selects div's button
        // Loops through div buttons
        for(let i=0; i<div.length; i++) {
            const button = $('button')
            button[i].onclick = function() {
                // Add span with text color white
                const amount = $('<span>1</span>').attr({style: 'color: white;', id: 'quantity'});

                const button = $(this).on('click', addToCart(div[i], amount.text()));
                // Add increment button
                const increment = $('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>')
                .addClass('increment')
                .on('click', function(event) {
                    event.stopPropagation();
                    const number = amount.text(parseInt(amount.text()) + 1)
                    addToCart(div[i], number.text())
                }) // when adding quantity run addToCart function with div element and the quantity amount
                // Add decrement button
                const decrement = $('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>')
                .addClass('decrement')
                // .on('click', updateCart());
                button.text("");
                button.append(decrement);
                button.append(amount);
                button.append(increment);
                // Toggles the class add cart button and cart quantity button
                button.removeClass('add-cart-btn');
                button.addClass('cart-quantity-btn');
            }
        }
    }

    function addToCart(item, quantity) {
        console.log(quantity)
        // select item name and price
        const itemName = $(item).find('#itemName').text();
        const itemPrice = $(item).find('#itemPrice').text();
        
        const div = $('<div></div>').attr('id', itemName);
        
        // Title of item
        const title = $('<p></p>').text(itemName).attr({id: itemName, style: 'margin: 0;'});

        // container for the span elements
        const divWrapper = $('<div></div>').addClass('wrapper')
        const itemDetail = $('<p></p>').attr('class', 'cartDescription');

        // Span color and style for the item price
        const currentItemPrice = $('<span></span>').text(`@ ${itemPrice}`).attr({id: `currentPrice-${itemName}`, class: 'text-preset-4', style: 'color: var(--rose-500)'});

        // span color and style for the amount
        const amount = $('<span></span>').text(`${quantity}x`).attr({id: `amount-${itemName}`, style: 'color: var(--red);', class: 'text-preset-4'});

        const totalPrice = $('<span></span>').text(`$${(parseInt(itemPrice.slice(1)) * quantity).toFixed(2)}`).attr({id: `totalPrice-${itemName}`, class: 'text-preset-5', style: 'color: var(--rose-500)'}); // Item's price * quantity
        const deleteButton = $('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>')
        .addClass('deleteButton');
    

        // select cart div
        const cart = $('#cart');

        console.log((cart.find(`div[id="${itemName}"]`)[0]), itemName)

        if(cart.find('div').length < 1) {
            // Remove image and p
            cart.empty();
        }
        
        // if there's a div with the item name
        if((cart.find(`div[id="${itemName}"]`).length > 0)) {

            // Add spans into itemDetail paragraph
            $(`[id="amount-${itemName}"]`).text(`${quantity}`);
            $(`[id="currentPrice-${itemName}"]`).text(`@${itemPrice}`);
            $(`[id="totalPrice-${itemName}"]`).text(`$${(parseInt(itemPrice.slice(1)) * quantity).toFixed(2)}`);

        } else { // If there isn't a div with item name
            cart.removeClass('cart')
            // Add spans into itemDetail paragraph
            itemDetail.append(amount);
            itemDetail.append(currentItemPrice);
            itemDetail.append(totalPrice);

            // Add all elements into div wrapper
            divWrapper.append(itemDetail);
            divWrapper.append(deleteButton);
            
            // Add into div
            div.append(title);
            div.append(divWrapper);
            
            // Add div item to cart
            cart.append(div);
        }
        
    }

   

    async function main() {
        const data = await fetchData();
        displayItems(data);
        clicking()
    }
    
    main()


}