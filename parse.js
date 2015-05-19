var countJSON = require('./rawdata/april-out.json'),
	geoJSON = require('./rawdata/TpeMRTStations_TWD97.json'),
	countMAP = [],
	countTotalMap = {};

// Calculate data by day
for( var day in countJSON.result.results ) {
	
	for( var key in countJSON.result.results[day] ) {
	
		if( key != '_id' && key != '日期' ) {
			
			var num = parseInt(countJSON.result.results[day][key].replace(',', ''), 10);
			
			if( countTotalMap[key] == undefined )
				countTotalMap[key] = num;
			else
				countTotalMap[key] += num;
		}
	}
}

// Make sortable array
for( var key in countTotalMap ) {
	countMAP.push([key, countTotalMap[key]]);
}

// Providing a compare function to sort array
countMAP = countMAP.sort(function(a, b) {
	return b[1] - a[1]
});


for( var item in countMAP ) {

	// Calcuate color code
	var code = parseInt(255 - item * 2.3);

	if(code.toString(16).length == 1)
		code = '0' + code.toString(16) + '0000';
	else
		code = code.toString(16) + "0000";
	
	updateColor(countMAP[item][0], code, countMAP[item][1], (parseInt(item) + 1));

	// Simple callback
	if(item == 106)
		console.log(JSON.stringify(geoJSON, null, 4));
}

function updateColor( name, code, count, rank ) {
	
	for( var i = 0; i < geoJSON.features.length; i++ ) {

		if( name == geoJSON.features[i].properties.NAME ||
			name + '站' == geoJSON.features[i].properties.NAME ) {
			
			geoJSON.features[i].properties["marker-color"] = "#" + code;
			
			var symbol = '';
			if( rank < 35 ) {
				size = 'large';
				symbol = 'circle-stroked';
			}
			else if( rank >= 35 && rank <= 70 )
				size = 'medium';
			else 
				size = 'small';

        	geoJSON.features[i].properties["marker-size"] = size;
        	geoJSON.features[i].properties["marker-symbol"] = symbol;
        	geoJSON.features[i].properties["count"] = count;
        	geoJSON.features[i].properties["rank"] = rank;
        	geoJSON.features[i].properties["rank-percentage"] = Math.floor(rank/107*100) + '%';

			break;
		}
	}
}
