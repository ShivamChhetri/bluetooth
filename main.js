let devices=document.getElementById('devices');
class GenericDevice {

    constructor() {
      this.device = null;
      this.onDisconnected = this.onDisconnected.bind(this);
    }
    
    request() {
      let options = {
        "acceptAllDevices ": true,
        // "optionalServices": ["device_information"]
      };
      return navigator.bluetooth.requestDevice({acceptAllDevices: true})
      .then(device => {
        this.device = device;
        this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
      });
    }
    
    connect() {
      if (!this.device) {
        return Promise.reject('Device is not connected.');
      }
      return this.device.gatt.connect();
    }
    dispDetail(){
        //devices.innerHTML=`name:${device.name}\n id:${device.id}\n connected:${device.gatt.connected}`;
        //return;
        return this.device;
    }
    readManufacturername() {
      return this.device.gatt.getPrimaryService("device_information")
      .then(service => service.getCharacteristic("manufacturer_name_string"))
      .then(characteristic => characteristic.readValue());
    }
  
    disconnect() {
      if (!this.device) {
        return Promise.reject('Device is not connected.');
      }
      return this.device.gatt.disconnect();
    }
  
    onDisconnected() {
      console.log('Device is disconnected.');
    }
  }
  
  var genericDevice = new GenericDevice();
  
  document.querySelector('button').addEventListener('click', event => {
    genericDevice.request()
    .then(_ => genericDevice.connect())
    .then(_ => {
        //genericDevice.dispDetail();
        let device= genericDevice.dispDetail();
        devices.innerHTML=`name:${device.name}\n id:${device.id}\n connected:${device.gatt.connected}`;
    })
    .catch(error => { console.log(error) });
  });
