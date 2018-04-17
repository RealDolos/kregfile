"use strict";

function all(val, e) {
  if (e.name.toUpperCase().includes(val)) {
    return true;
  }
  for (const v of e.tagValuesCase) {
    if (v.includes(val)) {
      return true;
    }
  }
  return false;
}

function exists(tag, e) {
  return e.tagsMap.has(tag);
}

function matches(tag, val, e) {
  const v = e.tagsMapCase.get(tag);
  return v && v.includes(val);
}

function *tokens(value) {
  let cur = "";
  let quoting = false;
  let back = false;
  for (const e of value) {
    if (e === "\\") {
      back = true;
      continue;
    }
    if (quoting && e === quoting) {
      if (back) {
        cur += e;
        back = false;
        continue;
      }
      if (cur) {
        yield cur;
        cur = "";
      }
      quoting = false;
      continue;
    }
    if (quoting) {
      if (back) {
        cur += "\\";
        back = false;
        continue;
      }
      cur += e;
      continue;
    }
    if (/\s/.test(e)) {
      if (back) {
        cur += e;
        back = false;
        continue;
      }
      if (cur) {
        yield cur;
        cur = "";
      }
      continue;
    }
    if (/['"]/.test(e)) {
      if (back) {
        cur += e;
        back = false;
        continue;
      }
      quoting = e;
      continue;
    }
    if (back) {
      cur += "\\";
    }
    cur += e;
  }
  if (back) {
    cur += "\\";
  }
  if (cur) {
    yield cur;
    cur = "";
  }
}

function toFunc(e) {
  const idx = e.indexOf(":");
  if (idx <= 0 || e[idx - 1] === "\\") {
    return all.bind(null, e.toUpperCase());
  }
  if (idx === e.length - 1) {
    return exists.bind(null, e.slice(0, -1).toLowerCase());
  }
  const tag = e.slice(0, idx).toLowerCase();
  const val = e.slice(idx + 1).toUpperCase();
  return matches.bind(null, tag, val.toUpperCase());
}

export default function toFilterFuncs(value) {
  return Array.from(tokens(value)).map(toFunc);
}