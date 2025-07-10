// Dashboard JavaScript for TrackMate Expense Tracker

class ExpenseTracker {
  constructor() {
    this.currentUser = null;
    this.categories = {
      expense: ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'],
      income: ['Salary', 'Freelance', 'Business', 'Investments', 'Gifts', 'Other']
    };
    this.init();
  }

  init() {
    // Check if user is logged in
    this.loadCurrentUser();
    if (!this.currentUser) {
      window.location.href = 'index.html';
      return;
    }

    // Initialize user financial data if not exists
    this.initializeUserFinancialData();
    
    // Load dashboard data
    this.loadDashboard();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Populate form categories
    this.populateCategories();
    
    // Set default date to today
    document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
  }

  loadCurrentUser() {
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        document.getElementById('user-name').textContent = this.currentUser.username;
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  }

  initializeUserFinancialData() {
    if (!this.currentUser.accounts) {
      this.currentUser.accounts = [
        {
          id: 1,
          name: 'Main Account',
          balance: 0,
          type: 'checking'
        }
      ];
    }

    if (!this.currentUser.transactions) {
      this.currentUser.transactions = [];
    }

    if (!this.currentUser.categories) {
      this.currentUser.categories = this.categories;
    }

    // Save updated user data
    this.saveCurrentUser();
  }

  saveCurrentUser() {
    try {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      
      // Also update in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(user => user.username === this.currentUser.username);
      if (userIndex !== -1) {
        users[userIndex] = this.currentUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  loadDashboard() {
    this.updateFinancialOverview();
    this.loadRecentTransactions();
  }

  updateFinancialOverview() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate total balance
    const totalBalance = this.currentUser.accounts.reduce((sum, account) => sum + account.balance, 0);
    
    // Calculate monthly income and expenses
    const monthlyTransactions = this.currentUser.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const monthlySavings = monthlyIncome - monthlyExpenses;

    // Update UI
    document.getElementById('total-balance').textContent = this.formatCurrency(totalBalance);
    document.getElementById('monthly-income').textContent = this.formatCurrency(monthlyIncome);
    document.getElementById('monthly-expenses').textContent = this.formatCurrency(monthlyExpenses);
    document.getElementById('monthly-savings').textContent = this.formatCurrency(monthlySavings);
  }

  loadRecentTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    const transactions = [...this.currentUser.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    if (transactions.length === 0) {
      transactionsList.innerHTML = `
        <div class="no-transactions">
          <i class="fas fa-receipt"></i>
          <p>No transactions yet. Add your first transaction!</p>
        </div>
      `;
      return;
    }

    transactionsList.innerHTML = transactions.map(transaction => `
      <div class="transaction-item">
        <div class="transaction-info">
          <div class="transaction-icon" style="background: ${this.getCategoryColor(transaction.category, transaction.type)}">
            <i class="${this.getCategoryIcon(transaction.category, transaction.type)}"></i>
          </div>
          <div class="transaction-details">
            <h4>${transaction.description}</h4>
            <p>${transaction.category} • ${this.formatDate(transaction.date)}</p>
          </div>
        </div>
        <div class="transaction-amount ${transaction.type}">
          ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(Math.abs(transaction.amount))}
        </div>
      </div>
    `).join('');
  }

  setupEventListeners() {
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });

    // Add transaction buttons
    document.getElementById('add-expense-btn').addEventListener('click', () => {
      this.openTransactionModal('expense');
    });

    document.getElementById('add-income-btn').addEventListener('click', () => {
      this.openTransactionModal('income');
    });

    // Modal controls
    document.getElementById('close-modal').addEventListener('click', () => {
      this.closeTransactionModal();
    });

    document.getElementById('transaction-modal').addEventListener('click', (e) => {
      if (e.target.id === 'transaction-modal') {
        this.closeTransactionModal();
      }
    });

    // Transaction form
    document.getElementById('transaction-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTransaction();
    });

