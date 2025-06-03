let form = document.querySelector("form");
let modal = document.querySelector(".modal");
let crossIcon = document.querySelector(".cross-icon");

crossIcon.addEventListener("click", () => {
  modal.classList.replace("active-modal", "modal");
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  let user = {
    email: this.elements.email.value,
    password: this.elements.password.value,
  };
  try {
    let userData = await fetch("https://reqres.in/api/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-api-key": "reqres-free-v1",
      },
      body: JSON.stringify(user),
    });
    if (userData.ok) {
      location.href = "../pages/countries.html";
    }
    if (!userData.ok) {
      throw new Error("Error");
    }
  } catch (error) {
    modal.classList.replace("modal", "active-modal");
  }
});
