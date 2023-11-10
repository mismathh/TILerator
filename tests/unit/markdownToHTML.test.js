const markdownToHTML = require('../../src/markdownToHTML');

describe('markdownToHTML tests', () => {
    test('should return a string', () => {
        expect(typeof markdownToHTML('test line')).toBe('string');
    });

    test('should return a string with <b> tags if part of string is encompassed between **', () => {
        expect(markdownToHTML('**sentence 1**  sentence 2  **sentence 3**')).toBe('<b>sentence 1</b>  sentence 2  <b>sentence 3</b>');
    });

    test('should return a string with <b> tags if part of string is encompassed between __', () => {
        expect(markdownToHTML('__sentence 1__')).toBe('<b>sentence 1</b>');
    });

    test('should return a string without <b> tags if part of string is encompassed between ** and __ or vice versa', () => {
        expect(markdownToHTML('**sentence 1__')).not.toBe('<b>sentence 1</b>');
        expect(markdownToHTML('__sentence 1**')).not.toBe('<b>sentence 1</b>');
    });

    test('should throw error if anything except a string is received', () => {
        [null, 4, undefined].forEach(input => {
            expect(() => markdownToHTML(input)).toThrow(new Error('Invalid input: text must be a string'));
        });
    });
});