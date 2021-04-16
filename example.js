
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
console.log(src)
const { parse, stringify } = require('./index.js')


console.log('--- PARSED RESULT1 ---')
const parsed1 = parse(src, [Person])
console.log(parsed1)
console.log()

const temp = [{ a: undefined, b: 'yup', c: () => 'result' }, true, false, null, 4, 5.6, undefined, parsed1]
console.log(temp)
console.log('--- STRINGIFIER RESULT ---')
const stringified = stringify(temp, [Person])
console.log(stringified)
console.log()


console.log('--- PARSED RESULT2 ---')
const parsed2 = parse(stringified, [Person])
console.log(parsed2)

console.log('end')
