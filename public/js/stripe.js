/* eslint-disable */
const stripe = Stripe('pk_test_CbMt1iMbR5QQbD8wqgM0NTNC00N3TosnNc');

const bookTour = async tourID => {
  try {
    const session = await axios(
      `http://localhost:1337/api/v1/booking/checkout-session/${tourID}`
    );

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })
  } catch (e) {
    console.log(e);
  }
};

const bookBtn = document.getElementById('book-tour');
bookBtn.addEventListener('click', e => {
  e.target.textContent = 'Processing...';
  bookTour(e.target.dataset.tourId);
});