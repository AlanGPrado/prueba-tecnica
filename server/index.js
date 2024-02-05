const express = require('express')
const data = require('./data');
const path = require('path');
const fs = require('fs');
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/employee', (req, res) => {
  console.log('Get employee', req.query);

  res.send(getPagination(req.query));
})

app.get('/employee/:id', (req, res) => {
  console.log('Get employee', req.params.id);
  res.send(data.content.find(data => data.id === Number(req.params.id)))
})

app.post('/employee', (req, res) => {
  console.log('Post employee', req.body)
  const employee = {
    ...req.body,
    id: Date.now(),
  };
  data.content.push(employee);
  save();
  res.send(employee);
})

app.put('/employee/:id', (req, res) => {
  console.log('Put employee', req.params.id, req.body);
  const employee = data.content.find(data => data.id === Number(req.params.id));
  Object.assign(employee, req.body)
  save();
  res.send(employee);
})

app.delete('/employee/:id', (req, res) => {
  console.log('Delete employee', req.params.id);
  data.content = data.content.filter(data => data.id !== Number(req.params.id));
  save();
  res.send({ message: 'OK' });
})

function save() {
  data.totalElements = data.content.length;
  data.numberOfElements = data.content.length;
  fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 4));
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



function getPagination({ page, size }) {
  page = Number(page || 1);
  size = Number(size || 5);
  const len = data.content.length;
  const start = (page - 1) * size;
  const content = data.content.slice(start, start+size)
  const totalPages = Math.ceil(len / size);
  return {
    content,

    "pageable": {
      "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
      },
      "offset": start,
      "pageNumber": page,
      "pageSize": size,
      "paged": true,
      "unpaged": false
    },
    totalPages,
    "totalElements": len,
    "last": totalPages <= page,
    "number": 0,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "size": size,
    "numberOfElements": content.length,
    "first": page <= 1,
    "empty": false

  }
}
