/* eslint-disable */
const showAlert = (type, msg) => {
  const markup = `<div class='alert alert--${type}'>${msg}</div>`;
  document
    .querySelector('.account-section')
    .insertAdjacentHTML('beforeend', markup);
};

const update = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:1337/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Update successfully! 🤗');
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

  update(name, email);
})
