const API_KEY = '6425cff815af412c86044b48936a85c0';

function getNews() {
  const topic = document.getElementById('topic').value;
  const url = https://newsapi.org/v2/everything?q=${topic}&apiKey=${API_KEY};

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const articles = data.articles;
      let output = '';
      articles.slice(0, 5).forEach(article => {
        const summary = summarizeText(article.description || article.content || 'No description');
        output += `
          <div class="article">
            <h2>${article.title}</h2>
            <p><strong>Summary:</strong> ${summary}</p>
            <a href="${article.url}" target="_blank">Read more</a>
          </div>
        `;
      });
      document.getElementById('news-container').innerHTML = output;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function summarizeText(text) {
  if (!text) return 'No summary available.';
  return text.split('. ').slice(0, 2).join('. ') + '.';
}





