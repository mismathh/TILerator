const parseCodeBlock = (lines) => {
  if (typeof lines !== "string") {
    throw new Error("Invalid input: text must be a string");
  }

  let html = lines;

  const codeBlockPattern = /```([^*]+)``break`/g;
  html = html.replace(codeBlockPattern, (match, codeText) => {
    codeBlock = `<pre>\n\t\t\t\t<code>${codeText}\n\t\t\t\t</code>\n\t\t\t</pre>`;
    return codeBlock;
  });

  const inlineCodePattern1 = /\`([^*]+)\`/g;
  html = html.replace(inlineCodePattern1, (match, codeText) => {
    return `<code>${codeText}</code>`;
  });

  return html;
};

module.exports = parseCodeBlock;
