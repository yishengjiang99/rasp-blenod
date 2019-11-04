/*
This is just for reference.
To use me:
npm install bleno
node peripheral.js
*/
var bleno = require('bleno');
var now = Date.now();
console.log('Starting ' + now);

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);
  if (state === 'poweredOn') {
    bleno.startAdvertising('danthings' + now, ['fffffffffffffffffffffffffffffff0']);
  } else {
    bleno.stopAdvertising();
  }
});

var Descriptor = bleno.Descriptor;
var descriptor = new Descriptor({
    uuid: '2901',
    value: 'value' // static value, must be of type Buffer or string if set
});

var Characteristic = bleno.Characteristic;
var characteristic = new Characteristic({
    properties: [ 'read', 'write', 'writeWithoutResponse' ], // can be a combination of 'read', 'write', 'writeWithoutResponse', 'notify'
    secure: [ ], // enable security for properties, can be a combination of 'read', 'write', 'writeWithoutResponse', 'notify'
    value: 'ff', // optional static value, must be of type Buffer
    descriptors: [
        descriptor
    ],
    onReadRequest: function(offset, callback) {
			console.log('onReadRequest');
			callback(Characteristic.RESULT_ATTR_NOT_LONG, null);
		}, // optional read request handler, function(offset, callback) { ... }
    onWriteRequest: function(data, offset, withoutResponse, callback) {
			console.log('');
			console.log('');
			console.log('');
			console.log('onWriteRequest');
			console.log('We got: ' + data); // THIS BIT HERE is where we get data 
			callback(Characteristic.RESULT_SUCCESS);
		},
    onSubscribe: null,
    onUnsubscribe: null,
    onNotify: null
});
var PrimaryService = bleno.PrimaryService;
var primaryService = new PrimaryService({
    uuid: 'fffffffffffffffffffffffffffffff0', // or 'fff0' for 16-bit
    characteristics: [ characteristic ],
    
});
var services = [ primaryService ];

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  if (error) {
		console.log('Exiting');
		process.exit(1);
	} else {
	  console.log('Starting');
    bleno.setServices(
			services
		);
  }
});

process.on('exit', function() {
	console.log('Shutting down');
	bleno.stopAdvertising();
	console.log('Done');
});


