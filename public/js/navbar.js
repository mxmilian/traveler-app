/* eslint-disable */
window.addEventListener('scroll', () => {
  let nav = document.querySelector('nav');
  nav.classList.toggle('sticky', window.scrollY > 10);
})