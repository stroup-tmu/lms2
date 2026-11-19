// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
// import "@hotwired/turbo-rails"

import "controllers"

import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap

import "update_status"
import "assignment_modal"

import Sortable from "sortablejs"

function submitSortOrders() {
  const json = getJson();

  fetch("/courses/2/assignments/update_sort_order", {
    method: "PATCH",
    body: json,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

function getJson() {
  const rows = document.querySelectorAll("#assignments tr");

  const dataArray = Array.from(rows).map(el => ({
    id: el.id,
    sort_order: Array.from(rows).indexOf(el)
  }));

  const jsonString = JSON.stringify(dataArray, null, 2);
  return jsonString
};

var el = document.getElementById('assignments');
var sortable = Sortable.create(el, {
  animation: 150,
  onSort: function (/**Event*/evt) {
    submitSortOrders();
	},
});
