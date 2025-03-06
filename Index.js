document.addEventListener("DOMContentLoaded", function () {
  /* ======================================================================
     1. Перемикання меню та елемента чату при скролі
  ====================================================================== */
  window.addEventListener("scroll", function () {
    const productsSection = document.getElementById("products");
    if (!productsSection) return;
    const rect = productsSection.getBoundingClientRect();

    if (rect.top <= 0) {
      // Ховаємо старе меню, показуємо нове та елемент чату
      document.querySelector(".old-nav").classList.remove("visible");
      document.querySelector(".old-nav").classList.add("hidden");

      document.querySelector(".new-nav").classList.remove("hidden");
      document.querySelector(".new-nav").classList.add("visible");

      document.querySelector(".cart-chat").classList.remove("hidden");
      document.querySelector(".cart-chat").classList.add("visible");
    } else {
      // Показуємо старе меню, ховаємо нове та елемент чату
      document.querySelector(".old-nav").classList.remove("hidden");
      document.querySelector(".old-nav").classList.add("visible");

      document.querySelector(".new-nav").classList.remove("visible");
      document.querySelector(".new-nav").classList.add("hidden");

      document.querySelector(".cart-chat").classList.remove("visible");
      document.querySelector(".cart-chat").classList.add("hidden");
    }
  });

  /* ======================================================================
     2. Розширений пошук (підказки за категоріями)
  ====================================================================== */
  const categories = [
    "Ноутбуки",
    "Материнські плати",
    "Відеокарти",
    "Процесори",
    "Оперативна пам'ять",
    "SSD",
    "HDD",
    "Кулери",
    "Водяне охолодження",
    "Блоки живлення",
    "Корпуси",
    "Монітори",
    "Проводи",
    "Кранштейни",
    "Коврики для миші",
    "Мікрофони",
    "Веб-камери",
    "Навушники",
    "Принтери",
    "Миші",
    "Клавіатури",
  ];

  const searchInput = document.getElementById("searchInput");
  const suggestionsContainer = document.querySelector(".search-suggestions");
  const suggestionsList = document.getElementById("suggestionsList");

  if (searchInput && suggestionsContainer && suggestionsList) {
    searchInput.addEventListener("focus", () => {
      suggestionsContainer.classList.add("show");
      updateSuggestions("");
    });

    searchInput.addEventListener("blur", () => {
      setTimeout(() => {
        suggestionsContainer.classList.remove("show");
      }, 150);
    });

    searchInput.addEventListener("input", (e) => {
      const userInput = e.target.value.trim().toLowerCase();
      updateSuggestions(userInput);
    });

    function updateSuggestions(userInput) {
      let filtered = [];
      if (userInput) {
        filtered = categories.filter((cat) =>
          cat.toLowerCase().startsWith(userInput)
        );
      } else {
        filtered = categories;
      }
      if (filtered.length === 0) {
        suggestionsList.innerHTML = `<li><a style="opacity:0.6;">Нема результатів</a></li>`;
        return;
      }
      const html = filtered
        .map((item) => `<li><a href="#">${item}</a></li>`)
        .join("");
      suggestionsList.innerHTML = html;
    }
  }

  /* ======================================================================
     3. Слайдер та взаємодія з картками товарів
  ====================================================================== */
  // Функція ініціалізації слайдера для конкретного контейнера
  function initSlider(sliderContainer) {
    const sliderSection = sliderContainer.querySelector('.SdSliderSection');
    const slider = sliderContainer.querySelector('.SdSlider');
    const dots = sliderContainer.querySelectorAll('.SdDot');
    const leftArrow = sliderContainer.querySelector('.SdSliderArrow.left');
    const rightArrow = sliderContainer.querySelector('.SdSliderArrow.right');
    let currentIndex = 0;

    // Функція оновлення трансформації слайдера та активного стану точок
    function updateSlider() {
      // Приклад трансформації: кожен слайд займає 20% ширини контейнера (налаштуйте за потребою)
      slider.style.transform = `translateX(-${currentIndex * 20}%)`;
      dots.forEach(d => d.classList.remove('active'));
      if (dots[currentIndex]) {
        dots[currentIndex].classList.add('active');
      }
    }

    // Обробка кліків по навігаційним точкам
    dots.forEach(dot => {
      dot.addEventListener('click', function (e) {
        currentIndex = parseInt(e.target.getAttribute('data-index'));
        updateSlider();
      });
    });

    // Обробка кліків по стрілках
    if (leftArrow) {
      leftArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      });
    }

    if (rightArrow) {
      rightArrow.addEventListener('click', () => {
        if (currentIndex < dots.length - 1) {
          currentIndex++;
          updateSlider();
        }
      });
    }

    // IntersectionObserver для плавного появи слайдера при скролі
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sliderSection.classList.add('visible');
          observer.unobserve(sliderSection);
        }
      });
    }, { threshold: 0.2 });

    if (sliderSection) {
      observer.observe(sliderSection);
    }

    // Фолбек: якщо через 2 секунди клас 'visible' не додано, додаємо його вручну
    setTimeout(() => {
      if (!sliderSection.classList.contains('visible')) {
        sliderSection.classList.add('visible');
      }
    }, 2000);
  }

  // Ініціалізуємо кожен слайдер, який має клас .FirstContainer
  const sliderContainers = document.querySelectorAll('.FirstContainer');
  sliderContainers.forEach(container => {
    // Переконайтеся, що контейнер має елемент слайдера
    if (container.querySelector('.SdSliderSection')) {
      initSlider(container);
    }
  });

  /* ======================================================================
     4. Модальне вікно для Quick View
  ====================================================================== */
  const productCards = document.querySelectorAll('.SdProductCard');
  const modal = document.getElementById('SdModal');
  const modalClose = document.querySelector('.SdModalClose');
  productCards.forEach(card => {
    card.addEventListener('click', function (e) {
      // Якщо натиснута кнопка "Додати до кошика", не відкривати модальне вікно
      if (e.target.classList.contains('SdAddToCartBtn')) return;
      const productName = card.querySelector('.SdProductName')
        ? card.querySelector('.SdProductName').textContent
        : 'Product';
      const productInfo = card.querySelector('.SdProductPrice')
        ? card.querySelector('.SdProductPrice').textContent
        : '';
      modal.querySelector('.SdModalProductName').textContent = productName;
      modal.querySelector('.SdModalProductInfo').textContent = productInfo;
      modal.style.display = 'block';
    });
  });

  modalClose.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  /* ======================================================================
     5. Обробка кліків по кнопці "Додати до кошика"
  ====================================================================== */
  const cartIcon = document.querySelector('.cart-icon');
  let cartCount = 0;
  const addToCartButtons = document.querySelectorAll('.SdAddToCartBtn');
  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); // Запобігаємо відкриттю модального вікна при кліку на кнопку
      const card = btn.closest('.SdProductCard');
      card.classList.add('SdShake');
      setTimeout(() => {
        card.classList.remove('SdShake');
      }, 500);
      cartCount++;
      let countBadge = cartIcon.querySelector('.SdCartCount');
      if (!countBadge) {
        countBadge = document.createElement('span');
        countBadge.classList.add('SdCartCount');
        countBadge.style.position = 'absolute';
        countBadge.style.top = '-5px';
        countBadge.style.right = '-5px';
        countBadge.style.background = 'red';
        countBadge.style.color = 'white';
        countBadge.style.borderRadius = '50%';
        countBadge.style.padding = '2px 6px';
        countBadge.style.fontSize = '12px';
        cartIcon.appendChild(countBadge);
      }
      countBadge.textContent = cartCount;
    });
  });
});