let searchInput = document.querySelector(".card-search input");
let countriesCards = document.querySelector(".countries-cards");
let select = document.querySelector("select");
let pagination = document.querySelector(".pagination");

let allCountries = []; // Barcha davlatlar saqlanadigan massiv
let activePage = 1;
let limit = 12; // Bir sahifada ko'rinadigan davlatlar soni

// API dan ma'lumot olish
function getData(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject("Xatolik: " + xhr.status);
        }
      }
    };
    xhr.open("GET", url);
    xhr.send();
  });
}

// Barcha ma'lumotni yuklab olish
async function init() {
  countriesCards.innerHTML = "Yuklanmoqda...";
  // CORS xatosi chiqmasligi uchun faqat restcountries.com dan foydalanamiz
  allCountries = await getData(
    "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital",
  );
  renderCards(activePage);
  renderPaginationButtons();
}

// Sahifadagi kartalarni chizish
function renderCards(page) {
  countriesCards.innerHTML = "";
  let start = (page - 1) * limit;
  let end = start + limit;
  let pageData = allCountries.slice(start, end);

  pageData.forEach((el) => {
    countriesCards.innerHTML += countriesCard(el);
  });
}

// Pagination tugmalarini chizish
function renderPaginationButtons() {
  let totalPages = Math.ceil(allCountries.length / limit);
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `<button class="${activePage === i ? "active" : ""}" onclick="changePage(${i})">${i}</button>`;
  }
}

function changePage(i) {
  activePage = i;
  renderCards(activePage);
  renderPaginationButtons();
}

// Qidiruv funksiyasi
searchInput.addEventListener("keyup", function (e) {
  let search = e.target.value.trim().toLowerCase();
  let filteredData = allCountries.filter((el) =>
    el.name.common.toLowerCase().includes(search),
  );

  countriesCards.innerHTML = "";
  filteredData
    .slice(0, limit)
    .forEach((el) => (countriesCards.innerHTML += countriesCard(el)));
  pagination.innerHTML = ""; // Qidiruv vaqtida pagination-ni yashiramiz
});

// Region bo'yicha filter
select.addEventListener("change", async function () {
  let region = this.value;
  if (region === "") {
    init();
  } else {
    allCountries = await getData(
      `https://restcountries.com/v3.1/region/${region}?fields=name,flags,population,region,capital`,
    );
    activePage = 1;
    renderCards(activePage);
    renderPaginationButtons();
  }
});

function countriesCard({ flags, name, population, region, capital }) {
  return `
    <div class="countries-card">
      <a href="../pages/flag.html?name=${name.common}">
       <img
  class="myImage"
  src="${flags.png || flags.svg}"
  alt="${flags.alt || name.common}"
  loading="lazy"
  onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUUtqZTac4LP7xdg__N69jhk3NtdUS67HGQS2ySkG7qOIIF7elpFoX23Gcj7lCGCx-aSA&usqp=CAU';"
/>
      </a>
      <div class="countries-text">
        <h3>${name.common}</h3>
        <h4>Population:<span> ${population.toLocaleString()}</span></h4>
        <h4>Region:<span> ${region}</span></h4>
        <h4>Capital:<span> ${capital ? capital[0] : "N/A"}</span></h4>
      </div>
    </div>`;
}

init();
