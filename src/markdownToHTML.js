// Parse Markdown tags and convert into html tag
const markdownToHTML = (text) => {
    let html = text;

    // Convert bold markdown to html <b> tags
    const boldPattern1 = /\*\*([^*]+)\*\*/g;
    html = html.replace(boldPattern1, (match, boldText) => {
      return `<b>${boldText}</b>`;
    });
  
    const boldPattern2 = /\_\_([^*]+)\_\_/g;
    html = html.replace(boldPattern2, (match, boldText) => {
      return `<b>${boldText}</b>`;
    });

    return html;
}

module.exports = markdownToHTML;