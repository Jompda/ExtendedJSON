
module.exports = stringify

/**
 * @param {*} obj 
 * @param {class[]?} classes 
 * @returns {string}
 */
function stringify(obj, classes) {
	const classMap = new Map()
	if (classes) classes.forEach(temp => classMap.set(temp.name, temp))

	if (obj === undefined) return ''

	const type = typeof obj

	if (type === 'object') {
		try {
			return object()
		} catch (e) {
			if (e !== 'skip') throw e
		}
	}
	function object() {
		if (obj === null) throw 'skip'
		if (obj instanceof Array) return sArray()

		const clss = classMap.get(obj.constructor.name)
		if (clss) return sClass(clss)
		return sObject()
	}

	if (type === 'string') return '"' + obj + '"'

	return String(obj)


	function sClass(clss) {
		return '(' + clss.name + ')' + sObject()
	}

	function sObject() {
		let result = '{', separator = ''
		const names = Object.getOwnPropertyNames(obj)

		for (const temp of names) {
			if (typeof obj[temp] === 'function') continue
			let s = stringify(obj[temp])
			if (s === '') continue
			result += separator + '"' + temp + '":' + s
			separator = ','
		}

		return result + '}'
	}

	function sArray() {
		let result = '[', separator = ''
		for (const temp of obj) {
			let s = stringify(temp, classes)
			if (s === '') s = 'null'
			result += separator + s
			separator = ','
		}
		return result + ']'
	}

}
