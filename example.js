
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
console.log(stringify(parsed, [Person]))

console.log('end')
