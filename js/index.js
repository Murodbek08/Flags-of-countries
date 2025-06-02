let searchInput = document.querySelector(".card-search input");
let countriesCards = document.querySelector(".countries-cards");
let select = document.querySelector("select");
let pagination = document.querySelector(".pagination");

let loading = `
  <div class="loading">
    <div class="loader">
      <div class="loaderMiniContainer">
        <div class="barContainer">
          <span class="bar"></span>
          <span class="bar bar2"></span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 101 114" class="svgIcon">
          <circle stroke-width="7" stroke="black" transform="rotate(36.0692 46.1726 46.1727)" r="29.5497" cy="46.1727" cx="46.1726"></circle>
          <line stroke-width="7" stroke="black" y2="111.784" x2="97.7088" y1="67.7837" x1="61.7089"></line>
        </svg>
      </div>
    </div>
  </div>
`;
let xhr = new XMLHttpRequest();
function getData(url) {
  let pr = new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let countriesData = JSON.parse(xhr.response);
        resolve(countriesData);
      } else if (xhr.readyState === 4) {
        reject(countriesData);
      }
    };
    xhr.open("GET", url);
    xhr.send();
  });
  return pr;
}

searchInput.addEventListener("keyup", function (el) {
  activePage = 1;
  let search = el.target.value.trim().toLowerCase();
  if (search == "") {
    async function initPagination() {
      await getAllData();
      renderPaginationButtons();
      await loadPage(activePage);
    }
    initPagination();
    countriesCards.innerHTML = loading;
    async function loadPage(page) {
      let newData = await getData(
        `https://ap-countries-api.vercel.app/all?page=${page}&limit=10`
      );
      countriesCards.innerHTML = "";
      newData.data.forEach((el) => {
        countriesCards.innerHTML += countriesCard(el);
      });
    }
  } else {
    async function data() {
      let countriesNameData = await getData(
        `https://restcountries.com/v3.1/name/${search}`
      );
      countriesCards.innerHTML = "";
      countriesNameData.map((el) => {
        countriesCards.innerHTML += countriesCard(el);
      });
    }
    data();
  }
});

select.addEventListener("change", function (e) {
  let selectName = this.value.trim().toLowerCase();
  if (selectName == "") {
    async function initPagination() {
      await getAllData();
      renderPaginationButtons();
      await loadPage(activePage);
    }
    initPagination();
    countriesCards.innerHTML = loading;
    async function loadPage(page) {
      let newData = await getData(
        `https://ap-countries-api.vercel.app/all?page=${page}&limit=10`
      );
      countriesCards.innerHTML = "";
      newData.data.forEach((el) => {
        countriesCards.innerHTML += countriesCard(el);
      });
    }
  } else {
    async function regionData() {
      let countriesSelectData = await getData(
        `https://restcountries.com/v3.1/region/${selectName}`
      );
      countriesCards.innerHTML = "";
      countriesSelectData.map((el) => {
        countriesCards.innerHTML += countriesCard(el);
      });
    }
    regionData();
  }
});

let activePage = 1;
let totalPages = 1;

async function getAllData() {
  let countriesAllData = await getData(`https://restcountries.com/v3.1/all`);
  totalPages = Math.ceil(countriesAllData.length / 25);
  return totalPages;
}

async function initPagination() {
  await getAllData();
  renderPaginationButtons();
  await loadPage(activePage);
}
initPagination();

function renderPaginationButtons() {
  pagination.innerHTML = "";
  pagination.innerHTML += `<button onclick="paginationItemBack()"><img src="../images/chevron-left.svg" alt="Chevron icon"></button>`;

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `<button class="${
      activePage === i ? "active" : ""
    }" onclick="paginationItem(${i})">${i}</button>`;
  }
  pagination.innerHTML += `<button onclick="paginationItemNext()"><img src="../images/chevron-right.svg" alt="Chevron icon"></button>`;
}

function paginationItemBack() {
  if (activePage > 1) {
    activePage--;
    updatePage();
  }
}

function paginationItemNext() {
  if (activePage < totalPages) {
    activePage++;
    updatePage();
  }
}

function paginationItem(i) {
  activePage = i;
  updatePage();
}

async function updatePage() {
  await loadPage(activePage);
  renderPaginationButtons();
}
countriesCards.innerHTML = loading;
async function loadPage(page) {
  let newData = await getData(
    `https://ap-countries-api.vercel.app/all?page=${page}&limit=10`
  );
  countriesCards.innerHTML = "";
  newData.data.forEach((el) => {
    countriesCards.innerHTML += countriesCard(el);
  });
}

function countriesCard({ flags = {}, name, population, region, capital }) {
  let img;
  if (xhr.status !== 200) {
    img = `https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png`;
  } else if (Boolean(flags.png)) {
    img = flags.png;
  } else if (Boolean(flags.svg)) {
    img = flags.svg;
  }
  return `
    <div class="countries-card">
      <a href="../pages/flag.html?Id=${population}">
       <img  src="${img}" alt="${flags.alt}"  loading="lazy" />
      </a>
      <div class="countries-text">
        <h3>${name.common}</h3>
        <h4>Population:<span> ${population}</span></h4>
        <h4>Region:<span> ${region}</span></h4>
        <h4>Capital:<span> ${capital}</span></h4>
      </div>
    </div>
  `;
}
