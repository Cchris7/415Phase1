const express = require('express');
const mydata = require('./mydata');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(express.json());

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

app.get('rest/ticket/:id', (req,res) => {

    const tickets = JSON.parse(fs.readFileSync(mydata.json));
    const ticketId = parseInt(req.params.id);
    const theTicket = tickets.find(ticket => ticket.id === ticketId);

    if (theTicket) {
        res.json(theTicket);
    }
    else{
        res.status(404).send('ticket not found');
    }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
