import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const formSearch = document.querySelector('.form-search');
const searchBox = document.querySelector('.search-box');
const galleryImage = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-btn');
const loaderEnd = document.querySelector('.loader-more');

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '42094427-74698892ced21067e7c382b52';

loader.style.display = 'none';
loadMoreBtn.style.display = 'none';
loaderEnd.style.display = 'none';

let page = 1;
let totalHits = 0;
const perPage = 40;
let originalQuery = '';
const clearSearch = lightbox();

formSearch.addEventListener('submit', async function (event) {
  event.preventDefault();

  const query = encodeURIComponent(searchBox.value.trim());

  if (query.trim() === '') {
    iziToast.error({
      title: 'Error',
      message: 'Enter search data',
    });
    return;
  }
  originalQuery = query;
  page = 1;
  loadMoreBtn.style.display = 'none';
  loader.style.display = 'block';

  lightbox();

  function displayImages(images) {
    galleryImage.innerHTML = '';

    if (images.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    const markup = createMarkup(images);
    galleryImage.innerHTML = markup;
    loadMoreBtn.style.display = 'block';

    clearSearch.refresh();
  }
  formSearch.reset();

  try {
    const response = await axios.get(
      `${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    totalHits = response.data.totalHits;
    displayImages(response.data.hits);
  } catch (error) {
    console.error(error);
    iziToast.warning({
      title: 'Error',
      message: 'Something went wrong',
    });
  } finally {
    loader.style.display = 'none';
  }
});

loadMoreBtn.addEventListener('click', async () => {
  try {
    loaderEnd.style.display = 'block';
    const query = encodeURIComponent(originalQuery.trim());
    page++;
    const response = await axios.get(
      `${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    totalHits = response.data.totalHits;
    const newImages = response.data.hits;
    const totalPages = Math.ceil(totalHits / perPage);

    if (totalHits > 0 && page > totalPages) {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
      return;
    }

    const markup = createMarkup(newImages);
    galleryImage.insertAdjacentHTML('beforeend', markup);

    lightbox();

    clearSearch.refresh();
  } catch (error) {
    console.error(error);
    iziToast.warning({
      title: 'Error',
      message: 'Something went wrong',
    });
  } finally {
    loaderEnd.style.display = 'none';

    const cardHeight = getGalleryCardHeight();
    window.scrollBy({
      top: cardHeight * 2,
      left: 0,
      behavior: 'smooth',
    });
  }
});

const scrollButton = document.querySelector('.scroll-to-top-btn');

window.addEventListener('scroll', function () {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollButton.style.display = 'block';
  } else {
    scrollButton.style.display = 'none';
  }
});
scrollButton.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

function getGalleryCardHeight() {
  const galleryItem = document.querySelector('.gallery-item');
  const cardHeight = galleryItem.getBoundingClientRect().height;
  return cardHeight;
}

function lightbox() {
  const clearSearch = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captions: true,
    captionDelay: 250,
  });
  return clearSearch;
}

function createMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img
              class="gallery-image"
              src="${webformatURL}"
              alt="${tags}"
              width="360"
            />
          </a>
          <div class="info-section">
            <div class="section">
              <h2 class="tittle">Likes</h2>
              <p class="quantity">${likes}</p>
            </div>
            <div class="section">
              <h2 class="tittle">Views</h2>
              <p class="quantity">${views}</p>
            </div>
            <div class="section">
              <h2 class="tittle">Comments</h2>
              <p class="quantity">${comments}</p>
            </div>
            <div class="section">
              <h2 class="tittle">Downloads</h2>
              <p class="quantity">${downloads}</p>
            </div>
          </div>
        </li>`
    )
    .join('');
}
