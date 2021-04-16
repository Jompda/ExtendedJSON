
module.exports = stringify

/**
 * @param {*} obj 
 * @param {class[]?} classes 
 * @returns {string}
 */
function stringify(obj, classes) {
	const classMap = new Map()
	if (classes) classes.forEach(temp => classMap.set(temp.name, temp))

	const type = typeof obj
	console.log(type)

	if (type === 'object') {
		return 'TODO: stringify obj'
	}

	if (type === 'array') {
		return 'TODO: stringify array'
	}

	return String(obj)
}
