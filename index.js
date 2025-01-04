function toggleItem(id = "price") {
  let sections = document.querySelectorAll("main section");
  for (var i = 0; i < sections.length; ++i) {
    sections[i].classList.add("hidden");
    document.querySelector(`#relation-button`).classList.add("hidden");
  }
  document.querySelector(`#${id}`).classList.remove("hidden");
  if (id === "rating") {
    document.querySelector(`#relation-button`).classList.remove("hidden");
  }
  
  //reset nút quan hệ
  relationPageOpen = false;
  document.querySelector(`#relation-button`).innerHTML = "Mối quan hệ"
}

let relationPageOpen = false;

function toggleRelationPage() {
  relationPageOpen = !relationPageOpen;
  let sections = document.querySelectorAll("main section");
  for (var i = 0; i < sections.length; ++i) {
    sections[i].classList.add("hidden");
  }

  if (relationPageOpen) {
    document.querySelector(`#relation`).classList.remove("hidden");
    document.querySelector(`#relation-button`).innerHTML = "Chi tiết"
  } else {
    document.querySelector(`#relation`).classList.add("hidden");
    document.querySelector(`#rating`).classList.remove("hidden");
    document.querySelector(`#relation-button`).innerHTML = "Mối quan hệ"
  }
}

(function () {
  toggleItem();
})();
