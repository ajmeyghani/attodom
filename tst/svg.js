/* global document */
var JSDOM = require('jsdom').JSDOM

var window = (new JSDOM).window
//@ts-ignore
global.document = window.document


var ct = require('cotest'),
		svg = require('../svg')

ct('svg', function() {
	ct('===', svg('svg').nodeType, 1)
	ct('===', svg('path').nodeType, 1)

	ct('===', svg('path').attributes.length, 0)
	ct('===', svg('path', {d: 'm37', stroke: 'green'}).attributes.length, 2)
	ct('===', svg('path', {d: 'm37'}, {stroke: 'green'}).attributes.length, 2)

	ct('===', svg('g').childNodes.length, 0)
	ct('===', svg('svg', svg('g'), svg('g')).childNodes.length, 2)
})

ct('svg - event', function() {
	var kin = svg('path', {onclick: function(e) { this.textContent += e.target.tagName }})
	kin.dispatchEvent(new window.Event('click', {bubbles:true}))
	ct('===', kin.textContent, 'path')
})

ct('svg - synthetic event', function() {
	var h2 = svg('path'),
			h1 = svg('svg', {onClick: function(e) { this.textContent = e.target.tagName }}, h2)
	document.body.appendChild(h1)
	h2.dispatchEvent(new window.Event('click', {bubbles:true}))
	ct('===', h1.textContent, 'path')
	h1.dispatchEvent(new window.Event('click', {bubbles:true}))
	ct('===', h1.textContent, 'svg')
})

