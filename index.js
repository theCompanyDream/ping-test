const os = require('os')
const ping = require('ping')
const bunyan = require('bunyan')
	, bformat = require('bunyan-format')  
	, formatOut = bformat({ outputMode: 'short' })

var log = bunyan.createLogger({name: 'ping-test', stream: formatOut})

function get_ips(network_interface) {
	const interfaces = os.networkInterfaces()
	
	const chosen_interface = interfaces[network_interface]
	log.debug(`Interfaces present ${interfaces}`);
	const ips = chosen_interface.filter(ip => {
		return ip.family === 'IPv4' && ip.address != null
	}).map(ip => ip.address)
	
	return ips
}

async function ping_ip(ips) {
	return Promise.all(ips.map(async function (host) {
		let res = await ping.promise.probe(host, {
			timeout: 10
		})

		return res
	}))
}

function main() {
	var args = process.argv.slice(2)

	if (args[0]) {
		
		log.info('Get Ip addresses')
		const ips = get_ips(args[0])
		ping_ip(ips).then(async (data) => await log.info(data))
	
		log.info(`Pinging ${ips.toString()}....\n`)
	} else {
		log.fatal(`Information entered ${args[0]} is not valid or available use ${get_ips()}`)
	}
}

module.exports = {
	get_ips: get_ips,
	ping: ping_ip
}

if (require.main === module) {
	try {
		main();
	} catch (error) {
		log.error(error);
	}
}
