//Імпорти бібліотек
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

//налаштування axios
axios.defaults.baseURL = 'https://pixabay.com/';

//Посилання на форму та галерею
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

//Прослуховування "сабміту" форми

let searchQuery = '';
let page = 1;
let lightbox;
form.addEventListener('submit', onFormSuccess);

// Отримання і відмальовка фото
function onFormSuccess(e) {
  e.preventDefault();
  page = 1;

  searchQuery = e.target.elements.searchQuery.value.trim();

  loader.style.display = 'block';

  searchImage(searchQuery)
    .then(r => {
      if (r.hits.length === 0) {
        gallery.innerHTML = '';
        loadMoreBtn.style.display = 'none';
        return iziToast.warning({
          title: 'Wrong request',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
      }

      gallery.innerHTML = makeMarkup(r.hits);

      loader.style.display = 'none';

      loadMoreBtn.style.display = 'block';

      lightbox = new SimpleLightbox('.gallery a');

      if (r.totalHits <= page * 40) {
        iziToast.success({
          title: "That's all",
          message: 'Try another word',
        });
        loadMoreBtn.style.display = 'none';
      }
    })
    .catch(error =>
      iziToast.error({
        title: 'Error',
        message: `Oh, we have problem: ${error}`,
      })
    );
  e.target.elements.searchQuery.value = '';
}

//Прослуховування LoadMoreBtn

loadMoreBtn.addEventListener('click', loadMoreClick);

function loadMoreClick() {
  page += 1;
  searchImage(searchQuery).then(r => {
    gallery.insertAdjacentHTML('beforeend', makeMarkup(r.hits));
    if (r.totalHits <= page * 40) {
      iziToast.warning({
        title: 'Try another word',
        message: "We're sorry, but you've reached the end of search results.",
      });

      loadMoreBtn.style.display = 'none';
      return;
    }
    lightbox.refresh();
    // const photoRef = document.querySelector('.gallery__link');
    const height = document
      .querySelector('.gallery__link')
      .getBoundingClientRect();

    window.scrollBy({
      top: height.height * 2,
      behavior: 'smooth',
    });
  });
}

//Функція запиту данних по пошуковому слову
async function searchImage(searchWord) {
  const response = await axios.get('api/', {
    params: {
      key: '41293253-42a55b268bdac57d89d3cc200',
      q: searchWord,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      page,
    },
  });

  return response.data;
}

//Створення розмітки з масиву

function makeMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        id,
      }) => `<a class="gallery__link" href="${largeImageURL}">
  <div class="gallery-item" id="${id}">
    <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy">
    <div class="info">
      <p class="info-item"><b>Likes</b>${likes}</p>
      <p class="info-item"><b>Views</b>${views}</p>
      <p class="info-item"><b>Comments</b>${comments}</p>
      <p class="info-item"><b>Downloads</b>${downloads}</p>
    </div>
  </div>
</a>`
    )
    .join('');
}
