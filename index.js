const express = require('express');
const mydata = require('./mydata');
const app = express();
const port = 3000;
const fs = require('fs');
const { default: mongoose } = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

const uri = 'mongodb+srv://calchristensen:q6Df1kI93FlE2TAf@cluster0.uip5c03.mongodb.net/?retryWrites=true&w=majority'

async function connect() {
    try{
        await mongoose.connect(uri);
        console.log("connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

connect();

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

app.post('/rest/ticket' , (req, res) => {
    const data = JSON.parse(fs.readFileSync('./mydata.json'));
    
    const newTicket = {
    id: req.body.id,
    created_at: req.body.created_at,
    updated_at: req.body.updated_at,
    type: req.body.type,
    subject: req.body.subject,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
    recipient: req.body.recipient,
    submitter: req.body.submitter,
    assignee_id: req.body.assignee_id,
    follower_ids: req.body.follower_ids,
    tags: req.body.tags,
  };
      
  data.push(newTicket);
  fs.writeFileSync('./mydata.json', JSON.stringify(data));
  res.json(newTicket);
});

app.delete('/rest/ticket/:id', (req, res) => {
    const ticketId = req.params.id;
    let tickets;
  
    try {
      // Read the data from the JSON file
      const data = fs.readFileSync('mydata.json');
      tickets = JSON.parse(data.toString());
    } catch (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
  
    // Find the index of the ticket with the matching ID
    const index = tickets.findIndex((ticket) => ticket.id === ticketId);
  
    if (index === -1) {
      return res.status(404).send('Ticket not found');
    }
  
    // Remove the ticket from the array
    tickets.splice(index, 1);
  
    try {
      // Write the updated data back to the JSON file
      fs.writeFileSync('mydata.json', JSON.stringify(tickets));
    } catch (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
  
    res.status(200).send('Ticket with ID ${ticketId} deleted successfully');
  });
  

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
