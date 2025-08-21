window.onload = () => {
    // Fetch json file from directory
    async function fetchData() {
        fetch('./data.json')
        .then(response => response.json()) // Converts JSON file
        .then(data => {
            const itemDiv = $('<div></div>').attr('id', "item");
            for(let item in data) {
                const div = $('<div></div>'); // Container
                const picture = $('<picture></picture>') // Picture element
                const desktopSource = $('<source>').attr({media: '(min-width: 768px)', srcset: data[item].image.desktop}) // Desktop image
                const tabletSource = $('<source>').attr({media: '(min-width: 375px)', srcset: data[item].image.tablet}) // Tablet image
                const image = $(`<img />`).attr({src: data[item].image.mobile, style: 'max-width:100%'}); // Image
                const button = $('<button>Add to Cart</button>').attr('class', 'add-cart-btn text-preset-4') // Button
                const heading = $(`<h2>${data[item].category}</h2>`).attr({class: 'text-preset-4', style: 'color: var(--rose-500); margin: -12px 0 0 0;'}); // Heading
                const name = $(`<p>${data[item].name}</p>`).attr({class: 'text-preset-3', style: 'color: var(--rose-900); margin: 4px 0;'}); // Name
                const price = $(`<p>$${data[item].price.toFixed(2)}</p>`).attr({class: 'text-preset-3', style: 'color: var(--red); margin: 0;'}); // Price

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
        })
        .catch(error => {
            console.log(error)
        });
    }

    fetchData();
}