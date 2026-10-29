const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const archivo = path.join(__dirname, "server.js");
const codigo = fs.readFileSync(archivo, "utf8");

test("El backend tiene el archivo principal", () => {
  assert.ok(fs.existsSync(archivo));
});

test("El backend utiliza Express", () => {
  assert.match(codigo, /express/);
});

test("El backend tiene una ruta para consultar incidentes", () => {
  assert.match(codigo, /\/incidentes/);
});

test("El backend permite registrar incidentes", () => {
  assert.match(codigo, /\.post\s*\(/);
});

test("El backend permite actualizar incidentes", () => {
  assert.match(codigo, /\.patch\s*\(/);
});

test("El backend permite eliminar incidentes", () => {
  assert.match(codigo, /\.delete\s*\(/);
});