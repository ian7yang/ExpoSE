const Config = require("./Config");
const Default = require("./Strategies/Default");
const Deterministic = require("./Strategies/Deterministic");
const Random = require("./Strategies/Random");
const BucketsDeterministic = require("./Strategies/BucketsDeterministic");

module.exports = (function() {
	const strat = Config.testStrategy; 
	switch (strat) {
	case "default": return Default;
	case "deterministic": return Deterministic;
	case "buckets_deterministic": return BucketsDeterministic;
	case "random": return Random;
	default: throw "Strategy Error";
	}
})();
