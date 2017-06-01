import {D} from './document'
import {attoKey} from './atto-key'
import {CElementProto} from './_c-element'


/**
 * @constructor
 * @param {!Function} factory
 * @param {Function} [getKey]
 */
export function CKeyed(factory, getKey) {
	this.refs = Object.create(null)
	this.factory = factory
	if (getKey) this.getKey = getKey

	this.node = D.createComment('^')
	this.foot = D.createComment('$')
	this.node[attoKey] = this
	this.foot[attoKey] = this
}

export var CKeyedProto = CKeyed.prototype = {
	constructor: CKeyed,
	set: CElementProto.set,
	prop: CElementProto.prop,
	wrap: CElementProto.wrap,
	get parent() { return this.node.parentNode[attoKey] },
	remove: remove,
	destroy: remove,


	/**
	* @function moveTo
	* @param  {!Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var foot = this.foot,
				next = this.node,
				origin = next.parentNode,
				anchor = before || null

		if (!parent.nodeType) throw Error('invalid parent node')

		if (origin !== parent || (anchor !== foot && anchor !== foot.nextSibling)) {

			if (origin) { // relocate
				var cursor
				do next = (cursor = next).nextSibling
				while (parent.insertBefore(cursor, anchor) !== foot)
			}
			else { // insertion
				parent.insertBefore(next, anchor)
				parent.insertBefore(foot, anchor)
			}
		}
		return this
	},

	_placeItem: function(parent, item, spot, foot) {
		if (!spot) item.moveTo(parent)
		else if (item.node === spot.nextSibling) spot[attoKey].moveTo(parent, foot)
		else if (item.node !== spot) item.moveTo(parent, spot)
		return item.foot || item.node
	},

	getKey: function(v,i,a) { //eslint-disable-line no-unused-vars
		return i  // default: indexed
	},
	update: updateKeyedChildren,
	updateChildren: updateKeyedChildren,
}


/**
* @function remove
* @return {!Object} this
*/
function remove() {
	var head = this.node,
			origin = head.parentNode,
			spot = head.nextSibling

	if (origin) {
		if (spot !== this.foot) do {
			var item = this.foot.previousSibling[attoKey]
			item.destroy()
		} while (item !== spot[attoKey])
		origin.removeChild(this.foot)
		origin.removeChild(head)
	}

	return this
}

function updateKeyedChildren(arr) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			refs = Object.create(null)

	for (var i = 0; i < arr.length; ++i) {
		var key = this.getKey(arr[i], i, arr),
				item = refs[key] = items[key] || this.factory(this.config)
		if (item.update) item.update(arr[i], i, arr)
		spot = this._placeItem(parent, item, spot, foot).nextSibling
	}
	this.refs = refs

	if (spot !== this.foot) do {
		item = foot.previousSibling[attoKey]
		item.destroy()
	} while (item !== spot[attoKey])

	return this
}