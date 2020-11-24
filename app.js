const express = require('express');
const app = express();
const port = 8585;

app.get('/', (req,res) => {
    res.status(200).json({status: 'OK'})
});

app.get('/healthy', (req,res) => {
    res.status(200).json({status: 'OK'})
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
