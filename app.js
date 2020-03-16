const express = require('express');
app = express();

app.get('/', (req, res) => {
    res.status(200);
    res.send('HELLO TO SERVER!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}😎`);
});