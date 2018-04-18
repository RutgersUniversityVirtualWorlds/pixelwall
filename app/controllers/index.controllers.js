let description = require('../../config/description.json');

exports.description = function(req, res) {
  res.header("Content-Type",'application/json');
  res.send(JSON.stringify(description, null, 4));
};

exports.attribute = function(req,res) {
  //handle case where doesn't exist
  res.header("Content-Type",'application/json');
  res.send(JSON.stringify(description[req.params.attribute], null, 4));
};

exports.property = function(req, res) {
  let propertyObj = {};
  let property = req.params.property;

  propertyObj[property] = req.device.properties[property];

  res.header("Content-Type",'application/json');
  res.send(JSON.stringify(propertyObj, null, 4));
};

exports.on = function(req, res) {

  if(typeof req.body.on === 'boolean') {
    if(req.device.properties.on !== req.body.on) {
      //update object properties
      req.device.properties.on = req.body.on;
      //set property on device
      if(req.body.on) {
        //set device to on state. Need to set this in Firmata code
      }
      else {
        req.device.leds.clear();
        req.device.leds.show();
      }
    }
  }

  let onProperty = {
    on: req.device.properties.on
  }

  res.header("Content-Type",'application/json');
  res.send(JSON.stringify(onProperty, null, 4));
};