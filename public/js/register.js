/* eslint-disable */

const showAlert = (type, msg) => {
  const markup = `<div class='alert alert--${type}'>${msg}</div>`;
  document
    .querySelector('.login-section')
    .insertAdjacentHTML('beforeend', markup);
};

const register = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:1337/api/v1/users/signup',
      data
    });
    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (e) {
    showAlert('failure', e.response.data.message);
  }
};

document.querySelector('.register-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-password-conf').value;

  register({ name, email, password, confirmPassword });
});
