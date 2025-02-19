/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

const External = require("./External");

const process = External.load("process");

function Default(i, d) {
	const envvar = process.env[`EXPOSE_${i}`];
	return envvar || d;
}

module.exports = {
	incrementalSolverEnabled: !!Default("USE_INCREMENTAL_SOLVER", true),
	maxRefinements: Number.parseInt(Default("MAX_REFINEMENTS", "40")),
	maxSolverTime: Number.parseInt(Default("MAX_SOLVER_TIME", 1800000)),
	regexEnabled: !Default("DISABLE_REGULAR_EXPRESSIONS", false),
	capturesEnabled: !Default("DISABLE_CAPTURE_GROUPS", false),
	refinementsEnabled: !Default("DISABLE_REFINEMENTS", false),
	outFilePath: Default("OUT_PATH", "output.json"),
	outCoveragePath: Default("COVERAGE_PATH", "coverage.json"),
	outQueriesDir: Default("QUERY_DUMP", "queries"),
	stringSolver: Default("STRING_SOLVER", "seq")
};
