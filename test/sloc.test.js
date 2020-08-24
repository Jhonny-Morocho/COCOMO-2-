require('jest-localstorage-mock');
const { processDirectory, accountLinesCode, addToTotalResults, isNullOrWhiteSpace } = require('./sloc');
var { n_pfiles } = require('./sloc');

describe("Prueba isNullOrWhiteSpace => comprobar lineas vacias", () =>{
	test('Test espacios en blanco',  () => {
		expect(isNullOrWhiteSpace("   ")).toBe(true);
	});

	test('Test tabulaciones',  () => {
		expect(isNullOrWhiteSpace("\t\t\t\n")).toBe(true);
	});

	test('Test loc normal',  () => {
		expect(isNullOrWhiteSpace("function(){}")).toBe(false);
	});

	test('Test string null',  () => {
		expect(isNullOrWhiteSpace(null)).toBe(true);
	});

	test('Test es un numero',  () => {
		expect(isNullOrWhiteSpace(3)).toBe(false);
	});
});

describe("Prueba processDirectory => contar lineas de código", () =>{
	beforeEach(() => {
		// values stored in tests will also be available in other tests unless you run
		localStorage.clear();
		// you could also reset all mocks, but this could impact your other mocks
		jest.resetAllMocks();
		// or individually reset a mock used
		localStorage.setItem.mockClear();
	});

	test('Test 1 loc', () => {
		var loc = "function(){}";
		var file = new File([loc], "prueba.js", {
			type: "text/plain"
		});
		file.webkitRelativePath = "test/prueba.js";
		var listFiles = [file];
		n_pfiles = 1;
		processDirectory(listFiles, []);
		const readAsTextSpy = jest.spyOn(FileReader.prototype, 'readAsText');
		const reader = accountLinesCode(file);
		expect(reader).toBeInstanceOf(FileReader);
		if (reader.onload) {
			// expect(addToTotalResults).toBeCalled();
			// Object.defineProperty(reader, 'result', loc);
			const mOnloadEvent = { target: { result: loc } };
			reader.onload(mOnloadEvent);
			expect(localStorage.setItem).toBeCalledWith('ntloc', 1);
			expect(localStorage.setItem).toBeCalledWith('ntltotal', 1);
			expect(localStorage.setItem).toHaveBeenCalledTimes(4);
			// expect(localStorage.__STORE__['ntloc']).toBe(1);
			// expect(localStorage.__STORE__['ntltotal']).toBe(1);
			// expect(Object.keys(localStorage.__STORE__).length).toBe(1);
		}
		expect(readAsTextSpy).toBeCalledWith(file);
	});

	test('Test 1 loc - 1 bloc', () => {
		var loc = "function(){}\n";
		var bloc = "\t\t";
		var file = new File([loc, bloc], "prueba.js", {
			type: "text/plain"
		});
		file.webkitRelativePath = "test/prueba.js";
		var listFiles = [file];
		n_pfiles = 1;
		processDirectory(listFiles, []);
		const readAsTextSpy = jest.spyOn(FileReader.prototype, 'readAsText');
		const reader = accountLinesCode(file);
		expect(reader).toBeInstanceOf(FileReader);
		if (reader.onload) {
			// expect(addToTotalResults).toBeCalled();
			// Object.defineProperty(reader, 'result', loc);
			var line = loc + bloc;
			const mOnloadEvent = { target: { result: line } };
			reader.onload(mOnloadEvent);
			expect(localStorage.setItem).toBeCalledWith('ntloc', 1);
			expect(localStorage.setItem).toBeCalledWith('ntbloc', 1);
			expect(localStorage.setItem).toBeCalledWith('ntltotal', 2);
			expect(localStorage.setItem).toHaveBeenCalledTimes(4);
			// expect(localStorage.__STORE__['ntloc']).toBe(1);
			// expect(localStorage.__STORE__['ntltotal']).toBe(1);
			// expect(Object.keys(localStorage.__STORE__).length).toBe(1);
		}
		expect(readAsTextSpy).toBeCalledWith(file);
	});

	test('Test 1 loc - 1 bloc - 1 cloc', () => {
		var loc = "function(){}\n";
		var bloc = "\t\t\n";
		var cloc = "// Comentario";
		var file = new File([loc, bloc], "prueba.js", {
			type: "text/plain"
		});
		file.webkitRelativePath = "test/prueba.js";
		var listFiles = [file];
		n_pfiles = 1;
		processDirectory(listFiles, []);
		const readAsTextSpy = jest.spyOn(FileReader.prototype, 'readAsText');
		const reader = accountLinesCode(file);
		expect(reader).toBeInstanceOf(FileReader);
		if (reader.onload) {
			// expect(addToTotalResults).toBeCalled();
			// Object.defineProperty(reader, 'result', loc);
			var line = loc + bloc + cloc;
			const mOnloadEvent = { target: { result: line } };
			reader.onload(mOnloadEvent);
			expect(localStorage.setItem).toBeCalledWith('ntloc', 1);
			expect(localStorage.setItem).toBeCalledWith('ntbloc', 1);
			expect(localStorage.setItem).toBeCalledWith('ntcloc', 1);
			expect(localStorage.setItem).toBeCalledWith('ntltotal', 3);
			expect(localStorage.setItem).toHaveBeenCalledTimes(4);
			// expect(localStorage.__STORE__['ntloc']).toBe(1);
			// expect(localStorage.__STORE__['ntltotal']).toBe(1);
			// expect(Object.keys(localStorage.__STORE__).length).toBe(1);
		}
		expect(readAsTextSpy).toBeCalledWith(file);
	});

	test('Test file null -> return undefined', () => {
		const readAsTextSpy = jest.spyOn(FileReader.prototype, 'readAsText');
		const reader = accountLinesCode(null);
		expect(reader).toBe(undefined);
	});
});