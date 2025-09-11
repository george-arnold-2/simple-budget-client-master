import React, { useContext } from 'react';
import './SpendingTracker.css';
import BudgetContext from '../BudgetContext';

const SpendingTracker: React.FC = () => {
  const { categories, transactions, totalCost } = useContext(BudgetContext);

  // Calculate totals for each category
  const categoriesWithTotals = categories.map((category) => {
    const total = transactions
      .filter(
        (transaction) =>
          transaction.categoryId === category.id ||
          transaction.category_id === category.id ||
          Number(transaction.categoryId) === category.id ||
          Number(transaction.category_id) === category.id,
      )
      .map((transaction) => Number(transaction.amount))
      .reduce((a, b) => a + b, 0);

    return {
      ...category,
      total,
    };
  });

  // Calculate additional analytics
  const totalTransactions = transactions.length;
  const averageTransaction = totalTransactions > 0 ? totalCost / totalTransactions : 0;
  const topCategory = categoriesWithTotals.reduce((max, category) => (category.total > max.total ? category : max), {
    total: 0,
    name: 'None',
  });

  // Calculate spending by month (simplified - using current month)
  // Note: In a real app, you'd have proper date handling for monthly calculations

  // Calculate spending trends (simplified)
  const recentTransactions = transactions.slice(-10);
  const recentTotal = recentTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const olderTransactions = transactions.slice(0, -10);
  const olderTotal = olderTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const trend = olderTotal > 0 ? ((recentTotal - olderTotal) / olderTotal) * 100 : 0;

  return (
    <div className="SpendingTracker-Page-Container">
      <main className="SpendingTracker">
        <div className="SpendingTracker-Header">
          <img
            className="SpendingTracker-Icon"
            alt="analytics"
            src="https://cdn2.iconfinder.com/data/icons/business-management-158/32/03.Profit_increases-512.png"
          />
          <div className="SpendingTracker-Header-Text">
            <h2>Spending Analytics</h2>
            <p className="SpendingTracker-Subtitle">Track your spending patterns and financial health</p>
          </div>
        </div>

        <div className="Analytics-Grid">
          <div className="Main-Stats">
            <div className="Stat-Card Primary-Stat">
              <div className="Stat-Content">
                <h3 className="Stat-Title">Total Spent</h3>
                <p className="Stat-Value">${totalCost.toFixed(2)}</p>
                <p className="Stat-Subtitle">All time</p>
              </div>
              <div className="Stat-Icon">💰</div>
            </div>

            <div className="Stat-Card">
              <div className="Stat-Content">
                <h3 className="Stat-Title">Transactions</h3>
                <p className="Stat-Value">{totalTransactions}</p>
                <p className="Stat-Subtitle">Total recorded</p>
              </div>
              <div className="Stat-Icon">📊</div>
            </div>

            <div className="Stat-Card">
              <div className="Stat-Content">
                <h3 className="Stat-Title">Average</h3>
                <p className="Stat-Value">${averageTransaction.toFixed(2)}</p>
                <p className="Stat-Subtitle">Per transaction</p>
              </div>
              <div className="Stat-Icon">📈</div>
            </div>

            <div className="Stat-Card">
              <div className="Stat-Content">
                <h3 className="Stat-Title">Top Category</h3>
                <p className="Stat-Value">{topCategory.name}</p>
                <p className="Stat-Subtitle">${topCategory.total.toFixed(2)}</p>
              </div>
              <div className="Stat-Icon">🏆</div>
            </div>
          </div>

          <div className="Spending-Categories-Section">
            <div className="Categories-Header">
              <h2 className="Categories-Main-Title">Spending by Category</h2>
              <p className="Categories-Subtitle">Visual breakdown of your spending patterns</p>
            </div>

            <div className="Categories-Content">
              <div className="Category-Breakdown Enhanced-Breakdown">
                <div className="Breakdown-Header">
                  <h3 className="Breakdown-Title">Detailed Breakdown</h3>
                  <div className="Total-Spent-Display">
                    <span className="Total-Spent-Label">Total Spent:</span>
                    <span className="Total-Spent-Amount">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="Category-List">
                  {categoriesWithTotals
                    .filter((category) => category.total > 0)
                    .sort((a, b) => b.total - a.total)
                    .map((category, index) => {
                      const percentage = totalCost > 0 ? (category.total / totalCost) * 100 : 0;
                      const gradientColors = [
                        'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                        'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                        'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                        'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
                        'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                        'linear-gradient(135deg, #38b2ac 0%, #319795 100%)',
                        'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
                        'linear-gradient(135deg, #68d391 0%, #48bb78 100%)',
                      ];
                      const gradientColor = gradientColors[index % gradientColors.length];

                      return (
                        <div key={category.id} className="Category-Breakdown-Item Enhanced-Item">
                          <div className="Category-Info">
                            <div className="Category-Header-Info">
                              <div className="Category-Color-Indicator" style={{ background: gradientColor }}></div>
                              <span className="Category-Name">{category.name}</span>
                            </div>
                            <div className="Category-Stats">
                              <span className="Category-Amount">${category.total.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Percentage Pill */}
                          <div
                            className="Category-Percentage-Pill"
                            style={{
                              background: gradientColor,
                              animationDelay: `${index * 0.2 + 0.1}s`,
                              marginLeft: `calc(${percentage}% - 36px)`,
                            }}
                          >
                            {percentage.toFixed(1)}%
                          </div>

                          <div className="Category-Bar Enhanced-Bar">
                            <div
                              className="Category-Bar-Fill Enhanced-Bar-Fill"
                              style={
                                {
                                  '--target-width': `${percentage}%`,
                                  background: gradientColor,
                                  animationDelay: `${index * 0.2}s`,
                                } as React.CSSProperties
                              }
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          <div className="Trend-Analysis">
            <h3 className="Trend-Title">Spending Trend</h3>
            <div className="Trend-Content">
              <div className="Trend-Indicator">
                <span className={`Trend-Arrow ${trend >= 0 ? 'positive' : 'negative'}`}>
                  {trend >= 0 ? '↗️' : '↘️'}
                </span>
                <span className={`Trend-Value ${trend >= 0 ? 'positive' : 'negative'}`}>
                  {Math.abs(trend).toFixed(1)}%
                </span>
              </div>
              <p className="Trend-Description">
                {trend >= 0 ? 'Spending increased' : 'Spending decreased'} in recent transactions
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpendingTracker;
