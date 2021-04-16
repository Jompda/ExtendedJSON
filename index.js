
/**
 * @param {string} str 
 * @param {class[]} classes 
 * @returns {*}
 */
module.exports = (str, classes) => {
	const classMap = new Map()
	classes.forEach(temp => classMap.set(temp.name, temp))

	const parsed = parse(str, 0)
	if (parsed.index < str.length) throw "Parsing failed, leftover characters at the end."
	return parsed.result

	/**
	 * @param {string} str 
	 * @param {number} i
	 */
	function parse(str, i) {
		i = skipWhitespace(str, i)

		for (const temp of [parseArray, parseObject, parseClass, parseString, parseNumber]) {
			try {
				return temp(str, i)
			} catch (e) {
				if (e !== false) throw e
			}
		}

		if (str.startsWith('true', i))
			return { result: true, index: i + 4 }
		if (str.startsWith('false', i))
			return { result: false, index: i + 5 }
		if (str.startsWith('null', i))
			return { result: null, index: i + 4 }

		throw "Unresolvable structure or value at " + i
	}

	/**
	 * @param {string} str 
	 * @param {number} i 
	 * @returns {{result:string,index:number}}
	 */
	function parseArray(str, i) {
		if (str[i] !== '[') throw false
		const alkiot = []
		i++
		while (i < str.length) {
			i = skipWhitespace(str, i)
			if (str[i] === ']') {
				i++
				break
			}
			if (str[i] === ',') {
				i++
				continue
			}
			const temp = parse(str, i)
			alkiot.push(temp.result)
			i = temp.index
		}
		return { result: alkiot, index: i }
	}

	/**
	 * @param {string} str 
	 * @param {number} i 
	 * @returns {{result:string,index:number}}
	 */
	function parseObject(str, i) {
		if (str[i] !== '{') throw false
		const obj = {}
		i++
		while (i < str.length) {
			i = skipWhitespace(str, i);
			if (str[i] === '}') {
				i++
				break
			}
			if (str[i] === ',') {
				i++
				continue
			}

			const temp1 = parseString(str, i)
			i = skipWhitespace(str, temp1.index);
			if (str[i] !== ':') throw "Illegal character at " + i
			const temp2 = parse(str, ++i)
			i = temp2.index
			obj[temp1.result] = temp2.result
		}
		return { result: obj, index: i }
	}

	/**
	 * @param {string} str 
	 * @param {number} i 
	 * @returns {{result:string,index:number}}
	 */
	function parseClass(str, i) {
		if (str[i] !== '(') throw false
		let className = ''
		for (i++; i < str.length; i++) {
			if (str[i] === ')') {
				i++
				break
			}
			className += str[i]
		}
		const clss = classMap.get(className)
		i = skipWhitespace(str, i)
		const temp = parseObject(str, i)
		return { result: new clss(temp.result), index: temp.index }
	}

	/**
	 * @param {string} str 
	 * @param {number} i 
	 * @returns {{result:string,index:number}}
	 */
	function parseString(str, i) {
		if (str[i] !== '"') throw false
		let cache = ''
		for (i++; i < str.length; i++) {
			if (str[i] === '"') {
				if (str[i - 1] !== '\\') {
					i++
					break
				} else {
					if (str[i - 2] !== '\\') {
						i++
						break
					}
				}
			}
			cache += str[i]
		}
		return { result: cache, index: i }
	}

	/**
	 * @param {string} str 
	 * @param {number} i 
	 * @returns {{result:string,index:number}}
	 */
	function parseNumber(str, i) {
		let isDecimal = false
		let cache = ''
		for (; i < str.length; i++) {
			if (/[0-9]/.test(str[i])) {
				cache += str[i]
				continue
			}
			if (str[i] === '.') {
				isDecimal = true
				cache += str[i]
				continue
			}
			break
		}

		if (cache.length <= 0) throw false

		let result
		if (isDecimal) result = Number.parseFloat(cache)
		else result = Number.parseInt(cache)
		return { result, index: i }
	}

	/**
	 * @param {string} str 
	 * @param {number} i 
	 * @returns {number}
	 */
	function skipWhitespace(str, i) {
		for (; i < str.length; i++)
			if (!/\s/.test(str[i])) return i
		return str.length
	}
}
