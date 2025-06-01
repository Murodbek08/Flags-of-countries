let back = document.querySelector(".back");
let countriesFullPagecard = document.querySelector(".countries-full-page-card");

let url = new URLSearchParams(window.location.search);
let countriesId = url.get("Id");
console.log(countriesId);

function getData(url) {
  let pr = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
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

async function getCountriesName() {
  let data = await getData(`https://restcountries.com/v3.1/all`);
  let newDataId = data.filter((el) => el.population == +countriesId);
  newDataId.forEach((el) => {
    countriesFullPagecard.innerHTML += countriesFullMalumot(el);
  });
}
getCountriesName();

function countriesFullMalumot({
  flags,
  name,
  population,
  region,
  capital,
  languages,
  subregion,
  tld,
  currencies,
  borders = [],
}) {
  let qushniDavaltlar = borders.length
    ? borders.map((el) => `<span>${el}</span>`).join(" ")
    : "";
  let nativeName = Object.values(name.nativeName || {})[0]?.common || "";
  let currency = Object.values(currencies || {})[0];
  let currencyStr = currency ? `${currency.name} (${currency.symbol})` : "";
  let languageStr = languages ? Object.values(languages).join(", ") : "";
  let tldStr = tld?.join(", ") || "";
  return `
   <div class="countries-full-page-card-image">
      <img src="${flags.png}" alt='${flags.alt || "Flag"}' />
   </div>
   <div class="countries-full-page-card-texts">
      <h3>${name.common}</h3>
      <h4>Native Name: <span>${nativeName}</span></h4>
      <h4>Population: <span>${population.toLocaleString()}</span></h4>
      <h4>Region: <span>${region}</span></h4>
      <h4>Sub Region: <span>${subregion}</span></h4>
      <h4>Capital: <span>${capital?.join(", ") || "N/A"}</span></h4>
      <h4>Border Countries: ${qushniDavaltlar}</h4>
      <h4>Top Level Domain: <span>${tldStr}</span></h4>
      <h4>Currencies: <span>${currencyStr}</span></h4>
      <h4>Languages: <span>${languageStr}</span></h4>
   </div>
  `;
}

back.addEventListener("click", () => {
  history.back();
});
