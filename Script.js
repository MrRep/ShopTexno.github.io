document.addEventListener("DOMContentLoaded", function () {
  /* ======================================================================
     1. Перемикання меню та елемента чату при скролі
  ====================================================================== */
  window.addEventListener("scroll", function () {
    const productsSection = document.getElementById("products");
    if (!productsSection) return;
    const rect = productsSection.getBoundingClientRect();

    if (rect.top <= 0) {
      // При досягненні секції – ховаємо старе меню, показуємо нове та чат
      document.querySelector(".old-nav").classList.remove("visible");
      document.querySelector(".old-nav").classList.add("hidden");

      document.querySelector(".new-nav").classList.remove("hidden");
      document.querySelector(".new-nav").classList.add("visible");

      document.querySelector(".cart-chat").classList.remove("hidden");
      document.querySelector(".cart-chat").classList.add("visible");
    } else {
      // Інакше – показуємо старе меню, ховаємо нове та чат
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
});