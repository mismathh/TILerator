const parseCodeBlock = (lines) => {
    let html = lines;

    const codeBlockPattern = /```([^*]+)```/g;
    html = html.replace(codeBlockPattern, (match, codeText) => {
      codeBlock = `<pre>\n\t\t\t\t<code>${codeText}\n\t\t\t\t</code>\n\t\t\t</pre>`
      return codeBlock;
    });

    const inlineCodePattern1 = /\`([^*]+)\`/g;
    html = html.replace(inlineCodePattern1, (match, codeText) => {
      return `<code>${codeText}</code>`;
    });


    return html;
};

module.exports = parseCodeBlock;