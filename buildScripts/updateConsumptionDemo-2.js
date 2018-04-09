
var NodeAE = require('../sdk/iot-application-services-sdk-nodejs-master');
var nodeAE = new NodeAE();
nodeAE.setBaseURI('appiot-mds');
var schedule = require('node-schedule');

var thingIds = ["FC8F333992A34B25BA9D8119D72EE155","52390BFFB7FE4F8C9C6B926AA5402FE8","4B5060B173CD40A1A000D6B21BA63BB7"];

var startTime = new Date(Date.now());
var endTime = new Date(startTime.getTime() + 100000000000000);
var j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/100000000 * * * * *' }, function(){
        thingIds.forEach(function(thingId){
        var d = new Date();
        var hour_date = d.toISOString() ;
        var fromDate = new Date(hour_date);
        fromDate.setHours(fromDate.getHours() - 1);
        console.log("Running For DeviceId: " +thingId + " For Duration between: "+ fromDate.toISOString() + "TO: "+ hour_date);
        var loadingThingsRHHueLight = nodeAE.get('/Things(%27'+thingId+'%27)/hcl.mlai.highclaritylightning:highclaritylight/hclight?timerange='+fromDate.toISOString()+'-'+hour_date+'&$orderby=_time&$filter=brightness gt 0');
        loadingThingsRHHueLight.then(
            function success (oResponse) {
             var data = JSON.parse(oResponse.body);

             if(data.value.length>0){
             var positive=0;
             var red=0;
             var green=0;
             var blue=0;

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

                    if(data.value[i].brightness>0)
                    {
                        var colorName= FindTheColor(data.value[i].color_x,data.value[i].color_y,data.value[i].brightness);
                        if (colorName=="Red")
                        {
                            red+=1
                        }
                        else if (colorName=="Green")
                        {
                            green+=1
                        }
                        else
                        {
                            blue+=1
                        }
                    }

                }
            }

            var result = 0;
            if(positive>0)
            {
                result=  (positive/ 3600) * 100;
            }
            var redColorUtilisation= (red/(red+green+blue)) * 100;
            var greenColorUtilisation= (green/(red+green+blue)) * 100;
            var blueColorUtilisation = (blue/(red+green+blue)) * 100;
            var minRedActive =(redColorUtilisation / 100) * 3600;
            var minGreenActive =(greenColorUtilisation / 100) * 3600;
            var minBlueActive =(blueColorUtilisation / 100) * 3600;
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
                        "PowerTotalWeek": powerTotalWeek,
                        "UtilisationRedClr":redColorUtilisation,
                        "UtilisationGreenClr":greenColorUtilisation,
                        "UtilisationBlueClr":blueColorUtilisation,
                        "MinutesRedActive": Math.floor(minRedActive/60),
                        "MinutesGreenActive": Math.floor(minGreenActive/60),
                        "MinutesBlueActive": Math.floor(minBlueActive/60)
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
      console.log("Data Updated-Demo-2");
    },
    function error (err) {
     console.log(err);
    }
  )
}
function FindTheColor(xInString,yInString,brightness)
{

    var x = parseFloat(xInString);
    var y = parseFloat(yInString);

    z = 1.0 - x - y;
    Y = brightness / 255.0;
    X = (Y / y) * x;
    Z = (Y / y) * z;
    r = X * 1.612 - Y * 0.203 - Z * 0.302;
    g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    b = X * 0.026 - Y * 0.072 + Z * 0.962;
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
    maxValue = Math.max(r, g, b);
    r /= maxValue;
    g /= maxValue;
    b /= maxValue;
    r = r * 255;
    if (r < 0) {
                    r = 255
    };
    g = g * 255;
    if (g < 0) {
                    g = 255
    };
    b = b * 255;
    if (b < 0) {
                    b = 255
    };


    if(r>g && r>b)
    {
        return "Red";
    }
    else if(g>r && g>b)
    {
        return "Green";
    }
    else
    {
        return "Blue";
    }

}
