const os = require('os')
const ping = require('ping')

function get_ips(network_interface) {
	const interfaces = os.networkInterfaces()
	
	const chosen_interface = interfaces[network_interface]

	const ips = chosen_interface.map(ip => {
		if (ip.family === 'IPv4' && !ip.internal && ip.address != null) {
			return ip.address
		}
	})
	
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
		
		console.log('Get Ip addresses')
		const ips = get_ips(args[0])
		ping_ip(ips).then(async (data) => await console.log(data))
	
		console.log(`Pinging ${ips.toString()}....\n`)
	} else {
		console.log(`Information entered ${args[0]} is not valid or available`)
	}
}

if (require.main === module) {
	main();
}