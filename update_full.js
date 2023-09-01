const btcPriceElement = document.getElementById('btcPrice');
const tradeListElement = document.getElementById('tradeList');
const orderBookElement = document.getElementById('orderBook');

function fetchPrice() {
    fetch('https://api.huobi.pro/market/trade?symbol=btcusdt')
        .then(response => response.json())
        .then(data => {
            const price = data.tick.data[0].price;
            btcPriceElement.textContent = `$${price.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Error fetching the price:', error);
            btcPriceElement.textContent = 'Failed to fetch price';
        });
}

function fetchTrades() {
    const tradeListElement = document.getElementById('tradeList');

    fetch('https://api.huobi.pro/market/history/trade?symbol=btcusdt')
        .then(response => response.json())
        .then(data => {
            tradeListElement.innerHTML = ''; // Clear previous data

            const trades = data.data && data.data.length > 0 ? data.data[0].data : null;

            if (!trades || trades.length === 0) {
                console.error('No trade data found.');
                tradeListElement.innerHTML = 'No trade data available';
                return;
            }

            // Limit the number of trades to 3
            for(let i = 0; i < Math.min(3, trades.length); i++) {
                const trade = trades[i];
                const tradeItem = document.createElement('li');
                const formattedPrice = parseFloat(trade.price).toFixed(2);
                const formattedAmount = parseFloat(trade.amount).toFixed(6);
                tradeItem.textContent = `Price: $${formattedPrice}, Amount: ${formattedAmount}`;
                tradeListElement.appendChild(tradeItem);
            }
        })
        .catch(error => {
            console.error('Error fetching trades:', error);
            tradeListElement.innerHTML = 'Failed to fetch trades';
        });
}



const askListElement = document.getElementById('askList');
const bidListElement = document.getElementById('bidList');

function fetchOrderBook() {
    fetch('https://api.huobi.pro/market/depth?symbol=btcusdt&type=step0')
        .then(response => response.json())
        .then(data => {
            askListElement.innerHTML = ''; // Очистить предыдущие данные
            bidListElement.innerHTML = ''; // Очистить предыдущие данные

            const bids = data.tick.bids;
            const asks = data.tick.asks;

            // Отобразить ордера на продажу (asks)
            asks.forEach(ask => {
                const orderItem = document.createElement('li');
                orderItem.textContent = `$${ask[0]} - Amount: ${ask[1]}`;
                askListElement.appendChild(orderItem);
            });

            // Отобразить ордера на покупку (bids)
            bids.forEach(bid => {
                const orderItem = document.createElement('li');
                orderItem.textContent = `$${bid[0]} - Amount: ${bid[1]}`;
                bidListElement.appendChild(orderItem);
            });
        })
        .catch(error => {
            console.error('Error fetching order book:', error);
            askListElement.innerHTML = 'Failed to fetch order book';
            bidListElement.innerHTML = 'Failed to fetch order book';
        });
}

// Вызов функций для получения данных
fetchPrice();
fetchTrades();
fetchOrderBook();

// Установка интервалов для обновления данных
setInterval(fetchPrice, 1000);
setInterval(fetchTrades, 1500);
setInterval(fetchOrderBook, 2000);