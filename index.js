
/**
 * @param {string} str 
 * @param {class[]} classes 
 * @returns {*}
 */
module.exports = (str, classes) => {
	const findClass = className =>
		classes.find(temp => temp.name === className)
	return parse(str, 0).result

	/**
	 * @param {string} str 
	 */
	function parse(str, startIndex) {
		let result = undefined
		let index = skipWhitespace(str, startIndex)

		if (str[index] === '[') {
			const alkiot = []
			let i = index + 1
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
			result = alkiot
			index = i
		}

		else if (str[index] === '{') {
			const temp = parseObject(str, index)
			result = temp.result
			index = temp.index
		}

		else if (str[index] === '(') {
			let className = ''
			let i = index + 1
			for (; i < str.length; i++) {
				if (str[i] === ')') {
					i++
					break
				}
				className += str[i]
			}
			const clss = findClass(className)
			if (str[i] !== '{') throw "Illegal character at " + i
			const temp = parseObject(str, i)
			result = new clss(temp.result)
			index = temp.index
		}

		else if (str[index] === '"') {
			const temp = parseString(str, index)
			result = temp.result
			index = temp.index
		}

		else if (str.startsWith('true', index)) {
			result = true
			index += 4
		}
		else if (str.startsWith('false', index)) {
			result = false
			index += 5
		}
		else if (str.startsWith('null', index)) {
			result = null
			index += 4
		}

		else { // parse number
			let isDecimal = false
			let cache = ''
			let i = index
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

			if (cache.length > 0) {
				if (isDecimal) result = Number.parseFloat(cache)
				else result = Number.parseInt(cache)
			} else throw "Unresolvable structure or value at " + i

			index = i
		}

		return { result, index }
	}

	function parseObject(str, startingIndex) {
		const obj = {}
		let i = startingIndex + 1
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

			if (str[i] !== '"') throw "Illegal character at " + i
			const temp1 = parseString(str, i)
			i = skipWhitespace(str, temp1.index);
			if (str[i] !== ':') throw "Illegal character at " + i
			const temp2 = parse(str, ++i)
			i = temp2.index
			obj[temp1.result] = temp2.result
		}
		return { result: obj, index: i }
	}

	function parseString(str, startingIndex) {
		let cache = ''
		let i = startingIndex + 1
		for (; i < str.length; i++) {
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

	function skipWhitespace(str, startIndex) {
		for (let i = startIndex; i < str.length; i++) {
			if (!/\s/.test(str[i])) return i
		}
		return str.length
	}
}