    // Transaction type change
    document.getElementById('transaction-type').addEventListener('change', (e) => {
      this.populateCategories();
    });
  }

  openTransactionModal(type = 'expense') {
    const modal = document.getElementById('transaction-modal');
    const typeSelect = document.getElementById('transaction-type');
    const modalTitle = document.getElementById('modal-title');
    
    typeSelect.value = type;
    modalTitle.textContent = type === 'expense' ? 'Add Expense' : 'Add Income';
    
    this.populateCategories();
    modal.style.display = 'block';
    
    // Focus on amount field
    setTimeout(() => {
      document.getElementById('transaction-amount').focus();
    }, 100);
  }

  closeTransactionModal() {
    const modal = document.getElementById('transaction-modal');
    modal.style.display = 'none';
    document.getElementById('transaction-form').reset();
    document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
  }

  populateCategories() {
    const typeSelect = document.getElementById('transaction-type');
    const categorySelect = document.getElementById('transaction-category');
    const selectedType = typeSelect.value;
    
    const categories = this.currentUser.categories[selectedType] || this.categories[selectedType];
    
    categorySelect.innerHTML = categories.map(category => 
      `<option value="${category}">${category}</option>`
    ).join('');
  }

  addTransaction() {
    try {
      const form = document.getElementById('transaction-form');
      const formData = new FormData(form);
      
      const transaction = {
        id: Date.now(),
        type: document.getElementById('transaction-type').value,
        amount: parseFloat(document.getElementById('transaction-amount').value),
        description: document.getElementById('transaction-description').value.trim(),
        category: document.getElementById('transaction-category').value,
        date: document.getElementById('transaction-date').value,
        accountId: 1 // Default to main account
      };

      // Validate transaction
      if (!transaction.amount || transaction.amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      if (!transaction.description) {
        alert('Please enter a description');
        return;
      }

      // For expenses, make amount negative
      if (transaction.type === 'expense') {
        transaction.amount = -Math.abs(transaction.amount);
      } else {
        transaction.amount = Math.abs(transaction.amount);
      }

      // Add transaction to user data
      this.currentUser.transactions.push(transaction);

      // Update account balance
      const account = this.currentUser.accounts.find(acc => acc.id === transaction.accountId);
      if (account) {
        account.balance += transaction.amount;
      }

      // Save data
      this.saveCurrentUser();

      // Update UI
      this.updateFinancialOverview();
      this.loadRecentTransactions();

      // Close modal
      this.closeTransactionModal();

      // Show success message
      this.showNotification(`${transaction.type === 'expense' ? 'Expense' : 'Income'} added successfully!`, 'success');

    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error adding transaction. Please try again.');
    }
  }

  getCategoryColor(category, type) {
    const colors = {
      'Food & Dining': '#ff9800',
      'Transportation': '#2196f3',
      'Shopping': '#e91e63',
      'Entertainment': '#9c27b0',
      'Bills & Utilities': '#f44336',
      'Healthcare': '#4caf50',
      'Education': '#3f51b5',
      'Travel': '#00bcd4',
      'Salary': '#4caf50',
      'Freelance': '#2196f3',
      'Business': '#ff9800',
      'Investments': '#9c27b0',
      'Gifts': '#e91e63',
      'Other': '#607d8b'
    };
    
    return colors[category] || (type === 'income' ? '#4caf50' : '#f44336');
  }

  getCategoryIcon(category, type) {
    const icons = {
      'Food & Dining': 'fas fa-utensils',
      'Transportation': 'fas fa-car',
      'Shopping': 'fas fa-shopping-bag',
      'Entertainment': 'fas fa-film',
      'Bills & Utilities': 'fas fa-file-invoice-dollar',
      'Healthcare': 'fas fa-heartbeat',
      'Education': 'fas fa-graduation-cap',
      'Travel': 'fas fa-plane',
      'Salary': 'fas fa-briefcase',
      'Freelance': 'fas fa-laptop',
      'Business': 'fas fa-building',
      'Investments': 'fas fa-chart-line',
      'Gifts': 'fas fa-gift',
      'Other': 'fas fa-ellipsis-h'
    };
    
    return icons[category] || (type === 'income' ? 'fas fa-plus' : 'fas fa-minus');
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'success' ? '#4caf50' : '#2196f3',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: '1001',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize the expense tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new ExpenseTracker();
});