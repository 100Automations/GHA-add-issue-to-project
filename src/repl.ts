// Imports

// Globals
const DELIMITERS = Array.from(" \n\t\r");
const STRINGCHAR = Array.from("'\"`");
const SYMBOLCHAR = Array.from("()[]{},/!");

interface Interpreter {
  src: string;
}

interface Analyzer {
  tokens: string[];
  arr: string[];
  builtins: {
    [index: string]: Function;
  };
  parens: {
    [index: string]: string;
  };
}

function analyze(s: string, arr: string[]) {
  const interpreter = new Interpreter(s);
  const analyzer = new Analyzer(interpreter.tokenize(), arr);
  return analyzer.analyze();
}

class Interpreter {
  constructor(src: string) {
    this.src = src;
  }

  tokenize() {
    return this._tokenize(this.src.split(""));
  }

  _tokenize(src: string[], store = []) {
    if (src.length <= 0) {
      return store;
    } else {
      const next = this._findNextToken(src);
      store.push(next);
      return this._tokenize(src, store);
    }
  }

  _findNextToken(src: string[], store = []) {
    if (src.length <= 0) {
      return store.join("");
    }

    const first = src[0];
    if (DELIMITERS.includes(first)) {
      src.shift();
      return store.join("") || this._findNextToken(src, store);
    } else if (STRINGCHAR.includes(first)) {
      const stopChar = src.shift();
      var nextChar = src.shift();
      while (nextChar != stopChar) {
        store.push(nextChar);
        nextChar = src.shift();
      }
      return store.join("");
    } else if (SYMBOLCHAR.includes(first)) {
      return store.join("") || src.shift();
    } else if (!SYMBOLCHAR.includes(first)) {
      store.push(src.shift());
    }
    return this._findNextToken(src, store);
  }
}

class Analyzer {
  constructor(tokens: string[], arr: string[]) {
    this.tokens = tokens;
    this.arr = arr;
    this.builtins = {
      and: (context) => this._and.bind(context),
      or: (context) => this._or.bind(context),
      not: (context) => this._not.bind(context),
      ",": (context) => this._and.bind(context),
      "/": (context) => this._or.bind(context),
      "!": (context) => this._not.bind(context),
    };
    this.parens = {
      "(": ")",
      "[": "]",
      "{": "}",
    };
  }

  analyze() {
    const src = [...this.tokens];
    return this._analyze(src);
  }

  _analyze(src: string[], last = null) {
    //console.log('analysis', src, last)
    if (src.length <= 0) {
      if (last === true || last === false) {
        return last;
      } else {
        throw new SyntaxUsageError();
      }
    }
    const first = src.shift();
    const builtin = this.builtins[first];
    const parens = this.parens[first];
    if (builtin) {
      const result = builtin(this)(src, last);
      return result;
    } else if (parens) {
      const subSrc = this._findCloseParen(this.parens[first], src);
      const result = subSrc.length ? this._analyze(subSrc) : false;
      return this._analyze(src, result);
    } else {
      const result = this._sentence(first);
      return this._analyze(src, result);
    }
  }

  _sentence(val: string) {
    return this.arr.includes(val);
  }

  _and(src: string[], last: boolean) {
    //console.log('and', src, last)

    if (last === true) {
      return this._analyze(src);
    } else if (last === false) {
      const first = src.shift();
      const builtin = this.builtins[first];
      const parens = this.parens[first];
      if (builtin) {
        builtin(this)(src, last);
      } else if (parens) {
        this._findCloseParen(parens, src);
      }
      return this._analyze(src, last);
    } else {
      throw new SyntaxUsageError();
    }
  }

  _or(src: string[], last: boolean) {
    //console.log('or', src, last)
    if (last !== true && last !== false) {
      throw new SyntaxUsageError();
    }

    if (last === true) {
      const first = src.shift();
      const builtin = this.builtins[first];
      const parens = this.parens[first];
      if (builtin) {
        builtin(this)(src, last);
      } else if (parens) {
        this._findCloseParen(parens, src);
      }
      return this._analyze(src, last);
    } else if (last === false) {
      return this._analyze(src);
    } else {
      throw new SyntaxUsageError();
    }
  }

  _not(src) {
    //console.log('not', src)
    return !this._analyze(src);
  }

  _findCloseParen(closeParen, src, store = []) {
    const first = src.shift();
    if (first == closeParen) {
      return store;
    } else {
      store.push(first);
      return this._findCloseParen(closeParen, src, store);
    }
  }
}

class SyntaxUsageError extends Error {
  constructor(foo = "bar", ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SyntaxUsageError);
    }

    this.name = "SyntaxUsageError";
  }
}

module.exports = { analyze, Analyzer, Interpreter };
