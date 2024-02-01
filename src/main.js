
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL= "https://pixabay.com/api/";
const API_KEY = "41911500-2109ce3c8bb16633259977e96";

const container = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const input= document.querySelector('.search-input');
const startBtn= document.querySelector('.start-btn');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-btn');
const preloader = document.querySelector('loader-load');

const hiddenClass=  "is-hidden";
let inputValue = "";
let page = 1;
let maxPage = 0;


const refreshPage = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});



loader.style.display = 'none';
form.addEventListener('submit', handleSearch)

function handleSearch(event){
  event.preventDefault();
  loader.style.display = 'block';
  inputValue = event.target.elements.query.value;
  fetchImage(inputValue)
  .then(data => {
    loader.style.display = 'none';
      if(!data.hits.length){
          iziToast.error({
              title: 'Error',
              message:
                'Sorry, there are no images matching your search query. Please try again!',
            });
      } 
      container.innerHTML = "";
      page = 1;
      try {
       
        container.innerHTML = createMarkup(data.hits);
        refreshPage.refresh();
        scrollBy();
        if(data.totalHits > 0){
          loadMoreBtn.classList.remove(hiddenClass);
          loadMoreBtn.addEventListener("click", handleLoadMore);
      }else{
          loadMoreBtn.classList.add(hiddenClass);
      }

      } catch (error) {
        onFetchError(error);
      }finally {
        form.reset();
        if(page === maxPage){
          loadMoreBtn.classList.add(hiddenClass);
        iziToast.error({
          title: 'Error',
          message:
            "We're sorry, but you've reached the end of search results.",
        });
        
        }
      }
        
        
      })
  
}


function fetchImage(name, page = 1){
  return axios.get(`${BASE_URL}?key=${API_KEY}&q=${name}`,{
  params : {
apiKey: API_KEY,
q: name,
image_type: 'photo',
orientation: 'horizontal',
safesearch: true,
per_page: 40,
page,
  }
}).then(({data})=>data)};


function createMarkup(arr) {
  return arr
    .map(
      ({ webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads, }) => `
  <li class="gallery-item">
  <a class="gallery-link" href="${largeImageURL}">
    <img
      class="gallery-image"
      src="${webformatURL}"
      alt="${tags}"
    />
    <p class= "gallery-descr">• Likes: ${likes} • Views: ${views} • Comments: ${comments} •</span> Downloads:${downloads}</p>
  </a>
</li>
  `
    )
    .join('');
    
}

async function handleLoadMore(){
  page += 1;
 
loadMoreBtn.disabled = true;
  try {
    const {hits, total} = await fetchImage(inputValue, page);

    maxPage = Math.ceil(total / 40);
    
    
    container.insertAdjacentHTML('beforeend', createMarkup(hits));

    Page.refresh();
    scrollBy()
} catch (error) {
  onFetchError(error);
}finally{
  
  loadMoreBtn.disabled = false;
  if(page === maxPage){
    loadMoreBtn.classList.add(hiddenClass);
    loadMoreBtn.removeEventListener("click", handleLoadMore)
  iziToast.error({
    title: 'Error',
    message:
      "We're sorry, but you've reached the end of search results.",
  });
  
  }
}
}

function onFetchError(error){
  iziToast.error({
    title: 'Error',
    message:
      'OOps... Plese try again',
  });
}

function scrollBy() {
  window.scrollBy({
    top: 700,
    behavior: 'smooth',
  });
}