/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

class Coverage {

    constructor() {
        this._current = {};
    }

	_getFile(file) {
		if (!this._current[file]) {
			this._current[file] = {
				smap: [],
				branches: [],
				lines: {
                  all: new Set(),
                  touched: new Set()
                }
			};
		}
		return this._current[file];
	}

	_addSMap(f, smap) {
		f.smap = smap;
	}

	_mergeBranches(f, branches) {
		for (let i in branches) {
			f.branches[i] = 1;
		}
	}

    _mergeLineNumbers(set, lineNumbers) {
        lineNumbers.forEach(lineNumber => {
            set.add(lineNumber);
        });
    }

    /**
     * Merges new coverage data from a path with existing data
       */
    add(coverage) {
        for (let i in coverage) {
            let file = this._getFile(i);
            this._addSMap(file, coverage[i].smap);
            this._mergeBranches(file, coverage[i].branches);
            this._mergeLineNumbers(file.lines.all, coverage[i].lines.all);
            this._mergeLineNumbers(file.lines.touched, coverage[i].lines.touched);
        }
    }

	_termResults(file) {
		let found = 0;
		let total = 0;

		for (let i in file.smap) {
			total++;
			found = file.branches[i] ? found + 1 : found;
		}

		return {
			found: found,
			total: total,
			coverage: found / total
		}
	}

    _locResults(file) {
        let touchedLines = Array.from(file.lines.touched).sort((a, b) => a - b);
        let allLines = Array.from(file.lines.all).sort((a, b) => a - b);
        return {
            touched: touchedLines,
            all: allLines,
            found: touchedLines.length,
            total: allLines.length,
            coverage: touchedLines.length / allLines.length
        }
    }

    final() {
        let results = [];

        for (let fileName in this._current) {
            let file = this._getFile(fileName);
            results.push({
                file: fileName,
                terms: this._termResults(file),
                loc: this._locResults(file)
            });
        }

        return results;
    }

    lines() {
        return this.final().reduce((prev, next) => {
            prev[next.file] = {
                all: next.loc.all,
                touched: next.loc.touched 
            };
            return prev; 
        }, {});
    }
}

export default Coverage;
