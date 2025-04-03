async function loadProducts(sliderContainer) {
  const jsonFile = sliderContainer.getAttribute('data-json');

  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error(`Error loading JSON: ${response.statusText}`);

    const products = await response.json();
    const slider = sliderContainer.querySelector('.SdSlider');
    slider.innerHTML = '';

    Object.values(products).forEach(product => {
      const card = document.createElement('div');
      card.className = 'SdProductCard';
      card.innerHTML = `
        <div class="SdProductImageWrapper">
          <img src="${product.Image}" alt="${product.Name}" class="SdProductImage" />
        </div>
        <div class="SdProductDetails">
          <h3 class="SdProductName">${product.Name}</h3>
        </div>
      `;

      card.addEventListener('click', () => openModal(product));
      slider.appendChild(card);
    });

    initSlider(sliderContainer);

    const sliderSection = sliderContainer.querySelector('.SdSliderSection');
    sliderSection?.classList.add('visible');

  } catch (error) {
    console.error(`Error:`, error);
  }
}

function openModal(product) {
  const modal = document.getElementById('productModal');
  modal.querySelector('.SdModalImage').src = product.Image;
  modal.querySelector('.SdModalProductName').textContent = product.Name;
  modal.querySelector('.SdModalDescription').textContent = product.Description;

  const priceElement = modal.querySelector('#productPrice');
  const quantityInput = modal.querySelector('#quantity');
  const basePrice = parseInt(product.Price);

  function updatePrice() {
    const quantity = parseInt(quantityInput.value);
    priceElement.textContent = (basePrice * quantity).toFixed(2);
  }

  quantityInput.value = 1;
  updatePrice();

  modal.querySelector('#increase').onclick = () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
    updatePrice();
  };

  modal.querySelector('#decrease').onclick = () => {
    if (parseInt(quantityInput.value) > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
      updatePrice();
    }
  };

  modal.querySelector('.SdModalAvailability').textContent = "В наявності";
  modal.querySelector('.SdModalAvailability').classList.add('in-stock');

  modal.style.display = 'flex';

  modal.querySelector('.AddToCartBtn').onclick = () => {
    const quantity = parseInt(quantityInput.value);
    const totalPrice = basePrice * quantity;

    const cartItem = {
      name: product.Name,
      image: product.Image,
      price: basePrice,
      quantity: quantity,
      totalPrice: totalPrice
    };

    addToCart(cartItem);
    alert('Товар додано до кошика!');
    modal.style.display = 'none';
  };
}

function addToCart(cartItem) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cart.find(item => item.name === cartItem.name);

  if (existingItem) {
    existingItem.quantity += cartItem.quantity;
    existingItem.totalPrice += cartItem.totalPrice;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('productModal');

  if (modal) {
    modal.addEventListener('click', (e) => {
      console.log('Клік по:', e.target);
      if (e.target === modal || e.target.classList.contains('SdModalClose')) {
        console.log('Модальне вікно закривається');
        modal.style.display = 'none';
      }
    });
  }
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') modal.style.display = 'none';
});

function initSlider(sliderContainer) {
  const slider = sliderContainer.querySelector('.SdSlider');
  const pagination = sliderContainer.querySelector('.SdPagination');
  const leftArrow = sliderContainer.querySelector('.SdSliderArrow.left');
  const rightArrow = sliderContainer.querySelector('.SdSliderArrow.right');
  const sliderWrapper = sliderContainer.querySelector('.SdSliderWrapper') || sliderContainer;

  let currentIndex = 0;
  const totalSlides = slider.children.length;
  const totalDots = Math.ceil(totalSlides / 3);
  const slidesPerGroup = 3;

  function updateSlider() {
    const card = slider.querySelector('.SdProductCard');
    if (!card) return;

    const cardWidth = card.getBoundingClientRect().width;
    const cardMargin = parseInt(getComputedStyle(card).marginLeft) || 0;
    const scrollAmount = (cardWidth + cardMargin) * slidesPerGroup;
    let translateX = currentIndex * scrollAmount;

    const maxTranslateX = slider.scrollWidth - sliderWrapper.clientWidth;
    if (translateX > maxTranslateX) translateX = maxTranslateX;

    slider.style.transition = 'transform 1s ease';
    slider.style.transform = `translateX(-${translateX}px)`;

    const dots = sliderContainer.querySelectorAll('.SdDot');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  function setupDots() {
    if (pagination) {
      pagination.innerHTML = '';
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('span');
        dot.className = 'SdDot';
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateSlider();
        });
        pagination.appendChild(dot);
      }
    }
  }

  setupDots();

  leftArrow?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalDots) % totalDots;
    updateSlider();
  });

  rightArrow?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalDots;
    updateSlider();
  });

  updateSlider();
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.FirstContainer').forEach(sliderContainer => {
    loadProducts(sliderContainer);
  });
});