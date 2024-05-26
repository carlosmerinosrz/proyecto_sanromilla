document.addEventListener("DOMContentLoaded", function() {
    // Simula el preloader
    setTimeout(function() {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("app-container").style.display = "block";
    }, 2000); // 2000 milisegundos = 2 segundos
  });
  