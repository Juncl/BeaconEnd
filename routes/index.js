var express = require('express');
var fs = require('fs');
var url = require('url');
var router = express.Router();

var data = [[],[],[]];
var sdata = [[],[],[]];
var rdata = [[],[],[]];

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/dtime', function(req, res, next) {
	res.render('dtime', { title: '信标节点' ,dtime:new Date().getTime()});
});

router.get('/dtest', function(req, res, next) {
	res.render('dtest', { title: '信标节点' });
});

router.post('/dataStream', function(req, res, next) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var dataStream = query.data;
	console.log(dataStream);
});

router.get('/dataStream', function(req, res, next) {
	// res.send(dataStream);
});

router.get('/micro', function(req, res, next) {
	var form = fs.readFileSync('./microphone.html', {encoding: 'utf8'});
	res.send(form);
});

router.get('/api', function(req, res, next) {
	console.log("Server time:" + new Date().getTime());
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).slice(7);

	var time = {};

	time.beaconId = query.beaconId;
	time.freq = query.freq;
	time.ip = ip;
	time.stime = new Date().getTime().toString();
	time.ctime = query.dtime;

	switch(query.beaconId){
		case '1':
			data[0].push(time);
			sdata[0].push(time.stime.slice(7));
			break;

		case '2':
			data[1].push(time);
			sdata[1].push(time.stime.slice(7));
			break;

		case '3':
			data[2].push(time);
			sdata[2].push(time.stime.slice(7));
			break;
		default:
			break;
	}

	console.log("ip "+ip);

	console.log("Beacon time:" + query.dtime);
	console.log("Server time:" + new Date().getTime());
    res.send({name:"Junc",age:40,time:new Date().getTime()});
});

router.get('/api2', function(req, res, next) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var id = query.id;
	var time = query.time.slice(7);

	switch(id){
		case '1':
			rdata[0].push(time);

			break;

		case '2':
			rdata[1].push(time);
			break;

		case '3':
			rdata[2].push(time);
			break;
		default:
			break;
	}
    res.send(data);
});

router.get("/rdata", function(req, res, next){
	res.send(rdata);
});

router.get("/sdata", function(req, res, next){
	res.send(sdata);
});

router.get("/timediff", function(req, res, next){
	var arr = [];
	arr[0] = diffTime(sdata[0], rdata[0]);
	arr[1] = diffTime(sdata[1], rdata[1]);
	arr[2] = diffTime(sdata[2], rdata[2]);
	res.send(arr);
})

function diffTime(s, r){
	var arr = [];
	var l1 = s.length;
	var l2 = r.length;

	var count = 0, s2 = 0;

	if(l1 > 3 && l2 > 3){
		for(var i = 0; i < l2; i++){
			for(var j = s2; j < l1; j++){
				if(r[i].slice(0, 3) == s[j].slice(0, 3)){
					arr.push(parseFloat(r[i])-parseFloat(s[j]));
					s2 = j + 1;
					break;
				}
				count++;
			}
		
		}
	}
	console.log("find times: "+count*l1);
	return arr;

}


module.exports = router;
