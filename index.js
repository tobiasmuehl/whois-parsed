var util = require('util'),
	whois = require('whois-raw'),
	parseRawData = require('./parse-raw-data.js');

var lookup = util.promisify(whois.lookup);

module.exports = {
  lookup: async function(domain, options = {}) {
		// Where possible don't follow the detailed results to improve efficiency
	  if (options && !options.hasOwnProperty('follow')) {
		  if (domain.endsWith('.org') ||
			    domain.endsWith('.net') ||
			    domain.endsWith('.com')) {
		  	options['follow'] = 0
		  }
	  }

	  var result = {};
		  var rawData = await lookup(domain, options || {});

		  if ( typeof rawData === 'object' ) {
			  result = rawData.map(function(data) {
				  data.data = parseRawData(data.data, domain);
				  return data;
			  });
		  } else {
			  result = {...result, ...parseRawData(rawData, domain)};
		  }
		  return result;

  }
};
