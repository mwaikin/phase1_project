document.addEventListener('DOMContentLoaded', () => {
    const carsContainer = document.getElementById("cars");
    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("searchButton");
    const addCarForm = document.getElementById("addCarForm"); // Added
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("total");
    const cartItems = [];

    // Function to fetch cars data from the server
    function fetchCars() {
        fetch("db.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayCars(data.cars);
            })
            .catch(error => console.log(error));
    }

    // Function to display cars data
    function displayCars(cars) {
        carsContainer.innerHTML = ""; // Clear previous data
        cars.forEach(car => {
            const card = document.createElement("div");
            card.classList.add("card");

            const image = document.createElement("img");
            image.src = car.image;
            image.alt = car.brand + " " + car.model;
            card.appendChild(image);

            const details = document.createElement("div");
            details.classList.add("details");
            details.innerHTML = `
                <h2>${car.brand} ${car.model}</h2>
                <p>Category: ${car.category}</p>
                <p>Model Year: ${car.modelYear}</p>
                <p>Mileage: ${car.mileage}</p>
                <p>Fuel Type: ${car.fuelType}</p>
                <p>Seats: ${car.seats}</p>
                <p>Price: ${car.price}</p>
                <p>Availability: ${car.availability ? "Available" : "Not Available"}</p>
                <p>Description: ${car.description}</p>
            `;

            const addToCartButton = document.createElement("button");
            addToCartButton.textContent = "Add to Cart";
            addToCartButton.addEventListener("click", () => addToCart(car));
            details.appendChild(addToCartButton);

            card.appendChild(details);
            carsContainer.appendChild(card);
        });
    }

    // Function to add a car to the cart
    function addToCart(car) {
        cartItems.push(car);
        displayCart();
        updateTotal();
    }

    // Function to display the cart items
    function displayCart() {
        cartItemsContainer.innerHTML = ""; // Clear previous items
        cartItems.forEach(item => {
            const cartItem = document.createElement("li");
            cartItem.textContent = `${item.brand} ${item.model} - ${item.price}`;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    // Function to update the total amount
    function updateTotal() {
        const total = cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
        cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    }

    // Function to search cars by name or ID
    function searchCars(term) {
        fetch("db.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const filteredCars = data.cars.filter(car => {
                    const fullName = car.brand.toLowerCase() + " " + car.model.toLowerCase();
                    return fullName.includes(term.toLowerCase()) || car.category.toLowerCase().includes(term.toLowerCase());
                });
                displayCars(filteredCars);
                
                // Automatically add the first matching car to the cart
                if (filteredCars.length > 0) {
                    addToCart(filteredCars[0]);
                }
            })
            .catch(error => console.log(error));
    }

    // Event listener for search input
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== "") {
            searchCars(searchTerm);
        } else {
            fetchCars();
        }
    });

    // Event listener for search button
    searchButton.addEventListener("click", () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== "") {
            searchCars(searchTerm);
        } else {
            fetchCars();
        }
    });

    // Event listener for form submission
    addCarForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form submission

        // Retrieve form values
        const brand = document.getElementById("brand").value;
        const model = document.getElementById("model").value;
        const price = document.getElementById("price").value;
        const category = document.getElementById("category").value;
        const carsleft = document.getElementById("carsleft").value;

        // Create a new car object
        const newCar = {
            brand: brand,
            model: model,
            price: price,
            category: category,
            carsleft: carsleft
        };

        // Send a POST request to add the new car
        fetch("addCarEndpoint", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newCar)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("New car added successfully:", data);
            fetchCars(); // Fetch and display the updated list of cars
        })
        .catch(error => console.error("Error adding new car:", error));
    });

    // Fetch and display cars initially
    fetchCars();
});
