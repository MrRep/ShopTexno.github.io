// Функція для завантаження товарів
async function loadProducts(sliderContainer) {
  const jsonFile = sliderContainer.getAttribute('data-json');
  console.log(`Завантаження JSON-файлу: ${jsonFile}`);

  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error(`Помилка завантаження JSON (${response.status}): ${response.statusText}`);

    const products = await response.json();
    console.log(`JSON завантажено успішно:`, products);

    const slider = sliderContainer.querySelector('.SdSlider');
    if (!slider) {
      console.error("Помилка: Не знайдено контейнер '.SdSlider' у слайдері", sliderContainer);
      return;
    }
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

      // Відкриття модального вікна при кліку
      card.addEventListener('click', () => openModal(product));
      slider.appendChild(card);
    });

    initSlider(sliderContainer);

    // Обов'язково додаємо клас для показу секції
    const sliderSection = sliderContainer.querySelector('.SdSliderSection');
    if (sliderSection) {
      sliderSection.classList.add('visible');
    }

  } catch (error) {
    console.error(`Помилка завантаження товарів з ${jsonFile}:`, error);
  }
}

// Функція відкриття модального вікна
function openModal(product) {
  console.log("Відкриття модального вікна для:", product);

  const modal = document.getElementById('productModal');
  if (!modal) {
    console.error("Помилка: Не знайдено елемент '#productModal'");
    return;
  }

  modal.querySelector('.SdModalImage').src = product.Image;
  modal.querySelector('.SdModalProductName').textContent = product.Name;
  modal.querySelector('.SdModalPrice').textContent = `Ціна: ${product.Price}`;
  modal.querySelector('.SdModalDescription').textContent = product.Description;
  modal.style.display = 'flex';
}

// Закриття модального вікна
const modal = document.getElementById('productModal');
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('SdModalClose')) {
      modal.style.display = 'none';
    }
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') modal.style.display = 'none';
  });
} else {
  console.error("Помилка: Модальне вікно '#productModal' не знайдено у документі.");
}

// Функція ініціалізації слайдера
function initSlider(sliderContainer) {
  const slider = sliderContainer.querySelector('.SdSlider');
  if (!slider) return;

  const pagination = sliderContainer.querySelector('.SdPagination');
  const leftArrow = sliderContainer.querySelector('.SdSliderArrow.left');
  const rightArrow = sliderContainer.querySelector('.SdSliderArrow.right');

  const sliderWrapper = sliderContainer.querySelector('.SdSliderWrapper') || sliderContainer;

  let currentIndex = 0;
  const totalSlides = slider.children.length;
  const totalDots = Math.ceil(totalSlides / 3); // більш точний розрахунок
  const slidesPerGroup = 3; // фіксована кількість слайдів за один клік

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
