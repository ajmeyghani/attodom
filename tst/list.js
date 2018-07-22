var ct = require('cotest'),
		el = require('../').el,
		ls = require('../').list,
		core = require('../core'),
		update = require('../').update,
		updateChildren = require('../').updateChildren,
		JSDOM = require('jsdom').JSDOM

var window = (new JSDOM).window
core.document = window.document

function toString(nodes) {
	var str = ''
	if (nodes) for (var i=0; i<nodes.length; ++i) if (nodes[i].nodeType!==8) str+=nodes[i].textContent
	return str
}
function setText(n,t) {
	n.textContent = t
}
function upperKid(t) {
	return el('p', t.toUpperCase(), setText)
}

ct('list detached', function() {
	var list = ls(upperKid)
	update(list, ['a'])
	ct('===', toString(list.parentNode.childNodes), 'A')
	update(list, ['a', 'b'])
	ct('===', toString(list.parentNode.childNodes), 'aB')
	update(list, ['a'])
	ct('===', toString(list.parentNode.childNodes), 'a')
})
ct('list mounted', function() {
	var list = ls(upperKid),
			kin = el('div', list, updateChildren)
	ct('===', toString(kin.childNodes), '')
	update(kin, ['a'])
	ct('===', toString(kin.childNodes), 'A')
	update(kin, ['a', 'b'])
	ct('===', toString(kin.childNodes), 'aB')
	update(kin, ['a'])
	ct('===', toString(list.parentNode.childNodes), 'a')
})
ct('list mounted with next', function() {
	var list = ls(upperKid),
			kin = el('div', list, '$', updateChildren)
	ct('===', toString(kin.childNodes), '$')
	update(kin, ['a'])
	ct('===', toString(kin.childNodes), 'A$')
	update(kin, ['a', 'b'])
	ct('===', toString(kin.childNodes), 'aB$')
	update(kin, ['a'])
	ct('===', toString(list.parentNode.childNodes), 'a$')
})
ct('list keyed', function() {
	var kin = el('h0', ls(
		function(o) { return el('p', o.v, function(n,v) { n.textContent = v.v.toUpperCase() }) },
		function(o) { return o.k }
	), updateChildren)
	ct('===', toString(kin.childNodes), '')
	update(kin, [{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
	ct('===', toString(kin.childNodes), 'abc')
	update(kin, [{k: 'c', v:'c'}, {k: 'd', v:'d'}, {k: 'e', v:'e'}, ])
	ct('===', toString(kin.childNodes), 'Cde')
	update(kin, [{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
	ct('===', toString(kin.childNodes), 'abC')
})
ct('list multiple', function() {
	var kin = el('div', ls(upperKid), '$', ls(upperKid), ls(upperKid), updateChildren)
	ct('===', toString(kin.childNodes), '$')
	update(kin, ['a'])
	ct('===', toString(kin.childNodes), 'A$AA')
	update(kin, ['a', 'b'])
	ct('===', toString(kin.childNodes), 'aB$aBaB')
})
