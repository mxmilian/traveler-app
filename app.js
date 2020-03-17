const fs = require('fs');
const express = require('express');

app = express();
//This allows us to getting a body from req
app.use(express.json());

const port = 3000;
//convert json to object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        'status': 'success',
        'results': tours.length,
        data: {
            tours
        }
    })
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.listen(port, () => {
    console.log(`I'am listening on ${port}🦻`)
});