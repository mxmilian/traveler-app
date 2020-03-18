const express = require('express');
const morgan = require('morgan');

app = express();
const port = 3000;

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//This allows us to get access to the body from request
app.use(morgan('dev'));
app.use(express.json());

//connection router with the app via middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


app.listen(port, () => {
    console.log(`I'am listening on ${port}🦻`)
});