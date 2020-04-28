/* eslint-disable */

const showAlert = (type, msg) => {
  const markup = `<div class='alert alert--${type}'>${msg}</div>`;
  document
    .querySelector('.login-section')
    .insertAdjacentHTML('beforeend', markup);
};

const login = async (username, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:1337/api/v1/users/login',
      data: {
        email: username,
        password
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Sign in successfully! 🤗');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (e) {
    showAlert('failure', 'Wrong e-mail or password 😡');
  }
};

document.querySelector('.login-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  login(username, password);
});
