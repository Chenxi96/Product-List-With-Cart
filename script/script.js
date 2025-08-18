window.onload = () => {
    // Fetch json file from directory
    async function fetchData() {
        fetch('./data.json')
        .then(response => response.json()) // Converts JSON file
        .then(data => {
            // Loop through json object
            for(let item in data) {
                const div = $('<div></div>'); // Container
                const image = $(`<img />`).attr('src', data[item].image.mobile); // Image
                const button = $('<button>Add to Cart</button>') // Button
                const heading = $(`<h2>${data[item].category}</h2>`); // Heading
                const name = $(`<p>${data[item].name}</p>`); // Name
                const price = $(`<p>${data[item].price}</p>`); // Price
                // Add each elements in div element
                div.append(image);
                div.append(button);
                div.append(heading);
                div.append(name);
                div.append(price);
                // Add the div into main element
                $('main').append(div);

                /* Responsive Design:
                1. images has to be responsive with picture tag*/
            }
        })
        .catch(error => {
            console.log(error)
        });
    }

    fetchData();
}