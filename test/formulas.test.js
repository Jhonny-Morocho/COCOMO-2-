// ==============FACTOR EXPONENCIAL===========
const esfuerzo = require('./esfuerzo');

describe('pruebas para Esfuerzo',()=>{

    test('Flujo normal, respuesta 35.82', () => {
        expect(esfuerzo(8031)).toBe(35.82);
      });

      test('Datos vacios', () => {
        expect(esfuerzo('')).toBe(0);
      });

      test('Datos nullos', () => {
        expect(esfuerzo(null)).toBe(0);
      });
});


const factorExponencial = require('./factorExponencial');
describe('Factor exponencial',()=>{

    test('Flujo Normal', () => {
        expect(factorExponencial(18.97)).toBe(1.20);
      });
       test('Datos Vacios', () => {
         expect(factorExponencial('')).toBe(0);
      });
       test('Suma de los factores exponencial 18.97', () => {
         expect(factorExponencial(null)).toBe(0);
       });
});

const tiempoDesarollo = require('./tiempoDesarollo');
describe('Tiempo de desarrollo',()=>{

    test('Flujo Normal', () => {
        expect(tiempoDesarollo(22,1.20)).toBe(9.36);
      });
       test('Datos Vacios', () => {
         expect(tiempoDesarollo('','')).toBe(0);
       });
       test('Valores Nulos', () => {
         expect(tiempoDesarollo(null,null)).toBe(0);
       });
});