import React from 'react';

interface CategoryWithTotal {
  id: number;
  name: string;
  total: number;
}

interface SpendingGraphProps {
  categories: CategoryWithTotal[];
}

const SpendingGraph: React.FC<SpendingGraphProps> = ({ categories }) => {
  // Modern gradient colors that match the financial theme
  const colors = [
    '#10B981', // Emerald-500
    '#059669', // Emerald-600
    '#047857', // Emerald-700
    '#065F46', // Emerald-800
    '#064E3B', // Emerald-900
    '#0D9488', // Teal-600
    '#0F766E', // Teal-700
    '#134E4A', // Teal-800
  ];

  // Filter out categories with no spending
  const filteredCategories = categories.filter((category) => category.total > 0);

  if (filteredCategories.length === 0) {
    return (
      <div className="No-Data-Message">
        <div className="No-Data-Icon">📊</div>
        <h3>No Spending Data</h3>
        <p>Add some transactions to see your spending breakdown</p>
      </div>
    );
  }

  // Calculate total spending
  const totalSpending = filteredCategories.reduce((sum, category) => sum + category.total, 0);

  // Calculate percentages and sort by amount
  const categoriesWithData = filteredCategories
    .map((category, index) => ({
      ...category,
      percentage: Math.round((category.total / totalSpending) * 100),
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="Spending-Breakdown-Container">
      {/* Header */}
      <div className="Breakdown-Header">
        <h3 className="Breakdown-Title">Spending by Category</h3>
        <div className="Total-Spent-Display">
          <span className="Total-Spent-Label">Total Spent:</span>
          <span className="Total-Spent-Amount">${totalSpending.toFixed(2)}</span>
        </div>
      </div>

      {/* Single Chart Visualization */}
      <div className="Spending-Chart">
        {categoriesWithData.map((category, index) => (
          <div
            key={category.id}
            className="Category-Row"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div className="Category-Info">
              <div className="Category-Color-Dot" style={{ backgroundColor: category.color }} />
              <span className="Category-Name">{category.name}</span>
              <span className="Category-Amount">${category.total.toFixed(2)}</span>
              <span className="Category-Percentage">{category.percentage}%</span>
            </div>

            <div className="Category-Bar-Container">
              <div
                className="Category-Bar"
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingGraph;
