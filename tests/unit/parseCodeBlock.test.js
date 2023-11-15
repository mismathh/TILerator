const parseCodeBlock = require('../../src/parseCodeBlock');

describe('parseCodeBlock tests', () => {
    test('should return a string', () => {
        expect(typeof parseCodeBlock('test line')).toBe('string');
    });

    test('should return a string with <pre> and <code> tags if part of string is encompassed between ```', () => {
        const testSentence = '\nThis is an fenced code block\nThis is a second line in the fenced block\n'
        const testSentenceWithTicks = `\`\`\`${testSentence}\`\`\``;
        expect(parseCodeBlock(testSentenceWithTicks)).toBe(`<pre>\n\t\t\t\t<code>${testSentence}\n\t\t\t\t</code>\n\t\t\t</pre>`);
    });

    test('should return a string with <code> tags if part of string is encompassed between ``', () => {
        expect(parseCodeBlock('`sentence 1`')).toBe('<code>sentence 1</code>');
    });

    test('should return a string without <code> tags if part of string is encompassed between ``` and `` or vice versa', () => {
        expect(parseCodeBlock('```sentence 1``')).not.toBe('<code>sentence 1</code>');
        expect(parseCodeBlock('`sentence 1```')).not.toBe('<code>sentence 1</code>');
    });

    test('should throw error if anything except a string is received', () => {
        [null, 4, undefined].forEach(input => {
            expect(() => parseCodeBlock(input)).toThrow(new Error('Invalid input: text must be a string'));
        });
    });
});