var transactions = [
      { type: 'Buy', stock: 'AAPL', amount: -1000, date: '2025-07-10' },
      { type: 'Sell', stock: 'TSLA', amount: 1200, date: '2025-06-29' },
      { type: 'Buy', stock: 'GOOGL', amount: -950, date: '2025-06-18' },
      { type: 'Sell', stock: 'AAPL', amount: 1050, date: '2025-05-30' },
      { type: 'Buy', stock: 'AMZN', amount: -1100, date: '2025-05-18' },
    ];


function renderTransactions(filtered) {
    const tbody = document.getElementById('transactionBody');
    tbody.innerHTML = '';

    filtered.forEach((t) => {
    const row = document.createElement('tr');
    row.className = 'border-b hover:bg-gray-50';

    row.innerHTML = `
        <td class="py-2 w-1/4">${t.type}</td>
        <td class="py-2 w-1/4">${t.stock}</td>
        <td class="py-2 font-semibold ${t.amount < 0 ? 'text-red-600' : 'text-green-600'} w-1/4">
        ${t.amount < 0 ? '-' : '+'}${Math.abs(t.amount)} EUR
        </td>
        <td class="py-2 w-1/4">${t.date}</td>
    `;
    tbody.appendChild(row);
    });
}

function filterTransactions() {
    const from = document.getElementById('fromDate').value;
    const to = document.getElementById('toDate').value;

    const filtered = transactions.filter(t => {
    const tDate = new Date(t.date);
    const fromDate = from ? new Date(from) : new Date('2000-01-01');
    const toDate = to ? new Date(to) : new Date('2100-01-01');
    return tDate >= fromDate && tDate <= toDate;
    });

    renderTransactions(filtered);
}

// Add this function to your transaction.js file
async function afterUpdateTransactions() {
    try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/transactions');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Assuming the API returns an array of transaction objects
        const newTransactions = await response.json();
        
        // Update the global transactions array
        transactions = newTransactions;
        
        // Get current filter values
        const from = document.getElementById('fromDate').value;
        const to = document.getElementById('toDate').value;
        
        // Apply filters if they exist, otherwise show all
        let filtered = transactions;
        if (from || to) {
            filtered = transactions.filter(t => {
                const tDate = new Date(t.date);
                const fromDate = from ? new Date(from) : new Date('2000-01-01');
                const toDate = to ? new Date(to) : new Date('2100-01-01');
                return tDate >= fromDate && tDate <= toDate;
            });
        }
        
        // Update the HTML display
        renderTransactions(filtered);
        
        console.log('Transactions updated successfully');
    } catch (error) {
        console.error('Failed to update transactions:', error);
        // Optionally show an error message to the user
        alert('Failed to update transaction data. Please try again.');
    }
}

window.onload = () => {
    renderTransactions(transactions);
};

