/* eslint-disable */

const token = window.location.href.split('/')[4];

const counter = () => {
  console.log('Hello from counter');
  let sec = 5;
  const element = document.querySelector('.confirm__time');
  element.innerHTML = sec;
  setInterval(() => {
    sec--;
    element.innerHTML = sec;
  }, 1000);
}

console.log(token);

const activationAccount = async () => {
  try {
    console.log('siema');
    const res = await axios({
      method: 'GET',
      url: `http://localhost:1337/api/v1/users/activateAccount/${token}`,
    });
    if (res.data.status === 'success') {
      console.log('success');
      counter();
      window.setTimeout(() => {
        location.assign('/');
      }, 5000);
    }
  } catch (e) {
    console.log(e.message);
  }
};

//activationAccount();
