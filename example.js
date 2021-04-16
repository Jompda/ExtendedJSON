
class Person {
	constructor(obj) {
		console.log('tuli läpi')
		this.firstName = obj.firstName
		this.lastName = obj.lastName
		this.age = obj.age
		this.height = obj.height
		this.weight = obj.weight
	}
}

const src = require('fs').readFileSync('./test.json').toString()
const parse = require('./index.js')

console.log(parse(src, [Person]))
console.log('end')
