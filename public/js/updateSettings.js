/* eslint-disable */
const showAlert = (type, msg) => {
  const markup = `<div class='alert alert--${type}'>${msg}</div>`;
  document
    .querySelector('.account-section')
    .insertAdjacentHTML('beforeend', markup);
};

const update = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:1337/api/v1/users/changePassword'
        : 'http://localhost:1337/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type.charAt(0).toUpperCase() +
          type.slice(1)} successfully updated! 🤗`
      );
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (e) {
    showAlert('failure', e.response.data.message);
  }
};

document.querySelector('.form-user-data').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  if (name && email) update({ name, email }, 'name, email');
});

document.querySelector('.form-user-password').addEventListener('submit', async e => {
  e.preventDefault();

  const button = document.querySelector('.btn--save-password').textContent = 'Updating...';
  const currentPassword = document.getElementById('password-current').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('password-confirm').value;

  await update({ currentPassword, password, confirmPassword }, 'password');

  document.querySelector('.btn--save-password').textContent = 'Save';
  document.getElementById('password-current').value = '';
  document.getElementById('password').value = '';
  document.getElementById('password-confirm').value = '';
});

