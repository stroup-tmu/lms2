// Assignments Modal
import * as bootstrap from 'bootstrap'

// - Functions
async function getAssignmentForm(url) {
  const response = await fetch(url, {
  });

  const htmlString = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const form = doc.querySelector("#assignment-form");

  const modal_body = document.querySelector("#assignment-modal-content");
  modal_body.append(form);

  const modal = bootstrap.Modal.getOrCreateInstance("#exampleModal");
  modal.show();
};

async function clearAssignmentForm() {
  const modal_body = document.querySelector("#assignment-modal-content");
  modal_body.innerHTML = null;
}

function disableForm() {
  const form_buttons = document.querySelectorAll("#assignment-form .btn");
  const form_fields = document.querySelectorAll("#assignment-form .form-control");

  form_buttons.forEach((button) => {
    button.setAttribute("disabled", "");
  });
  form_fields.forEach((field) => {
    field.setAttribute("disabled", "");
  });
}

function enableForm() {
  const form_buttons = document.querySelectorAll("#assignment-form .btn");
  const form_fields = document.querySelectorAll("#assignment-form .form-control");

  form_buttons.forEach((button) => {
    button.removeAttribute("disabled", "");
  });
  form_fields.forEach((field) => {
    field.removeAttribute("disabled", "");
  });
}

async function submitAssignmentForm() {

  const assignment_form = document.querySelector("#assignment-form");
  const url = assignment_form.getAttribute("action");
  const existing_item = /\d$/.test(url)
  const formData = new FormData(assignment_form);

  disableForm();

  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData
    });

    const htmlString = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    enableForm();

    if (response.ok) {
      const row = doc.querySelector(".assignment-html")

      if (existing_item) {
        const id = row.id;
        const old_row = document.getElementById(id);
        old_row.replaceWith(row);
      } else {
        const table = document.getElementById("assignments");
        table.append(row);
      };

      const modal = bootstrap.Modal.getOrCreateInstance("#exampleModal");
      modal.hide();
    } else {
      const form = doc.querySelector("#assignment-form");

      const modal_body = document.querySelector("#assignment-modal-content");
      modal_body.innerHTML = null;
      modal_body.append(form);
    };
  } catch {
    enableForm();

    const error_container = document.getElementById("assignment-form-errors");
    const error_message = "A network error occured. Please try again.";

    error_container.innerHTML = error_message;
  }
};

// - Listeners
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("assignment-button")) {
    event.preventDefault();

    const link = event.target;
    const url = link.getAttribute("href");

    getAssignmentForm(url);
  };
});

document.addEventListener("hidden.bs.modal", (event) => {
  clearAssignmentForm();
});

document.addEventListener("submit", (event) => {
  event.preventDefault();

  submitAssignmentForm();
});
