const fs = require('fs');
const express = require('express');

app = express();
//This allows us to getting a body from req
app.use(express.json());

const port = 3000;
//convert json to object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

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


//Routes
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

app.listen(port, () => {
    console.log(`I'am listening on ${port}🦻`)
});