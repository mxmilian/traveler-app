/* eslint-disable */
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
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
      alert('Loged in successfully! 😎');
    }
  } catch (e) {
    alert('Wrong username or password! ☹️');
  }
};

document.querySelector('.login-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  login(username, password);
});
