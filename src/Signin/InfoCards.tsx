export default function InfoCards() {
  return (
    <section className="Landing-Page-Info">
      <h2 className="Info-Heading">Budget Management, Made Simple</h2>

      <div className="Flex-Container-1">
        <div className="Landing-Page-Section">
          <h3 className="Landing-Page-Heading">Step 1: Set up your categories</h3>
          <p>By categorizing your expenses you can easily see where you are over-spending</p>
          <img
            className="Landing-Page-Icon"
            alt="entry chart"
            src="https://cdn2.iconfinder.com/data/icons/business-management-158/32/05.Pie_curve-512.png"
          />
        </div>
      </div>
      <div className="Flex-Container-2">
        <div className="Landing-Page-Section">
          <h3 className="Landing-Page-Heading">Step 2: Add Transactions</h3>
          <p>
            Each time you spend money, take 2 minutes a day, upload any financial transaction that you want to track
          </p>
          <img
            className="Landing-Page-Icon"
            alt="money"
            src="https://cdn0.iconfinder.com/data/icons/business-management-line-2/24/cash-512.png"
          />
        </div>
      </div>
      <div className="Flex-Container-3">
        <div className="Landing-Page-Section">
          <h3 className="Landing-Page-Heading">Step 3: Enjoy your savings!</h3>
          <p>Make a daily routine out of checking your budget, and you'll learn to save!</p>
          <img
            className="Landing-Page-Icon"
            alt="see your savings"
            src="https://cdn2.iconfinder.com/data/icons/business-management-158/32/03.Profit_increases-512.png"
          />
        </div>
      </div>
    </section>
  );
}
