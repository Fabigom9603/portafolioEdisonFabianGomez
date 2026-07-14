async function cargarCarrusel(contenedorId, jsonPath) {

    const carouselInner = document.querySelector(
        `#${contenedorId} .carousel-inner`
    );

    if (!carouselInner) return;

    carouselInner.innerHTML = "";

    const response = await fetch(jsonPath);
    const archivos = await response.json();

    for (let i = 0; i < archivos.length; i++) {

        const archivo = archivos[i];

        const htmlProyecto = await fetch(
            jsonPath.replace("proyectos.json", archivo)
        );

        const contenido = await htmlProyecto.text();

        const item = document.createElement("div");

        item.className =
            i === 0
                ? "carousel-item active"
                : "carousel-item";

        item.innerHTML = contenido;

        carouselInner.appendChild(item);
    }
}

/**
 * Conecta los botones fixed (compartidos) con el carrusel
 * del tab actualmente activo, y los reconecta cada vez que
 * el usuario hace click en un tab (Software / Videojuegos).
 * Usa click directo (no shown.bs.tab) para evitar depender
 * del timing/comportamiento interno de Bootstrap.
 */
function inicializarBotonesCarrusel() {

    const btnLeft = document.getElementById('carouselBtnLeft');
    const btnRight = document.getElementById('carouselBtnRight');

    if (!btnLeft || !btnRight) return;

    const tabs = document.querySelectorAll('#pills-tab .switch-btn');

    function actualizarTarget(tab) {
        const target = tab.dataset.carouselTarget;
        if (!target) return;
        btnLeft.setAttribute('data-bs-target', target);
        btnRight.setAttribute('data-bs-target', target);
    }

    // Target inicial: el tab que esté activo al cargar la página
    const tabActivo = document.querySelector('#pills-tab .switch-btn.active') || tabs[0];
    if (tabActivo) actualizarTarget(tabActivo);

    tabs.forEach(tab => {
        tab.addEventListener('click', () => actualizarTarget(tab));
    });

    // Control manual del carrusel: primero termina el scroll,
    // y solo cuando termina se dispara el slide (evita el
    // movimiento diagonal de hacer ambas cosas a la vez).
    function moverCarrusel(direccion) {
        const target = btnLeft.getAttribute('data-bs-target');
        const carrusel = target ? document.querySelector(target) : null;
        if (!carrusel) return;

        const instancia = bootstrap.Carousel.getOrCreateInstance(carrusel);

        const yaArriba = carrusel.getBoundingClientRect().top >= 0
            && carrusel.getBoundingClientRect().top <= 80;

        const ejecutarSlide = () => {
            direccion === 'prev' ? instancia.prev() : instancia.next();
        };

        if (yaArriba) {
            // Ya está a la vista: deslizar directo, sin scroll.
            ejecutarSlide();
            return;
        }

        carrusel.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if ('onscrollend' in window) {
            window.addEventListener('scrollend', ejecutarSlide, { once: true });
        } else {
            // Fallback para navegadores sin soporte de 'scrollend'
            setTimeout(ejecutarSlide, 500);
        }
    }

    if (!btnLeft.dataset.moverBound) {
        btnLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            moverCarrusel('prev');
        });
        btnLeft.dataset.moverBound = 'true';
    }
    if (!btnRight.dataset.moverBound) {
        btnRight.addEventListener('click', (e) => {
            e.stopPropagation();
            moverCarrusel('next');
        });
        btnRight.dataset.moverBound = 'true';
    }
}

async function cargarProyectos() {
    console.log("Loader ejecutado");

    await cargarCarrusel(
        "CarouselAplicaciones",
        "pages/projects/software/proyectos.json"
    );

    await cargarCarrusel(
        "CarouselVideojuegos",
        "pages/projects/videojuegos/proyectos.json"
    );

    // Los tabs (#pills-tab) ya están en el DOM en este punto
    // (fueron inyectados junto con projects.html), así que
    // ahora sí podemos conectar los botones fixed a ellos.
    inicializarBotonesCarrusel();
}