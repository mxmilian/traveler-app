/* eslint-disable */
window.addEventListener('scroll', () => {
  let nav = document.querySelector('nav');
  nav.classList.toggle('sticky', window.scrollY > 10);
})

/* eslint-disable */
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:1337/api/v1/users/logout'
    });
    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (e) {
    console.log(e)
  }
};
const logoutEl = document.getElementById('logout');

if (logoutEl) {
  logoutEl.addEventListener('click', e => {
    e.preventDefault();
    logout();
  });
}