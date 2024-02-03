import{i as l,S as L,a as b}from"./assets/vendor-951421c8.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerpolicy&&(i.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?i.credentials="include":o.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(o){if(o.ep)return;o.ep=!0;const i=r(o);fetch(o.href,i)}})();const S=document.querySelector(".search-form"),p=document.querySelector(".pictures-list"),u=document.querySelector(".js-load-btn"),m=document.querySelector(".js-loader");let n=1,d=null;function f(){const e="https://pixabay.com/api/",t={key:"42110209-7b075b8eaa13f3df464bddae0",q:d,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:40,page:n};return b.get(e,{params:t}).then(r=>r.data)}S.addEventListener("submit",q);async function q(e){if(e.preventDefault(),d=e.target.elements.query.value,n=1,y(),d===""){l.error({position:"topRight",message:"Enter a word to search for"}),c();return}try{const t=await f();if(t.totalHits===0){l.error({position:"topRight",message:"Sorry, there are no images matching your search query. Please try again!"}),c();return}n===1&&(p.innerHTML="",g(t.hits),h(t.totalHits),c())}catch(t){console.log(`Error: ${t}`)}}function w({largeImageURL:e,webformatURL:t,tags:r,likes:a,views:o,comments:i,downloads:s}){return` <li class="picture-card">
<a class="gallary-card-link" href="${e}">
  <img src="${t}" alt="${r}" />
  <ul class="image-info">
    <li class="image-item-info">
      <p>Likes</p>
      <p>${a}</p>
    </li>
    <li class="image-item-info">
      <p>Views</p>
      <p>${o}</p>
    </li>
    <li class="image-item-info">
      <p>Comments</p>
      <p>${i}</p>
    </li>
    <li class="image-item-info">
      <p>Downloads</p>
      <p>${s}</p>
    </li>
  </ul>
</a>
</li>`}function v(e){return e.map(w).join("")}function g(e){const t=v(e);p.insertAdjacentHTML("beforeend",t),C.refresh()}u.addEventListener("click",$);async function $(){n+=1,y();const e=await f();g(e.hits),h(e.totalHits),c(),H()}function h(e){const t=Math.ceil(e/40);n>=t?(l.info({position:"topRight",message:"We're sorry, there are no more posts to load"}),u.classList.add("is-hidden")):u.classList.remove("is-hidden")}function y(){m.classList.remove("is-hidden")}function c(){m.classList.add("is-hidden")}const C=new L(".pictures-list a",{captionDelay:250,captionsData:"alt"});function E(){return document.querySelector(".picture-card").getBoundingClientRect().height}function H(){const e=E();window.scrollBy({top:e*2,behavior:"smooth"})}
//# sourceMappingURL=commonHelpers.js.map
