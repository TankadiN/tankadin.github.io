function displayDropdown() {
    var x = document.getElementById("dropdown");
    if (x.style.display === "flex") {
      x.style.display = "none";
    } else {
      x.style.display = "flex";
    }
  }