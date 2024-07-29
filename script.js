document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        loadGallery();
        this.reset();
    } else {
        alert('Falha no envio. Tente novamente.');
    }
});

async function loadGallery() {
    const response = await fetch('/photos');
    const photos = await response.json();

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    photos.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'photo-item';

        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.description;
        img.width = 200;

        const description = document.createElement('p');
        description.textContent = photo.description;

        item.appendChild(img);
        item.appendChild(description);

        gallery.appendChild(item);
    });
}

loadGallery();
