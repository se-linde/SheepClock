import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me } from "companion";

/* settingsStorage.onchange = function (evt) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    if (evt.key === "USDateFormat") {
      let data = JSON.parse(evt.newValue);
      messaging.peerSocket.send(data);
    }
  }
} */ 

settingsStorage.onchange = (evt) => {
  sendNewValue(evt.key, evt.newValue);
}

function sendNewValue(key, value){
  if(value != null){
    if(messaging.peerSocket.readyState === messaging.peerSocket.OPEN){
      messaging.peerSocket.send({key: key, value: JSON.parse(value)});
    }else{
      console.log("Error");
    }
  }  
}