document.addEventListener('DOMContentLoaded', async function () {
    const container = document.getElementById('contenido-container');
    const navList = document.getElementById('nav-list');
    const selector = document.getElementById('json-selector');

    try {
        // 1. Traer la lista de archivos desde index.json
        const response = await fetch('data/index.json');
        const files = await response.json();

        // 2. Llenar el <select> con los archivos
        files.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file.replace('.json', ''); // mostrar sin extensión
            selector.appendChild(option);
        });

        // 3. Cargar el primer archivo por defecto
        if (files.length > 0) {
            loadJsonFile(files[0], container, navList);
        }

        // 4. Cuando el usuario cambie el selector
        selector.addEventListener('change', () => {
            loadJsonFile(selector.value, container, navList);
        });

    } catch (error) {
        console.error('Error al cargar index.json:', error);
    }
});

// --- Función para cargar y renderizar un JSON ---
async function loadJsonFile(file, container, navList) {
    try {
        const response = await fetch(`data/${file}`);
        const data = await response.json();

        // Limpiar contenido previo
        container.innerHTML = '';
        navList.innerHTML = '';

        // Título principal
        const tituloPrincipal = document.createElement('h1');
        tituloPrincipal.textContent = data.Main_Title;
        container.appendChild(tituloPrincipal);

        // Renderizar artículos
        data.Articles.forEach((articulo, index) => {
            const articuloDiv = document.createElement('div');
            articuloDiv.className = 'articulo';
            articuloDiv.id = `articulo-${index}`;
            if (index !== 0) articuloDiv.classList.add('hidden');

            const tituloH2 = document.createElement('h2');
            tituloH2.className = 'articulo-titulo';
            tituloH2.textContent = articulo.Titulo;

            const contenidoP = document.createElement('p');
            contenidoP.className = 'articulo-contenido';
            contenidoP.innerHTML = articulo.Contenido.replace(/\n/g, '<br>');

            articuloDiv.appendChild(tituloH2);
            articuloDiv.appendChild(contenidoP);
            container.appendChild(articuloDiv);

            // Menú lateral
            const navItem = document.createElement('li');
            const navLink = document.createElement('a');
            navLink.href = '#';
            navLink.textContent = articulo.Titulo;
            navLink.dataset.target = articuloDiv.id;
            if (index === 0) navLink.classList.add('active');
            navItem.appendChild(navLink);
            navList.appendChild(navItem);
        });

        // Manejo de clicks en el menú
        navList.addEventListener('click', function (event) {
            event.preventDefault();
            const clickedLink = event.target.closest('a');
            if (!clickedLink) return;

            document.querySelectorAll('.articulo').forEach(div => div.classList.add('hidden'));
            document.querySelectorAll('#nav-list a').forEach(link => link.classList.remove('active'));

            const targetId = clickedLink.dataset.target;
            const targetArticle = document.getElementById(targetId);
            if (targetArticle) targetArticle.classList.remove('hidden');

            clickedLink.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

    } catch (error) {
        console.error(`Error al cargar ${file}:`, error);
    }
}
