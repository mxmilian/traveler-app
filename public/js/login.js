/* eslint-disable */

const showAlert = (type, msg) => {
  removeAlert();
  const markup = `<div class='alert alert--${type}'>${msg}</div>`;
  document
    .querySelector('.login-section')
    .insertAdjacentHTML('beforeend', markup);

  window.setTimeout(removeAlert, 7000)
};

const removeAlert = () => {
  const el = document.querySelector('.alert');
  if(el) el.parentElement.removeChild(el);
}

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
      showAlert('success', res.data.data.message);
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (e) {
    showAlert('failure', e.response.data.message);
  }
};

document.querySelector('.login-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  login(username, password);
});
