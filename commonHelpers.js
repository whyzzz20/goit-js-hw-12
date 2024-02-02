import{i as l,a as f,S as $}from"./assets/vendor-951421c8.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&t(a)}).observe(document,{childList:!0,subtree:!0});function s(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerpolicy&&(r.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?r.credentials="include":e.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(e){if(e.ep)return;e.ep=!0;const r=s(e);fetch(e.href,r)}})();const g=document.querySelector(".form-search"),E=document.querySelector(".search-box"),u=document.querySelector(".gallery"),y=document.querySelector(".loader"),d=document.querySelector(".load-btn"),p=document.querySelector(".loader-more"),v="https://pixabay.com/api",b="42094427-74698892ced21067e7c382b52";y.style.display="none";d.style.display="none";p.style.display="none";let i=1,c=0;const k=40;let w="";const S=h();g.addEventListener("submit",async function(n){n.preventDefault();const o=encodeURIComponent(E.value.trim());if(o.trim()===""){l.error({title:"Error",message:"Enter search data"});return}w=o,i=1,d.style.display="none",y.style.display="block",h();function s(t){if(u.innerHTML="",t.length===0){l.error({title:"Error",message:"Sorry, there are no images matching your search query. Please try again!"});return}const e=q(t);u.innerHTML=e,d.style.display="block",S.refresh()}g.reset();try{const t=await f.get(`${v}/?key=${b}&q=${o}&image_type=photo&orientation=horizontal&safesearch=true&page=${i}&per_page=40`);c=t.data.totalHits,s(t.data.hits)}catch(t){console.error(t),l.warning({title:"Error",message:"Something went wrong"})}finally{y.style.display="none"}});d.addEventListener("click",async()=>{try{p.style.display="block";const n=encodeURIComponent(w.trim());i++;const o=await f.get(`${v}/?key=${b}&q=${n}&image_type=photo&orientation=horizontal&safesearch=true&page=${i}&per_page=40`);c=o.data.totalHits;const s=o.data.hits,t=Math.ceil(c/k);if(c>0&&i>t){l.info({title:"Info",message:"We're sorry, but you've reached the end of search results."});return}const e=q(s);u.insertAdjacentHTML("beforeend",e),h(),S.refresh()}catch(n){console.error(n),l.warning({title:"Error",message:"Something went wrong"})}finally{p.style.display="none";const n=H();window.scrollBy({top:n*2,left:0,behavior:"smooth"})}});const m=document.querySelector(".scroll-to-top-btn");window.addEventListener("scroll",function(){document.body.scrollTop>20||document.documentElement.scrollTop>20?m.style.display="block":m.style.display="none"});m.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"})});function H(){return document.querySelector(".gallery-item").getBoundingClientRect().height}function h(){return new $(".gallery a",{captionsData:"alt",captions:!0,captionDelay:250})}function q(n){return n.map(({webformatURL:o,largeImageURL:s,tags:t,likes:e,views:r,comments:a,downloads:L})=>`<li class="gallery-item">
          <a class="gallery-link" href="${s}">
            <img
              class="gallery-image"
              src="${o}"
              alt="${t}"
              width="360"
            />
          </a>
          <div class="info-section">
            <div class="section">
              <h2 class="tittle">Likes</h2>
              <p class="quantity">${e}</p>
            </div>
            <div class="section">
              <h2 class="tittle">Views</h2>
              <p class="quantity">${r}</p>
            </div>
            <div class="section">
              <h2 class="tittle">Comments</h2>
              <p class="quantity">${a}</p>
            </div>
            <div class="section">
              <h2 class="tittle">Downloads</h2>
              <p class="quantity">${L}</p>
            </div>
          </div>
        </li>`).join("")}
//# sourceMappingURL=commonHelpers.js.map
