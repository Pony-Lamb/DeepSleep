var sentimentData = {
    topPositive: [
      {
        ticker: "AAPL",
        name: "Apple Inc.",
        score: 0.91,
        news: [
          { title: "Apple shares surge after new product launch", url: "https://example.com/apple1" },
          { title: "Analysts praise Apple’s strong earnings", url: "https://example.com/apple2" }
        ]
      },
      {
        ticker: "TSLA",
        name: "Tesla Inc.",
        score: 0.88,
        news: [
          { title: "Tesla exceeds delivery expectations", url: "https://example.com/tsla1" }
        ]
      },
      {
        ticker: "BTC-USD",
        name: "Bitcoin USD",
        score: 0.85,
        news: [
          { title: "Bitcoin rebounds after market dip", url: "https://example.com/btc1" }
        ]
      }
    ],
    topNegative: [
      {
        ticker: "GOOG",
        name: "Alphabet Inc.",
        score: -0.85,
        news: [
          { title: "Google faces antitrust lawsuit", url: "https://example.com/goog1" }
        ]
      },
      {
        ticker: "MSFT",
        name: "Microsoft Corp.",
        score: -0.78,
        news: [
          { title: "Microsoft stock dips after earnings miss", url: "https://example.com/msft1" }
        ]
      },
      {
        ticker: "BIL",
        name: "1-3 Month T-Bill ETF",
        score: -0.65,
        news: [
          { title: "Investors flee from short-term bonds", url: "https://example.com/bil1" }
        ]
      }
    ]
  };


async function fetchSentimentData() {
    try {
      const response = await fetch('http://127.0.0.1:5000/v1/asset/sentiment/');
      const data = await response.json();

      sentimentData = data;

      console.log("sentimentData: ", sentimentData);

      return sentimentData;
    } catch (error) {
      console.error('Failed to fetch sentiment data:', error);
      return null;
    }
}

// function renderSentimentCards(dataArray, containerId) {
//     const container = document.getElementById(containerId);
//     container.innerHTML = ''; // Clear previous content
//     dataArray.forEach(asset => {
//         const card = document.createElement('div');
//         card.className = 'sentiment-card';
//         card.innerHTML = `
//         <h4>${asset.ticker} - ${asset.name}</h4>
//         <div class="sentiment-score">Sentiment Score: ${asset.score.toFixed(2)}</div>
//         <ul class="sentiment-news-list">
//             ${asset.news.map(n => `<li><a href="${n.url}" target="_blank" rel="noopener noreferrer">${n.title}</a></li>`).join('')}
//         </ul>
//         `;
//         container.appendChild(card);
//     });
// }

function renderSentimentCards(dataArray, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content
    
    if (!dataArray || dataArray.length === 0) {
        positive_message = 'Unluckily, no positive asset is found yesterday……';
        negative_message = 'Luckily, all assets are positive yesterday!';
        container.innerHTML = `<div class="no-sentiment">${containerId === 'positive-container' ? positive_message : negative_message }</div>`;
        return;
    }
    
    dataArray.forEach(asset => {
        const card = document.createElement('div');
        card.className = 'sentiment-card';
        card.innerHTML = `
        <h4>${asset.ticker} - ${asset.name}</h4>
        <div class="sentiment-score">Sentiment Score: ${asset.score.toFixed(2)}</div>
        <ul class="sentiment-news-list">
            ${asset.news && asset.news.length > 0 ? 
              asset.news.map(n => `<li><a href="${n.url}" target="_blank" rel="noopener noreferrer">${n.title}</a></li>`).join('') :
              '<li>No news available</li>'
            }
        </ul>
        `;
        container.appendChild(card);
    });
}
