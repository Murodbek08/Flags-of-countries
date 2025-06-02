let darkMode = document.querySelector(".dark-mode");
let storage = localStorage.getItem("dark-mode");

if (storage === "dark") {
  document.body.classList.add("dark");
  darkMode.innerHTML = `<img src="../images/sun.svg" alt="Sun icon ?" /><span>Light Mode</span>`;
} else {
  document.body.classList.remove("dark");
  darkMode.innerHTML = `<img src="../images/moon.svg" alt="Moon icon" /><span>Dark Mode</span>`;
}

darkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("dark-mode", "dark");
    darkMode.innerHTML = `<img src="../images/sun.svg" alt="Sun icon ?" /><span>Light Mode</span>`;
  } else {
    localStorage.setItem("<dark-m></dark-m>ode", "no-dark");
    darkMode.innerHTML = `<img src="../images/moon.svg" alt="Moon icon ?" /><span>Dark Mode</span>`;
  }
});
