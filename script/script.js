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
                let add = 1;
                // Add span with text color white
                const amount = $('<span>1</span>').attr({style: 'color: white;', id: 'quantity'});
                console.log(amount.text())
                const button = $(this);
                // Add increment button
                const increment = $('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>')
                .addClass('increment')
                .on('click', addToCart(div[i], amount.text()));
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
            // div[i].onclick = function() {
            //     // Add span with text color white
            //     const amount = $('<span>1</span>').attr('style', 'color: white;');
            //     const button = $(this);
            //     // Add increment button
            //     const increment = $('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>')
            //     .addClass('increment')
            //     // .on('click', addToCart(amount));
            //     // Add decrement button
            //     const decrement = $('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>')
            //     .addClass('decrement')
            //     // .on('click', updateCart());
            //     button.text("");
            //     button.append(decrement);
            //     button.append(amount);
            //     button.append(increment);
            //     // Toggles the class add cart button and cart quantity button
            //     button.removeClass('add-cart-btn');
            //     button.addClass('cart-quantity-btn');
            //     console.log(button)
            // }
        }
    }

    function addToCart(item, quantity) {
        const div = $('<div></div>');
        const itemName = $(item).find('#itemName').text();
        const itemPrice = $(item).find('#itemPrice').text();
        const title = $('<p></p>').text(itemName);
        // const itemQuantity = $(item).find()
        const itemDetail = $('<p></p>');
        const currentItemPrice = $('<span></span>').text(`${itemPrice}`);
        const amount = $('<span></span>').text(`${quantity}x`);
        const totalPrice = $('<span></span>').text(`$${(parseInt(itemPrice.slice(1)) * quantity).toFixed(2)}`);
        const cart = $('#cart').attr('id', itemName);

        // Add spans into itemDetail paragraph
        itemDetail.append(amount);
        itemDetail.append(currentItemPrice);
        itemDetail.append(totalPrice);

        // Remove image and p
        cart.empty();

        // Add into div
        div.append(title);
        div.append(itemDetail);

        // Add div item to cart
        cart.append(div);
    }

   

    async function main() {
        const data = await fetchData();
        displayItems(data);
        clicking()
    }
    
    main()


}