var root = require('./root'),
		mount = require('./mount')

var svgURI = 'http://www.w3.org/2000/svg'

/**
 * @param {string} tagName
 * @return {Element}
 */
module.exports = function(tagName) {
	var node = root.document.createElementNS(svgURI, tagName)
	for (var i=1; i<arguments.length; ++i) {
		var arg = arguments[i]
		if (arg != null) {
			if (arg.constructor && arg.constructor !== Object) mount(node, arg)
			else for (var j=0, ks=Object.keys(arg); j<ks.length; ++j) {
				var key = ks[j],
						val = arg[key]
				if (typeof val !== 'string') node[key] = val
				else node.setAttribute(key, val)
			}
		}
	}
	return node
}
