// API Configuration 
const NEWS_API_KEY = 'apikey';
const OPENAI_API_KEY = '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';

// DOM Elements
const articleInput = document.getElementById('articleInput');
const summarizeBtn = document.getElementById('summarizeBtn');
const summaryResult = document.getElementById('summaryResult');
const loadingIndicator = document.getElementById('loadingIndicator');
const newsContainer = document.getElementById('newsContainer');

// Event Listeners
summarizeBtn.addEventListener('click', summarizeText);

// Register Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => console.log('ServiceWorker registration successful'))
            .catch(err => console.log('ServiceWorker registration failed:', err));
    });
}

// Initialize the app
async function init() {
    await fetchIndianNews();
}

// Article Summarization using OpenAI
async function summarizeText() {
    const text = articleInput.value.trim();
    
    if (!text) {
        alert('Please enter an article to summarize');
        return;
    }

    toggleLoading(true);

    try {
        const summary = await generateSummary(text);
        displaySummary(summary);
    } catch (error) {
        console.error('Error:', error);
        summaryResult.innerHTML = <p class="error">Error generating summary. Please try again.</p>;
    } finally {
        toggleLoading(false);
    }
}

async function generateSummary(text) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': Bearer ${OPENAI_API_KEY},
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that summarizes news articles concisely while maintaining key information.'
                },
                {
                    role: 'user',
                    content: Please summarize this article in a concise way: ${text}
                }
            ],
            max_tokens: 150
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate summary');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Fetch Indian News using News API
async function fetchIndianNews() {
    try {
        const response = await fetch(https://newsapi.org/v2/top-headlines?country=in&apiKey=${NEWS_API_KEY});
        const data = await response.json();
        
        if (data.status === 'ok') {
            displayNews(data.articles);
        } else {
            throw new Error('Failed to fetch news');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = '<p class="error">Failed to load latest news. Please try again later.</p>';
    }
}

// Display fetched news articles
function displayNews(articles) {
    newsContainer.innerHTML = articles.slice(0, 6).map(article => `
        <div class="news-card">
            ${article.urlToImage ? <img src="${article.urlToImage}" alt="${article.title}"> : ''}
            <h3>${article.title}</h3>
            <p>${article.description || ''}</p>
            <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read more</a>
        </div>
    `).join('');
}

function displaySummary(summary) {
    summaryResult.innerHTML = <p>${summary}</p>;
}

function toggleLoading(show) {
    loadingIndicator.classList.toggle('hidden', !show);
    summarizeBtn.disabled = show;
    summarizeBtn.textContent = show ? 'Summarizing...' : 'Summarize';
}

// Add styles for news cards
const style = document.createElement('style');
style.textContent = `
    .news-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .news-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .news-card h3 {
        padding: 1rem;
        margin: 0;
        color: var(--text-dark);
    }

    .news-card p {
        padding: 0 1rem;
        color: var(--text-light);
    }

    .news-card a {
        display: inline-block;
        padding: 0.5rem 1rem;
        margin: 1rem;
        color: var(--primary-blue);
        text-decoration: none;
        font-weight: bold;
    }

    .news-card a:hover {
        color: var(--secondary-blue);
    }

    .error {
        color: #e74c3c;
        text-align: center;
        padding: 1rem;
    }
`;
document.head.appendChild(style);

// Initialize the app
init();