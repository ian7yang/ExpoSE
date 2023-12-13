/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */


const NotAnErrorException = require("../NotAnErrorException");
const { isNative } = require("../Utilities/IsNative");
const { ConcolicValue } = require("../Values/WrappedValue");

const Helpers = require('./Helpers');
const MathModels = require('./MathModels');
const ArrayModels = require('./ArrayModels');
const StringModels = require('./StringModels');
const FnModels = require('./FnModels');
const RegexModels = require('./RegexModels');
const DOMModels = require('./DOMModels');
const JSONModels = require('./JSONModels');

function Model() {
	this._models = [];

	this.add = function(fn, mdl) {
		this._models.push({ 
			fn: fn,
			mdl: function() {
				return mdl.call(null, this, arguments);
			}
		});
	};

	this.get = function(fn) {
		const found = this._models.find(x => x.fn == fn);
		return found ? found.mdl : null;
	};
}

/**
 * Builds a set of function models bound to a given SymbolicState
 */
function BuildModels(state) {
	const ctx = state.ctx;
	const model = new Model();
	const helpers = Helpers(state, ctx, model);

	MathModels(state, ctx, model, helpers);
	StringModels(state, ctx, model, helpers);
	RegexModels(state, ctx, model, helpers);
	ArrayModels(state, ctx, model, helpers);
	FnModels(state, ctx, model, helpers);
  DOMModels(state, ctx, model, helpers);
  JSONModels(state, ctx, model, helpers);

	/**
	 * Models for methods on Object
	 */
	model.add(Object, function(base, args) {
		const concrete = state.concretizeCall(Object, base, args, false);
		let result = Object.apply(concrete.base, concrete.args);

		if (!(concrete.args[0] instanceof Object) && state.isSymbolic(args[0])) {
			result = new ConcolicValue(result, state.asSymbolic(args[0]));
		}

		return result;
	});

	/**
	 * Secret _expose hooks for symbols.js
	 */

	Object._expose = {};
	Object._expose.makeSymbolic = function(name, initial) { return state.createSymbolicValue(name, initial); };
	Object._expose.notAnError = function() { return NotAnErrorException; };
	Object._expose.pureSymbol = function(name) { return state.createPureSymbol(name); };

	return model;
}

module.exports = BuildModels;
