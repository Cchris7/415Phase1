const express = require('express');
const mydata = require('./mydata');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.get('/rest/list/', (req,res) => {
    fs.readFile('mydata.json', 'utf8', (err, data) => {
        if(err){
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
        else{
            const json = JSON.parse(data);
            res.json(json);
        }

    }
);
});

app.get('/rest/ticket/:id', (req,res) => {
    const id = req.params.id;
    const search = mydata.find(obj => obj.id === parseInt(id));

    if (!search) {
        res.status(404).send('Object not found');
        return;
    }
    res.json(search);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
