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
            const button = $('<button>Add to Cart</button>').attr({class: 'add-cart-btn text-preset-4', id: `button-${data[item].name}`}) // Button
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
                // trigger an onclick when clicked on button
                const button = $(this).on('click', addToCart(div[i], amount.text()));
                // Add increment button
                const increment = $('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>')
                .addClass('increment')
                .on('click', function(event) {
                    // Prevents the button parent from triggering the onclick event
                    event.stopPropagation();

                    // Add +1 to the amount variable
                    const number = amount.text(parseInt(amount.text()) + 1)

                    // Call addToCart function with the parent div and the amount
                    addToCart(div[i], number.text())
                }) // when adding quantity run addToCart function with div element and the quantity amount
                // Add decrement button
                const decrement = $('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>')
                .addClass('decrement')
                .on('click', function(event) {
                    // Prevents the button parent from triggering the onclick event
                    event.stopPropagation();

                    const number = parseInt(parseInt(amount.text()) - 1);
                    // After deducting the amount by 1 if it's less or equal to 0 than
                    if(number <= 0) {
                        // Add Text and remove the previous icons
                        button.text("Add to Cart")
                        button.remove(decrement);
                        button.remove(amount);
                        button.remove(increment);

                        // Change the class name to default
                        button.addClass('add-cart-btn')
                        button.removeClass('cart-quantity-btn')
                    }
                    // Call this function with the parent element and current number after deduction
                    removeFromCart(div[i], number);
                });

                button.text(""); // Clear button text
                button.append(decrement); // Add decrement icon button
                button.append(amount); // Add amount
                button.append(increment); // Add increment icon button
                
                // Toggles the class add cart button and cart quantity button
                button.removeClass('add-cart-btn');
                button.addClass('cart-quantity-btn');
            }
        }
    }

    function getTotalAmount(totalPriceList) {
        let totalAmount = 0;
        for(let i=0; i<totalPriceList.length; i++) {
            totalAmount += parseFloat($(totalPriceList[i]).text().slice(1))
        }

        return totalAmount.toFixed(2)
    }

    function getCartAmount(totalPriceList) {
        let totalAmount = 0;
        for(let i=0; i<totalPriceList.length; i++) {
            totalAmount += parseInt($(totalPriceList[i]).text())

        }
        $('#cartAmount').text(parseInt(totalAmount));
    }

    function removeFromCart(item, currentQuantity) {
        const button = $(item).find('button')
        // select item name and price
        const itemName = $(item).find('#itemName').text();
        const itemPrice = $(item).find('#itemPrice').text();
        const totalPrice = $('[id=calculatedTotal]');
        // select cart div
        const cart = $('#cart');
        
        

        const cartAmount = $('span#cartAmount');

        // Button amount
        $(button).find('span#quantity').text(parseInt($(button).find('span#quantity').text()) - 1)

        cartAmount.text(parseInt(cartAmount.text()) - 1)

        // If quantity is less than or equal to 0
        if(currentQuantity <= 0) {
            $(`div[id="${itemName}"]`).remove(); // Remove the item in the cart
        }


        // Subtract the subtotal amount with the price of each item
        totalPrice.text(`$${(totalPrice.text().slice(1) - itemPrice.slice(1)).toFixed(2)}`);


        // If the price is 0 or less than add the default elements back in 
        if(parseFloat($('[id=calculatedTotal]').text().slice(1)) <= 0) {
            cart.addClass('cart');
            $('div#itemTotal').remove();
            cart.find('[id=emptyCart').attr('style', 'display: block;')
        }
    }

    function addToCart(item, quantity) {
        // select item name and price
        const itemName = $(item).find('#itemName').text();
        const itemPrice = $(item).find('#itemPrice').text();
        
        const div = $('<div></div>').attr('id', itemName);
        
        // Title of item
        const title = $('<p></p>').text(itemName).attr({id: itemName, style: 'margin: 16px 0 0 0;'});

        // container for the span elements
        const divWrapper = $('<div></div>').addClass('wrapper')
        const itemDetail = $('<p></p>').attr('class', 'cartDescription');

        // Span color and style for the item price
        const currentItemPrice = $('<span></span>').text(`@ ${itemPrice}`).attr({id: `currentPrice-${itemName}`, class: 'text-preset-4', style: 'color: var(--rose-500)'});

        // span color and style for the amount
        const amount = $('<span></span>').text(`${quantity}x`).attr({id: `amount-${itemName}`, style: 'color: var(--red);', class: 'text-preset-4'});

        const totalPrice = $('<span></span>').text(`$${(parseFloat(itemPrice.slice(1)) * quantity).toFixed(2)}`).attr({id: `totalPrice-${itemName}`, class: 'text-preset-5', style: 'color: var(--rose-500)'}); // Item's price * quantity
        const deleteButton = $('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>')
        .addClass('deleteButton');
        
        const confirmOrderDiv = $('<div></div>').attr('id', 'itemTotal');
        const orderTotalDiv = $('<div></div>').attr({class: 'orderTotalContainer'});
        const orderTotal = $('<p class="text-preset-4" style="color: var(--rose-900);">Order Total</p>');
        const calculatedTotal = $('<p></p>').attr({id: 'calculatedTotal', class: 'text-preset-2'})
        const deliveryCommentDiv = $('<div></div>').attr('style', 'display: flex; justify-content: center; background-color: var(--rose-50); margin: 24px 0; border-radius: 8px;');
        const deliveryComment = $(`<p>This is a <span class=text-preset-5 style=color:var(--rose-900); >carbon-neutral</span> delivery</p>`).attr('id', 'deliveryComment');
        const confirmButton = $('<button>Confirm Order</button>').attr({id: 'submitButton', class: 'confirmButton text-preset-3'});
        

        // select cart div
        const cart = $('#cart');

        confirmButton.on('click', function(event) {
            // Have onclick with only the confirm order button
            event.stopPropagation();
            // When clicked scroll the page to the top
            $(window).scrollTop(0)

            $('body').addClass('modal-open')

            // Call the Order detail modal to the page
            submitOrder(cart);
        })
        
        let listOfPrices;

        if(cart.find('div').length < 1) {
            // Remove image and p
            cart.find('[id=emptyCart').attr('style', 'display: none;')
        }
        
        // if there's a div with the item name
        if((cart.find(`div[id="${itemName}"]`).length > 0)) {
            listOfPrices = cart.find('[id^="totalPrice"]');
            // Add spans into itemDetail paragraph
            $(`[id="amount-${itemName}"]`).text(`${quantity}`);
            $(`[id="currentPrice-${itemName}"]`).text(`@${itemPrice}`);
            $(`[id="totalPrice-${itemName}"]`).text(`$${(parseFloat(itemPrice.slice(1)) * quantity).toFixed(2)}`);
            
            $('[id=calculatedTotal]').text(`$${getTotalAmount(listOfPrices)}`);
            getCartAmount(cart.find('[id^=amount]'));
        } else { // If there isn't a div with item name
            cart.removeClass('cart')
            $('[id=emptyCart]').attr('style', 'display: none;');

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

            // Add the confirm Order elements
            orderTotalDiv.append(orderTotal)
            orderTotalDiv.append(calculatedTotal)

            // Add comment for delivery info
            deliveryCommentDiv.append(deliveryComment)

            // Construct all element into main div
            confirmOrderDiv.append(orderTotalDiv)
            confirmOrderDiv.append(deliveryCommentDiv)
            confirmOrderDiv.append(confirmButton)

            // Add div item to cart
            cart.append(div);

            // if there's not itemTotal div
            if(cart.find('div[id=itemTotal]').length < 1) {
                cart.append(confirmOrderDiv);
            } else {
                // Moves the #itemTotal div before the div
                cart.find('#itemTotal').before(div);
            }

            // Initialize listOFPrices with totalPrice element
            listOfPrices = cart.find('[id^="totalPrice"]');
            
            // Set the total for items
            $('[id=calculatedTotal]').text(`$${getTotalAmount(listOfPrices)}`);
            getCartAmount(cart.find('[id^=amount]'));
        }
        // Click event to run the delete from cart function
        deleteButton.on('click', function(event) {
            event.stopPropagation();
            deleteCartItem(itemName)
        })
        
    }

    function deleteCartItem(name) {
        const itemButton = $(`button[id="button-${name}"]`)
        const increment = itemButton.find('svg.increment')
        const decrement = itemButton.find('svg.decrement')
        const amountText = itemButton.find('span#quantity')

        // Changed current cart amount
        const currentCart = $(`span#cartAmount`)
        currentCart.text(parseInt(currentCart.text()) - parseInt(amountText.text()))

        const cartItemDetail = $(`div[id="${name}"]`)

        const calculatedTotal = $('p#calculatedTotal')
        const itemTotal = $(`span[id="totalPrice-${name}"]`)

        calculatedTotal.text(parseFloat(calculatedTotal.text().slice(1)) - parseFloat(itemTotal.text().slice(1)))

        if(parseFloat(calculatedTotal.text()) <= 0) {
            $('div.orderTotalContainer').remove()
            $('div#itemTotal').remove()

            $('#cart').addClass('cart')
           $('[id=emptyCart]').attr('style', 'display: block;');
        }

        itemButton.text("Add to Cart")
        increment.remove();
        decrement.remove();
        amountText.remove();

        cartItemDetail.remove();

        itemButton.addClass('add-cart-btn')
        itemButton.removeClass('cart-quantity-btn')
    }

    // Declared function to submit order
    async function submitOrder(cart) {
        const mainElement = $('main') // Select the main tag element
        // Created elements
        const modalContainer = $('<div></div>').attr('class', 'orderSubmitContainer');
        const modalWrapper = $('<div></div>').attr('class', 'orderSubmitWrapper')
        const h2Element = $('<h2>Order Confirmed</h2>').attr({class: 'text-preset-1', style: 'color: var(--rose-900); margin: 24px 0 8px 0;'})
        const pElement = $('<p>We Hope You Enjoyed Your Food!</p>').attr({class: 'text-preset-4', style: 'color: var(--rose-500); margin-bottom: 32px'})
        const cartContainer = $('<div></div>')
        // Use to save the total amount
        let totalAmounts = 0;
        // Call function to retrieve json data
        const data = await fetchData();

        // Loop through the JSON data
        for(let item of data) {
            console.log(item)
            const cartItem = cart.find(`div[id="${item.name}"]`);
            const title = $(cartItem).find(`[id="${item.name}"]`);
            const amount = $(cartItem).find(`[id="amount-${item.name}"]`);
            const currentPrice = $(cartItem).find(`[id="currentPrice-${item.name}"]`);
            const totalPrice = $(cartItem).find(`[id="totalPrice-${item.name}"]`)

            const itemContainer = $('<div id="item-container" style="background-color: var(--rose-50); padding: 0 24px; border-radius: 8px 8px 0 0"></div>')
            if(amount.length > 0 || currentPrice.length > 0 || totalPrice > 0) {

                const itemWrapper = $(` <div style="display:flex; justify-content: space-between; padding-bottom:24px; border-bottom: 1px solid var(--rose-100)" >
                                            <div style="display: flex; column-gap: 16px;">
                                                <img style="position: relative; top: calc(100% - 48px);" src=${item.image.thumbnail} height=48 width=48 ></img>
                                                <div>
                                                    <h3 class="text-preset-5">${title.text()}</h3>
                                                    <div style="display:flex; column-gap: 8px;">
                                                        <p class=text-preset-5 style="color:var(--red); margin: 0;">${amount.text()}</p>
                                                        <p class=text-preset-4 style="color:var(--rose-500); margin: 0;">${currentPrice.text()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <p class=text-preset-3 style=align-self:center; >${totalPrice.text()}</p>
                                            
                                        </div>`);
                totalAmounts += parseFloat(totalPrice.text().slice(1))
                itemContainer.append(itemWrapper)
            } else {
                continue;
            }

            cartContainer.append(itemContainer);
        }
        // Declared variable to display html element as Jquery object
        const totalAmount = $(` <div style="display:flex; justify-content: space-between; align-items: center; background-color: var(--rose-50); padding: 24px 24px; margin-top: -1px; border-top: 1px solid var(--rose-100); border-radius: 0 0 8px 8px">
                                                <p class="text-preset-4">Order Total</p>
                                                <p class="text-preset-2">$${totalAmounts.toFixed(2)}</p>
                                        </div>`);

        // Add the object into the cartContainer
        cartContainer.append(totalAmount);

        // Declared variable with a Jquery button
        const newOrderButton = $('<button class="confirmButton" style="margin-top: 32px;">Start New Order</button>');

        // click event on the button to reload the page
        newOrderButton.on('click', function() {
            location.reload()
        })
        
        cartContainer.append(newOrderButton)

        // Shift the modal to the page
        modalContainer.attr('style', 'left: 0;')

        modalWrapper.append(h2Element);
        modalWrapper.append(pElement);
        modalWrapper.append(cartContainer);
        modalContainer.append(modalWrapper);
        mainElement.append(modalContainer);
    }
   

   

    async function main() {
        const data = await fetchData();
        displayItems(data);
        clicking();
    }
    
    main()

}