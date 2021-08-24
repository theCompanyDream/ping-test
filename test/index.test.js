var assert = require('assert')
const os = require('os')

var ping = require('../index')

describe('test ping', function () {

	const re = new RegExp('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')

	it('Get Ips', function () {
		for (const interface in os.networkInterfaces()){
			const ip = ping.get_ips(interface)
			
			assert( ip instanceof Array, `ip ${ip} of instance ${typeof ip}`)

			ip.forEach(ip => function () {
				assert(re.test(ip))
			})			
		}
		
	})

})
