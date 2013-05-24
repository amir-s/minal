process.stdin.setRawMode(true);


setTimeout(function () {
	process.exit();
}, 5000);


process.stdin.on('data', function (e) {
	var arr = [];
	for (var i=0; i< e.length; i++) arr.push(String.fromCharCode(e[i]));
		console.log(e);
	console.log(arr.join(","));
});