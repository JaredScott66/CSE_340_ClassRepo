const range_value = document.querySelector("#priceValue");
const input = document.querySelector("#priceRanger");

range_value.textContent = input.value
input.addEventListener("input", (event) => {


    range_value.textContent = `$10,000 to $${event.target.value}`;
});
