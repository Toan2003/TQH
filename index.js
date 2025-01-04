function toggleItem(id = "price") {
  let sections = document.querySelectorAll("main section");
  for (var i = 0; i < sections.length; ++i) {
    sections[i].classList.add("hidden");
  }
  document.querySelector(`#${id}`).classList.remove("hidden");
}

(function () {
  toggleItem();
})();
