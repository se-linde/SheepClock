// Inspo from here: https://github.com/OSSClockApps/MinimalistClockFace/blob/master/app/index.js
// Now, publish!

import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { display } from "display";
import * as messaging from "messaging";
import { me } from "appbit";
import { today } from "user-activity"; 
import { battery } from "power";
import { locale } from "user-settings";
import * as util from "../common/utils";
import * as fs from "fs";
import * as messaging from "messaging";


const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

// I have commented out code for a floors/elevation 
// function, that I may get going in Version 2. 


// Get a handle on the <text> element
let timeLabel = document.getElementById("timeLabel");
let dateLabel = document.getElementById("dateLabel");
let stepLabel = document.getElementById("stepLabel");
let battLabel = document.getElementById("battLabel");
// let hillmanLabel = document.getElementById("hillmanLabel"); 

clock.granularity = "seconds";

let settings = loadSettings();
applySettings(); 


// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();

  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }

  // Time count 
  let minutes = util.zeroPad(today.getMinutes());
  let seconds = util.zeroPad(today.getSeconds());

  // Date count
  let day = util.zeroPad(today.getDate());
  let month = util.zeroPad(today.getMonth() + 1);
  let year = today.getFullYear();

  /// Time and date calculations
  timeLabel.text = `${hours}:${minutes}:${seconds}`;
  setDateDisplay(dateLabel, day, month, year, settings.USDateFormat);
  
  // Battery level calculations
  var battCount = (battery.chargeLevel); 
  battLabel.text = `${battCount}%`;   
}

// Trying from this page: https://github.com/Mayer-Studios/colorfulface/blob/master/app/index.js

// Steps and floors calculations 


function refresh_myActivity() {
  
// steps count
stepLabel.text = today.adjusted.steps;

// hills/floors count 
// let hillmanCount = today.adjusted.elevationGain || 0;     
// hillmanLabel.text = `${hillmanCount}`;  
// hillmanLabel.text = today.adjusted.elevationGain;
}

// Interval refresh rate
setInterval(refresh_myActivity, 50); 


// Date calculation function
function setDateDisplay(obj, d, m, y, format) {
  
  let date;
  
  date = `${m}/${d}/${y}`;
  obj.text = date; 
}
  


function applySettings() {
  // battLabel.style.display = settings.hideBattery ? "none" : "inherit";  
}



messaging.peerSocket.onmessage = evt => {
  const dateLabel = document.getElementById("dateLabel");

  let t = new Date();
  let d = util.zeroPad(t.getDate());
  let m = util.zeroPad(t.getMonth() + 1);
  let y = t.getFullYear();
  
  setDateDisplay(dateLabel, d, m, y, evt.data);

    if (evt.data.key == "fontColor") {
    settings.color = evt.data.value; 
  } else if (evt.data.key == "hideBattery") {
    settings.hideBattery = evt.data.value;
  } else if (evt.data.key == "hideDate") {
    settings.hideDate = evt.data.value;
  }
  
  applySettings(); 
  
}

me.onunload = saveSettings; 

function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    // Defaults
    return {
      USDateFormat: false,
      hideBattery: false
    }
  }
}

function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}







