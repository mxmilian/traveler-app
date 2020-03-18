const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

app = express();

const port = 3000;
//convert json to object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

//This allows us to get access to the body from request
app.use(morgan('dev'));
app.use(express.json());

//Routes handlers
const getAllTours = (req, res) => {
    res.status(200).json({
        'status': 'success',
        'results': tours.length,
        data: {
            tours
        }
    })
};

const getTour = (req,res) => {
    const tour = tours.find(element => element.id === parseInt(req.params.id));
    if(!tour) return res.status(404).json({status:'Failed', message:'Invalid ID'});
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

const createTour = (req, res) => {
    const newID = tours[tours.length-1].id+1;
    const newTour = Object.assign({'id': newID}, req.body);
    tours.push(newTour);
    //Write file. JSON.stringify object -> to json
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if(err) console.log(err.message);
        res.status(201).json({
            'status': 'success',
            data: {
                tour: newTour
            }
        })
    })
};

const updateTour = (req, res) => {
    if (parseInt(req.params.id) > tours.params) res.status(404).json({status: 'Failed', message: 'Invalid ID'});
    res.status(200).json({
        status: 'success',
        data: {
            tour: '!Updated tour here!'
        }
    })
};

const deleteTour = (req, res) => {
    if(parseInt(req.params.id) > tours.params) res.status(404).json({status:'Failed', message:'Invalid ID'});
    res.status(204).json({
        status: 'success',
        data: null
    })
};

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This rout is not implemented yet!'
    })
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This rout is not implemented yet!'
    })
};
const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This rout is not implemented yet!'
    })
};
const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This rout is not implemented yet!'
    })
};
const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This rout is not implemented yet!'
    })
};

//Routes
//one router for each of the resource
//Mounting a new router on route
const tourRouter = express.Router();
//connection router with the app via middleware
app.use('/api/v1/tours', tourRouter);
tourRouter
    .route('/')
    .get(getAllTours)
    .post(createTour);

tourRouter
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

const userRouter = express.Router();
app.use('/api/v1/users', userRouter);
userRouter
    .route('/')
    .get(getAllUsers)
    .post(createUser);

userRouter
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

app.listen(port, () => {
    console.log(`I'am listening on ${port}🦻`)
});