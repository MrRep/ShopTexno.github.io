
document.addEventListener("DOMContentLoaded", function () {
  // ===================== Перемикання меню та чату =====================
  window.addEventListener("scroll", function () {
    const productsSection = document.getElementById("products");
    if (!productsSection) return;
    const rect = productsSection.getBoundingClientRect();

    if (rect.top <= 0) {
      // Ховаємо старе меню
      document.querySelector(".old-nav").classList.remove("visible");
      document.querySelector(".old-nav").classList.add("hidden");

      // Показуємо нове меню
      document.querySelector(".new-nav").classList.remove("hidden");
      document.querySelector(".new-nav").classList.add("visible");

      // Показуємо елемент чату
      document.querySelector(".cart-chat").classList.remove("hidden");
      document.querySelector(".cart-chat").classList.add("visible");
    } else {
      // Показуємо старе меню
      document.querySelector(".old-nav").classList.remove("hidden");
      document.querySelector(".old-nav").classList.add("visible");

      // Ховаємо нове меню
      document.querySelector(".new-nav").classList.remove("visible");
      document.querySelector(".new-nav").classList.add("hidden");

      // Ховаємо елемент чату
      document.querySelector(".cart-chat").classList.remove("visible");
      document.querySelector(".cart-chat").classList.add("hidden");
    }
  });

  // ===================== Розширений пошук =====================
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

  // ===================== Слайдер =====================
  // Отримання елементів слайдера
  const sliderSection = document.querySelector('.SdSliderSection');
  const slider = document.querySelector('.SdSlider');
  const dots = document.querySelectorAll('.SdDot');
  const productCards = document.querySelectorAll('.SdProductCard');
  const modal = document.getElementById('SdModal');
  const modalClose = document.querySelector('.SdModalClose');
  const cartIcon = document.querySelector('.cart-icon');
  let cartCount = 0;

  console.log("Налаштовуємо IntersectionObserver для слайдера.");

  // IntersectionObserver для плавного появи слайдера при скролі
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      console.log("Entry для слайдера:", entry.isIntersecting);
      if (entry.isIntersecting) {
        sliderSection.classList.add('visible');
        observer.unobserve(sliderSection);
      }
    });
  }, { threshold: 0.2 });

  if (sliderSection) {
    observer.observe(sliderSection);
  } else {
    console.error("Секція слайдера не знайдена!");
  }

  // Фолбек: якщо через 2 секунди клас не додано, додаємо його вручну
  setTimeout(() => {
    if (!sliderSection.classList.contains('visible')) {
      console.log("Фолбек: клас 'visible' не додано через IntersectionObserver, додаємо вручну.");
      sliderSection.classList.add('visible');
    }
  }, 2000);

  // Обробка кліків по точках навігації слайдера
  dots.forEach(dot => {
    dot.addEventListener('click', function (e) {
      const index = parseInt(e.target.getAttribute('data-index'));
      slider.style.transform = `translateX(-${index * 20}%)`;
      dots.forEach(d => d.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // Обробка кліку по картці товару для відкриття модального вікна (Quick View)
  productCards.forEach(card => {
    card.addEventListener('click', function (e) {
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

  // Закриття модального вікна
  modalClose.addEventListener('click', function () {
    modal.style.display = 'none';
  });
  window.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Обробка кліку по кнопці "Додати до кошика"
  const addToCartButtons = document.querySelectorAll('.SdAddToCartBtn');
  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
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

