document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cart-container');
  const totalSumElement = document.getElementById('total-sum');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout');

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Ваш кошик порожній!</p>";
      totalSumElement.textContent = '0£';
      return;
    }

    let totalSum = 0; 

    cart.forEach((item, index) => {
      totalSum += item.totalPrice;
      cartContainer.innerHTML += `
        <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>Ціна за одиницю: ${item.price}£</p>
            <div class="cart-item-quantity">
              <button onclick="changeQuantity(${index}, -1)">-</button>
              <input type="number" value="${item.quantity}" min="1" readonly>
              <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>
            <p><strong>Сума: ${item.totalPrice.toFixed(2)}£</strong></p>
          </div>
          <button class="remove-item" onclick="removeItem(${index})">&times;</button>
        </div>
      `;
    });

    totalSumElement.textContent = `${totalSum.toFixed(2)}£`;
  }

  window.changeQuantity = function(index, delta) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;

    cart[index].totalPrice = cart[index].price * cart[index].quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }

  window.removeItem = function(index) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }

  clearCartBtn.onclick = () => {
    if (confirm('Ви дійсно хочете очистити кошик?')) {
      localStorage.removeItem('cart');
      renderCart();
    }
  }

  checkoutBtn.onclick = () => {
    alert('Функція оформлення замовлення в розробці!');
  }

  renderCart();
});