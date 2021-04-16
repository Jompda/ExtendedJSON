
class Person {
	constructor(obj) {
		this.firstName = obj.firstName
		this.lastName = obj.lastName
		this.fullName = this.firstName + ' ' + this.lastName
		this.age = obj.age
		this.height = obj.height
		this.weight = obj.weight
	}
}

const src = require('fs').readFileSync('./test.json').toString()
const { parse, stringify } = require('./index.js')

console.log(src)
console.log('--- PARSED RESULT ---')
const parsed = parse(src, [Person])
console.log(parsed)

console.log('--- STRINGIFIER RESULT ---')
const temp = [{ a: undefined, b: 'yup', c: () => 'result' }, true, false, null, 4, 5.6, undefined, parsed]
console.log(temp)
console.log(stringify(temp, [Person]))
console.log('end')
