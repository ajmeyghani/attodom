/* global document */
var JSDOM = require('jsdom').JSDOM
//@ts-ignore
global.document = (new JSDOM).window.document

var ct = require('cotest'),
		el = require('../').el,
		ls = require('../').list,
		updateChildren = require('../').updateChildren,
		setter = require('../setter')

var setText = setter('textContent')

function toString(nodes) {
	var str = ''
	if (nodes) for (var i=0; i<nodes.length; ++i) if (nodes[i].nodeType!==8) str+=nodes[i].textContent
	return str
}
function upperKid(t) {
	return el('p', t.toUpperCase(), {update: setText})
}

ct('list detached', function() {
	var list = ls(upperKid)
	//@ts-ignore
	list.update(['a'])
	ct('===', toString(list.parentNode.childNodes), 'A')
	//@ts-ignore
	list.update(['a', 'b'])
	ct('===', toString(list.parentNode.childNodes), 'aB')
	//@ts-ignore
	list.update(['a'])
	ct('===', toString(list.parentNode.childNodes), 'a')
})

ct('list mounted', function() {
	var list = ls(upperKid),
			kin = el('div', list, {update: updateChildren})
	ct('===', toString(kin.childNodes), '')
	//@ts-ignore
	kin.update(['a'])
	ct('===', toString(kin.childNodes), 'A')
	//@ts-ignore
	kin.update(['a', 'b'])
	ct('===', toString(kin.childNodes), 'aB')
	//@ts-ignore
	kin.update(['a'])
	ct('===', toString(list.parentNode.childNodes), 'a')
})

ct('list mounted with next', function() {
	var list = ls(upperKid),
			kin = el('div', list, '$', {update: updateChildren})
	ct('===', toString(kin.childNodes), '$')
	//@ts-ignore
	kin.update(['a'])
	ct('===', toString(kin.childNodes), 'A$')
	//@ts-ignore
	kin.update(['a', 'b'])
	ct('===', toString(kin.childNodes), 'aB$')
	//@ts-ignore
	kin.update(['a'])
	ct('===', toString(list.parentNode.childNodes), 'a$')
})

ct('list function key getter', function() {
	var kin = el('h0', ls(
		function(o) { return o.k },
		function(o) { return el('p', o.v, {update: function(v) { this.textContent = v.v.toUpperCase() }}) }
	), {update: updateChildren})
	ct('===', toString(kin.childNodes), '')
	//@ts-ignore
	kin.update([{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
	ct('===', toString(kin.childNodes), 'abc')
	//@ts-ignore
	kin.update([{k: 'c', v:'c'}, {k: 'd', v:'d'}, {k: 'e', v:'e'}, ])
	ct('===', toString(kin.childNodes), 'Cde')
	//@ts-ignore
	kin.update([{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
	ct('===', toString(kin.childNodes), 'abC')
})

ct('list string key getter', function() {
	var kin = el('h0', ls(
		'k',
		function(o) { return el('p', o.v, {update: function(v) { this.textContent = v.v.toUpperCase() }}) }
	), {update: updateChildren})
	ct('===', toString(kin.childNodes), '')
	//@ts-ignore
	kin.update([{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
	ct('===', toString(kin.childNodes), 'abc')
	//@ts-ignore
	kin.update([{k: 'c', v:'c'}, {k: 'd', v:'d'}, {k: 'e', v:'e'}, ])
	ct('===', toString(kin.childNodes), 'Cde')
	//@ts-ignore
	kin.update([{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
	ct('===', toString(kin.childNodes), 'abC')
})

ct('list multiple', function() {
	var kin = el('div', ls(upperKid), '$', ls(upperKid), ls(upperKid), {update: updateChildren})
	ct('===', toString(kin.childNodes), '$')
	//@ts-ignore
	kin.update(['a'])
	ct('===', toString(kin.childNodes), 'A$AA')
	//@ts-ignore
	kin.update(['a', 'b'])
	ct('===', toString(kin.childNodes), 'aB$aBaB')
})
