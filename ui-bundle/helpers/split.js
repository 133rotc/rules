'use strict'

// {{#each (split someString ",")}} — splits a string into an array
module.exports = (str, sep) => (str || '').split(sep).map((s) => s.trim()).filter(Boolean)
