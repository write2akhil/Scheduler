var NodeAE = require('./sdk/iot-application-services-sdk-nodejs-master');
var nodeAE = new NodeAE();
nodeAE.setBaseURI('appiot-mds');
module.exports = {

    getRHHueLightInfoByThing: function (req,res){
        var thingId=	req.params.thingId;
        var fromdate=	req.params.fromdate;
        var todate=	req.params.todate;
   var loadingThingsRHHueLight = nodeAE.get('/Things(%27'+thingId+'%27)/hcl.mlai.highclaritylightning:highclaritylight/hclight?timerange='+fromdate+'-'+todate+'&$orderby=_time&$filter=brightness gt 0');
   loadingThingsRHHueLight.then(
            function success (oResponse) {
                var data = JSON.parse(oResponse.body);
                console.log(data.value.length+"----"+fromdate+" ----   "+thingId);
            },
            function error (err) {
            res.send(err);
            }
        )
    },
    getDemo1RHHueLightInfoByThing: function (req,res){
        var thingId=	req.params.thingId;
        var fromdate=	req.params.fromdate;
        var todate=	req.params.todate;
   // var loadingThingsRHHueLight = nodeAE.get('/Things(%27'+thingId+'%27)/hcl.mlai.highclaritylightning:highclaritylight/hclight?timerange=2018-03-16T01:00:00.000Z-2018-03-19T23:59:00.000Z&$orderby=_time&$filter=brightness gt 0');
   var loadingThingsRHHueLight = nodeAE.get('/Things(%27'+thingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/RHHueLight?timerange='+fromdate+'-'+todate+'&$orderby=_time&$filter=brightness gt 0');

   loadingThingsRHHueLight.then(
            function success (oResponse) {
                var data = JSON.parse(oResponse.body);
                console.log(data.value.length+"----"+fromdate+" ----   "+thingId);
          //   res.send(data.value);
            },
            function error (err) {
            res.send(err);
            //throw err;
            }
        )
    },
    getConsumptionThingId: function (req,res){
      //  var thingId=	"FC8F333992A34B25BA9D8119D72EE155";
        var thingId=	req.params.thingId;
        var fromdate=	req.params.fromdate;
        var todate=	req.params.todate;

      //  console.log(Date.now());
        var loadingThingsRHHueLight = nodeAE.get('/Things(%27'+thingId+'%27)/hcl.mlai.highclaritylightning:highclaritylight/PLCalculated?timerange='+fromdate+'-'+todate);
        loadingThingsRHHueLight.then(
            function success (oResponse) {
                var data = JSON.parse(oResponse.body);
               // console.log(data.value);
          //  res.send(data.length);
          console.log(data.value.length+"----"+fromdate+" ----   "+thingId);
            },
            function error (err) {
            res.send(err);

            }
        )
    },
    getDemo1ConsumptionThingId: function (req,res){
        //  var thingId=	"FC8F333992A34B25BA9D8119D72EE155";
          var thingId=	req.params.thingId;
          var fromdate=	req.params.fromdate;
          var todate=	req.params.todate;

        //  console.log(Date.now());
          var loadingThingsRHHueLight = nodeAE.get('/Things(%27'+thingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/PLCalculated?timerange='+fromdate+'-'+todate);
          loadingThingsRHHueLight.then(
              function success (oResponse) {
                  var data = JSON.parse(oResponse.body);
                  console.log(data.value.length+"----"+fromdate+" ----   "+thingId);
             // res(data.value.length);

              },
              function error (err) {
              res.send(err);

              }
          )
      },
deleteConsumptionThingId: function (req,res){
    var thingId=	req.params.thingId;
    var loadingThings = nodeAE.delete('/Things(%27'+thingId+'%27)/hcl.mlai.rhlighttest1:pldemoscreenfields/PLCalculated?timerange=2018-03-19T00:00:00Z-2018-03-27T23:59:00Z');
    loadingThings.then(
    function success (oResponse) {
        res.send(oResponse.body);
    },
    function error (err) {
        res.send(err);
     //   throw err;
    }
    )
},
}
