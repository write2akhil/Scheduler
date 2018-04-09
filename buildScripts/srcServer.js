//web server


var express  = require('express');
var path = require('path');
express = require('express');
var schedulerForDemo1 = require('./updateConsumptionDemo-1.js');
var schedulerForDemo2 = require('./updateConsumptionDemo-2.js');
var restapi =require('../index.js');


var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/getRHHueLightInfoByThing/:thingId/:fromdate/:todate', restapi.getRHHueLightInfoByThing)
app.use('/getDemo1RHHueLightInfoByThing/:thingId/:fromdate/:todate', restapi.getDemo1RHHueLightInfoByThing)
app.use('/getConsumptionThingId/:thingId/:fromdate/:todate',restapi.getConsumptionThingId)
app.use('/deleteConsumptionThingId/:thingId',restapi.deleteConsumptionThingId)
app.use('/getDemo1ConsumptionThingId/:thingId/:fromdate/:todate',restapi.getDemo1ConsumptionThingId)

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'../src/index.html'));
});

app.listen(process.env.PORT || 8050, function () {
  console.log('philipslightning app is listening on port 8050!');
});
