 const carousel = document.getElementById('customCarousel');
  const images = carousel.getElementsByTagName('img');
  let index = 0;

  function changeImage() {
    // Ocultar la imagen actual
    images[index].classList.remove('active');
    
    // Calcular el índice siguiente
    index = (index + 1) % images.length;
    
    // Mostrar la nueva imagen
    images[index].classList.add('active');
  }

  // Cambiar cada 3 segundos
  setInterval(changeImage, 3000);