const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.getElementById('total-price');
const clearCartBtn = document.getElementById('clear-cart');

// Початковий масив товарів
let cart = [
  { name: 'Футболка', price: 450, quantity: 1 },
];

// Оновлюємо відображення кошика
function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, idx) => {
    total += item.price * item.quantity;

    const itemEl = document.createElement('div');
    itemEl.classList.add('item-card');
    itemEl.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-price">${item.price} грн</span>
      <div class="item-quantity">
        <button class="quantity-minus" onclick="updateQuantity(${idx}, -1)">–</button>
        <span class="quantity">${item.quantity}</span>
        <button class="quantity-plus" onclick="updateQuantity(${idx}, 1)">+</button>
      </div>
      <button class="remove-item" onclick="removeItem(${idx})">Видалити</button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  totalPriceElement.textContent = total;
}

// Змінюємо кількість
window.updateQuantity = function(idx, change) {
  cart[idx].quantity += change;
  if (cart[idx].quantity < 1) cart[idx].quantity = 1;
  renderCart();
}

// Видалення товару
window.removeItem = function(idx) {
  cart.splice(idx, 1);
  renderCart();
}

// Очищення кошика
clearCartBtn.onclick = () => {
  cart = [];
  renderCart();
};

// Додавання нового товару (приклад)
function addItem(name, price) {
  const existing = cart.find(el => el.name === name);
  if (existing) existing.quantity++;
  else cart.push({ name, price, quantity: 1 });
  renderCart();
}

// Початковий виклик для відображення
renderCart();