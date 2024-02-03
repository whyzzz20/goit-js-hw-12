// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';
// Описаний у документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const formElem = document.querySelector('.search-form');
const list = document.querySelector('.pictures-list');
const loadBtn = document.querySelector('.js-load-btn');
const loader = document.querySelector('.js-loader');

let page = 1;
let query = null;

function getPictures() {
  const BASE_URL = 'https://pixabay.com/api/';

  const params = {
    key: '42110209-7b075b8eaa13f3df464bddae0',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: page,
  };

  return axios.get(BASE_URL, { params }).then(res => res.data);
}

formElem.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();
  query = e.target.elements.query.value;
  page = 1;
  showLoader();
  if (query === '') {
    iziToast.error({
      position: 'topRight',
      message: 'Enter a word to search for',
    });
    hideLoader();
    return;
  }

  try {
    const result = await getPictures();

    if (result.totalHits === 0) {
      iziToast.error({
        position: 'topRight',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      hideLoader();
      return;
    }

    if (page === 1) {
      list.innerHTML = '';
      renderPictures(result.hits);
      changeBtnStatus(result.totalHits);
      hideLoader();
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}

function pictureTemplate({
  largeImageURL,
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return ` <li class="picture-card">
<a class="gallary-card-link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" />
  <ul class="image-info">
    <li class="image-item-info">
      <p>Likes</p>
      <p>${likes}</p>
    </li>
    <li class="image-item-info">
      <p>Views</p>
      <p>${views}</p>
    </li>
    <li class="image-item-info">
      <p>Comments</p>
      <p>${comments}</p>
    </li>
    <li class="image-item-info">
      <p>Downloads</p>
      <p>${downloads}</p>
    </li>
  </ul>
</a>
</li>`;
}
function picturesTemplate(photos) {
  return photos.map(pictureTemplate).join('');
}

function renderPictures(photos) {
  const markup = picturesTemplate(photos);
  list.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

loadBtn.addEventListener('click', onLoadBtnClick);

async function onLoadBtnClick() {
  page += 1;
  showLoader();
  const result = await getPictures();
  renderPictures(result.hits);
  changeBtnStatus(result.totalHits);
  hideLoader();
  smoothScrollPicturesCard();
}

function changeBtnStatus(totalHits) {
  const maxPage = Math.ceil(totalHits / 40);
  if (page >= maxPage) {
    iziToast.info({
      position: 'topRight',
      message: "We're sorry, there are no more posts to load",
    });
    loadBtn.classList.add('is-hidden');
  } else {
    loadBtn.classList.remove('is-hidden');
  }
}

function showLoader() {
  loader.classList.remove('is-hidden');
}
function hideLoader() {
  loader.classList.add('is-hidden');
}

const lightbox = new SimpleLightbox('.pictures-list a', {
  captionDelay: 250,
  captionsData: 'alt',
});

function getCardHeight() {
  const imageCard = document.querySelector('.picture-card');
  return imageCard.getBoundingClientRect().height;
}

function smoothScrollPicturesCard() {
  const cardHeight = getCardHeight();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
} 