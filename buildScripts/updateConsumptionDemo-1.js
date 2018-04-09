

 var NodeAE = require('../sdk/iot-application-services-sdk-nodejs-master');
 var nodeAE = new NodeAE();
 nodeAE.setBaseURI('appiot-mds');
 var schedule = require('node-schedule');
 var colorFinder =require('./colorFinder.js');
 var thingIds = ["C3549205A6224B28B2F9C74ABBB74F1F","6CD8528F892641C7997C8BB8A2A5722D","F0FBD353DA874A04920B53390EF5E885"];

 var startTime = new Date(Date.now());
var endTime = new Date(startTime.getTime() + 100000000000000);
var j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/100000000 * * * * *' }, function(){
 thingIds.forEach(function(thingId){
 var d = new Date();
 var hour_date = d.toISOString() ;
        //  var fromDate = new Date(hour_date);
        //  fromDate.setMinutes(fromDate.getMinutes() - 5);

        var fromDate = new Date(hour_date);
        fromDate.setHours(fromDate.getHours() - 1);


         //console.log("Running For DeviceId: " +thingId + " For Duration between: "+ fromDate.toISOString() + "TO: "+ hour_date);
         var loadingThingsRHHueLight = nodeAE.get('/Things(%27'+thingId+'%27)/hcl.mlai.highclaritylightning:highclaritylight/hclight?timerange='+fromDate.toISOString()+'-'+hour_date+'&$orderby=_time&$filter=brightness gt 0');
         loadingThingsRHHueLight.then(
             function success (oResponse) {
              var data = JSON.parse(oResponse.body);
              if(data.value.length>0){
              var positive=0;
             for(var i=0;i<data.value.length;i++)

             {
                 if(i<data.value.length-1)
                 {
                     var fromDate = new Date(data.value[i+1]._time);
                     var toDate = new Date(data.value[i]._time);
                     var diff =  fromDate-toDate ;
                     var seconds = Math.floor(diff / (1000));
                     diff -= seconds * (1000);
                     positive +=seconds;
                 }
             }

             var result = 0;
             if(positive>0)
             {
                 result=  (positive/ 3600) * 100;
             }

             for(var i=0;i<data.value.length;i++)
             {
                 if(data.value[i].connected==true && data.value[i].brightness>0)
                 {
                 var powerConsumptionCurrent=data.value[i].brightness;
                 var power24Hours=powerConsumptionCurrent*1440;
                 var powerTotalWeek=power24Hours*7;
                 var powerConsumptionCurrentCycle=powerTotalWeek*4;

                     var oDataPayload ={
                     "value": [
                     {
                         "_time": data.value[i]._time,
                         "Utilisation": result,
                         "PowerConsumptionInCurrentCycle": powerConsumptionCurrentCycle,
                         "PowerTotal24hours": power24Hours,
                         "TimeOn": Math.floor(result / 60),
                         "CurrentPowerConsumption": powerConsumptionCurrent,
                         "PowerTotalWeek": powerTotalWeek
                     }
                     ]
                     }

                     UpdateConsumption(thingId,oDataPayload);
                 }

             }
            }
             },
             function error (err) {
             }
         )


       });
      });


 function UpdateConsumption(thingId,oDataPayload){

   var loadingUpdateThings = nodeAE.put('/Things(%27'+thingId+'%27)/hcl.mlai.highclaritylightning:highclaritylight/PLCalculated', oDataPayload)
   loadingUpdateThings.then(
         function success (oResponse) {
          console.log("Data Updated-Demo-1");
         },
         function error (err) {
          console.log(err);
         }
   )
 }
