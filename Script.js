document.addEventListener("DOMContentLoaded", function () {
  /* ======================================================================
     1. Перемикання меню та елемента чату при скролі
  ====================================================================== */
  window.addEventListener("scroll", function () {
    const productsSection = document.getElementById("products");
    if (!productsSection) return;
    const rect = productsSection.getBoundingClientRect();

    if (rect.top <= 0) {
      document.querySelector(".old-nav").classList.replace("visible", "hidden");
      document.querySelector(".new-nav").classList.replace("hidden", "visible");
      document.querySelector(".cart-chat").classList.replace("hidden", "visible");
    } else {
      document.querySelector(".old-nav").classList.replace("hidden", "visible");
      document.querySelector(".new-nav").classList.replace("visible", "hidden");
      document.querySelector(".cart-chat").classList.replace("visible", "hidden");
    }
  });

  /* ======================================================================
     2. Розширений пошук (підказки за категоріями)
  ====================================================================== */
  const categories = [
    { name: "Ноутбуки", id: "laptops" },
    { name: "Материнські плати", id: "Mainboard" },
    { name: "Відеокарти", id: "gpu" },
    { name: "Процесори", id: "Cpu" },
    { name: "Оперативна пам'ять", id: "ram" },//
    { name: "SSD", id: "ssd" },
    { name: "HDD", id: "ssd" },
    { name: "Водяне охолодження", id: "watercooling" },//
    { name: "Блоки живлення", id: "psu" },
    { name: "Корпуси", id: "cases" },
    { name: "Монітори", id: "monitors" },//
    { name: "Миші", id: "mouses" },//
    { name: "Клавіатури", id: "keyboards" }//
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
      let filtered = categories.filter((cat) =>
        cat.name.toLowerCase().startsWith(userInput)
      );

      if (filtered.length === 0) {
        suggestionsList.innerHTML = `<li><a style="opacity:0.6;">Немає результатів</a></li>`;
        return;
      }

      suggestionsList.innerHTML = filtered
        .map(
          (item) =>
            `<li><a href="#${item.id}" class="category-link">${item.name}</a></li>`
        )
        .join("");

      document.querySelectorAll(".category-link").forEach((link) => {
        link.addEventListener("click", function (event) {
          event.preventDefault();
          const targetId = this.getAttribute("href").substring(1);
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
            window.scrollTo({
              top: targetSection.offsetTop - 20,
              behavior: "smooth",
            });
          }
        });
      });
    }
  }
});
