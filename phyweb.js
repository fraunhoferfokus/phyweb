/*
 * Copyright 2014 Fraunhofer FOKUS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * AUTHORS: Louay Bassbouss <louay.bassbouss@fokus.fraunhofer.de>
 *          Martin Lasak <martin.lasak@fokus.fraunhofer.de>
 */
//Example for USAGE: node phyweb http://www.fokus.fraunhofer.de http://www.fokus.fraunhofer.de/fame http://www.google.com http://www.fokus.fraunhofer.de/go/mws
var urls = process.argv.slice(2);
var timeString = function(){
	return new Date().toTimeString().split(" ")[0];
}

if(urls.length == 0){
	console.log("USAGE: node phyweb URL [URL2] [URL3] ...");
	return;
}
var os = require('os');
var ssdp = require("peer-ssdp");
var SERVER = os.type() + "/" + os.release() + " UPnP/1.1 phyweb/0.0.1";
var PHYSICAL_WEB_SSDP_TYPE = "urn:physical-web-org:device:Basic:1";
var uuid = (function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
})();
var peer = ssdp.createPeer();
process.on('SIGINT', function() {
	console.log(timeString(),"*** stopping phyweb");
	for(var i in urls){
		var url = urls[i];
		peer.byebye({
			NT: PHYSICAL_WEB_SSDP_TYPE,
			USN: "uuid:" + uuid + "::"+PHYSICAL_WEB_SSDP_TYPE,
			LOCATION: url,
			SERVER: SERVER
		});
	}
	setTimeout(function(){
		peer.close();
		process.exit();
	},1000);
});
peer.on("ready", function () {
    console.log(timeString(),"*** phyweb is ready");
	for(var i in urls){
		var url = urls[i];
		peer.alive({
			NT: PHYSICAL_WEB_SSDP_TYPE,
			USN: "uuid:" + uuid + "::"+PHYSICAL_WEB_SSDP_TYPE,
			LOCATION: url,
			SERVER: SERVER
		});
	}
}).on("search", function (headers, address) {
	var ST = headers.ST;
	if(ST != PHYSICAL_WEB_SSDP_TYPE){
		return;
	}
	var timeout = parseInt((parseInt(headers.MX) || 0)*800*Math.random());
	console.log(timeString(),">>> receive request from a physical-web client",address.address);
	setTimeout(function(){
		for(var i in urls){
			var url = urls[i];
			var headers = {
				LOCATION: url,
				SERVER: SERVER,
				ST: PHYSICAL_WEB_SSDP_TYPE,
				USN: "uuid:" + uuid + "::"+PHYSICAL_WEB_SSDP_TYPE
			};
			console.log(timeString(),"<<< send",url,"to physical-web client", address.address);
			peer.reply(headers, address);
		}
	},timeout);
    

}).on("close", function () {
    console.log(timeString(),"*** phyweb stopped");
}).start();
 
 