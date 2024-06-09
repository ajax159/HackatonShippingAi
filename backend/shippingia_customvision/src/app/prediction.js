const fs = require('fs');
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");

projectID = 'ddd549e4-ea75-4362-bce5-3d41d0ea4cb7';
InterationName = 'Iteration2'
endPoint = 'https://shippingia-prediction.cognitiveservices.azure.com/'
predictionKey = '1ca97bd3f4714bd8b50d707baa4aef55'

const predictor_credentials = new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": predictionKey } });
const predictor =  new PredictionApi.PredictionAPIClient(predictor_credentials, endPoint);


const cargarDatos = async  (urlImage) => {
    //console.log("Cargando imagen...")
    const testFile = fs.readFileSync('src/images/'+urlImage);
    const results = await predictor.detectImage(projectID, InterationName, testFile)


    // Show results
    var jsonObject = {};
    results.predictions.forEach(predictedResult => {
        if(predictedResult.probability > 0.9)
        {
           //console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%`);
           jsonObject.tagname = predictedResult.tagName;
           jsonObject.probability = predictedResult.probability;
           //console.log(tg);
        }
    });
    return jsonObject;
} 

exports.predicX = cargarDatos;