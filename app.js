const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const http = require('http');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {

  http.get('http://web.mta.info/status/serviceStatus.txt', (response) => {
    
    let mtaResponse;

    response.on('data', (c) => { mtaResponse += c });

    response.on('end', () => {
      const parser = new XMLParser();
      let parsedData = parser.parse(mtaResponse); // parse the response
      let status = parsedData.service.subway.line[7].status; // find the status
      
      let trainStatus;  
      if (status === "GOOD SERVICE") {
        trainStatus = "NOPE"
      } else {
        trainStatus = "YUP"
      }

      res.render("index", { title: trainStatus });
    });

  }).on('error', e => { console.log(e) });

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});