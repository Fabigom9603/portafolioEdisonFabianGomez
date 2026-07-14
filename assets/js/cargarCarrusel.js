async function cargarCarrusel(contenedorId, jsonPath) {

    const carouselInner = document.querySelector(
        `#${contenedorId} .carousel-inner`
    );

    carouselInner.innerHTML = "";

    try {

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

    } catch (error) {
        console.error(error);
    }
}