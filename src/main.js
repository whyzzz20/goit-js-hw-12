import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
const baseUrl = "https://pixabay.com";
const endPoint = "api/";
const apiKey = "41917701-79d925887e26991e7dbaf3a79";
const galleryForm = document.querySelector(".gallery-form");
const loader = document.querySelector(".loader");
const gallery = document.querySelector(".gallery");
const massege = document.querySelector(".massege");
const buttonLoad = document.querySelector(".button-load");
let page = 1;
let galleryHTML = "";
const per_page = 40;
let searchText = "";

galleryForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const {name} = galleryForm.elements;
    searchText = name.value.trim();
    loader.style.display = "block";
    if (!searchText) {
          iziToast.error({
                title: "Error",
                message: "Please fill search string before submitting.",
            });
    }
    else if (name.value.length < 3) {
          iziToast.error({
                title: "Error",
                message: "Search string must be not less then 3 symbols.",
            });
    }
    page = 1;
    galleryHTML = "";
    searchImages(searchText, page);
    galleryForm.reset();
    return;
});
async function searchImages(query, page) {
    const encodedQuery = encodeURIComponent(query);
    const url = `${baseUrl}/${endPoint}?key=${apiKey}&q=${encodedQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${per_page}&page=${page}`;
    console.log(url);
    try {
      const response = await axios.get(url);
      const data = response.data;
        console.log(data);
        loader.style.display = "none";
        buttonLoad.style.display = "none";
        massege.style.display = "none";
        if (data.hits && data.hits.length > 0) {
            if (data.totalHits > (page * per_page)) {
                buttonLoad.style.display = "block";
            } else {
                massege.style.display = "block";
            }
            showImages(data.hits);
        } else {
            gallery.innerHTML = "";
            iziToast.error({
                title: "Error",
                message: "Sorry, there are no images matching your search query. Please try again!",
            });
        }
    } catch (error) {
    iziToast.error({
    title: "Error",
    message: "Error fetching images: ${error}",
    });
    console.error("Error fetching images:", error);
    }
}
function showImages(images) {
//gallery.innerHTML = "";
    galleryHTML += images.map(image => `<li class="gallery-item">
      <a class="gallery-link" href="${image.largeImageURL}">
        <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" />
      </a>
    <p>Likes: ${image.likes}</p>
    <p>Views: ${image.views}</p>
    <p>Comments: ${image.comments}</p>
    <p>Downloads: ${image.downloads}</p>
    </li>`
    ).join("");
    gallery.innerHTML = galleryHTML;
    const lightbox = new SimpleLightbox(".gallery a", {
        animationSpeed: 250,
        captionsData: "alt",
        captionDelay: 250
    });
    lightbox.refresh();
}
buttonLoad.addEventListener("click", function() {
    loader.style.display = "block";
    page = page + 1;
    const cardHeight = document.querySelector(".gallery-item").getBoundingClientRect().height;
    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    });
    searchImages(searchText, page);
    return;
});