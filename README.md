# Node.js Pyhsical Web Advertiser

`phyweb` is a Node.js advertiser for [Physical-Web](https://github.com/google/physical-web). It supports currently advertising URLs over SSDP protocol. 

## Requirement

* Requires [Node.js][http://nodejs.org/] >= 0.10.x (tested with v0.10.25)
* No Platform requirements: Win, Linux and Mac are supported

## Setup

* clone module and install dependencies

	```
	git clone 
	cd phyweb
	npm install
	```

## Usage

* run following command in `phyweb` folder

	```
	node phyweb URL [URL2] [URL2] ...
	```

* Example: advertise the two URLs `http://www.fokus.fraunhofer.de/fame` and `http://physical-web.org`  	
	
	```
	node phyweb URL http://www.fokus.fraunhofer.de/fame http://physical-web.org
	```

## How it works?

 phyweb waits for SSDP `M-SEARCH` requests with type `urn:physical-web-org:device:Basic:1` from Physical-Web clients and replies with a SSDP packet for each URL. Below are the SSDP search and response SSDP packets for the example above:

* Physical-Web Client e.g. Android or iOS client sends the following SSDP `M-SEARCH` Packet:
	
	```
	M-SEARCH * HTTP/1.1
	HOST: 239.255.255.250:1900
	MAN: "ssdp:discover"
	MX: 2
	ST: urn:physical-web-org:device:Basic:1
	```
 
* phyweb receives the `M-SEARCH` request and responds with the following SSDP packets (one packet for each URL):

	```
	HTTP/1.1 200 OK
	NT: urn:physical-web-org:device:Basic:1
	USN: uuid:6bd5eabd-b7c8-4f7b-ae6c-a30ccdeb5988::urn:physical-web-org:device:Basic:1
	LOCATION: http://www.fokus.fraunhofer.de/fame
	SERVER: Windows_NT/6.1.7601 UPnP/1.1 phyweb/0.0.1
	```

	```
	HTTP/1.1 200 OK
	NT: urn:physical-web-org:device:Basic:1
	USN: uuid:6bd5eabd-b7c8-4f7b-ae6c-a30ccdeb5988::urn:physical-web-org:device:Basic:1
	LOCATION: http://physical-web.org
	SERVER: Windows_NT/6.1.7601 UPnP/1.1 phyweb/0.0.1
	```

* Physical-Web client needs to read the `LOCATION` header and pass the URL (value of `LOCATION` header) to the corresponding component in the Physical-Web client for further processing and then to display the result to the user.	

## License

Copyright 2014 Fraunhofer FOKUS

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## Contact

[Fraunhofer FOKUS - Competence Center FAME // Future Applications and Media](http://www.fokus.fraunhofer.de/fame)