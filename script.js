document.addEventListener('DOMContentLoaded', function() {
    const monthSelect = document.getElementById('monthSelect');
    const searchBox = document.getElementById('searchBox');
    const transactionTable = document.getElementById('transactionTable');
    let currentPage = 1;
  
    function fetchTransactions(page = 1, search = '') {
      const month = monthSelect.value;
      fetch(`/api/transactions?page=${page}&search=${search}&month=${month}`)
        .then(response => response.json())
        .then(data => {
          // Populate transactionTable with data
        });
    }
  
    monthSelect.addEventListener('change', () => fetchTransactions());
    searchBox.addEventListener('input', () => fetchTransactions(currentPage, searchBox.value));
  
    document.getElementById('prevPage').addEventListener('click', () => {
      currentPage--;
      fetchTransactions(currentPage);
    });
    document.getElementById('nextPage').addEventListener('click', () => {
      currentPage++;
      fetchTransactions(currentPage);
    });
  
    fetchTransactions(); // Initial load
  });
  