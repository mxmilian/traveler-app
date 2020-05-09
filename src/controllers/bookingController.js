const Stripe = require('stripe');
const Tour = require('../models/tourModel');
const catchAsync = require('../errors/catchAsync');

const getCheckoutSession = catchAsync(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const tour = await Tour.findById(req.params.tourID);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
    customer_email: req.user.email,
    //This field allows us pass some data ab session that we are currently creating(When the purchase was successful
    // we will then get access to the session object again) -> creating new booking in our db userId, tourId, price
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} TOUR`,
        description: tour.summary,
        //images: [],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  res.status(200).json({
    status: 'success',
    session
  });
});

module.exports = { getCheckoutSession };
