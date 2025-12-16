import React from 'react';

const TickerMarquee = () => {
    const [indices, setIndices] = React.useState([
        { symbol: "NIFTY", price: 21450.50, change: 0.45, isPositive: true },
        { symbol: "BANKNIFTY", price: 47800.20, change: -0.24, isPositive: false },
        { symbol: "SENSEX", price: 72240.10, change: 0.38, isPositive: true },
        { symbol: "CRUDEOIL", price: 6230.00, change: 1.25, isPositive: true },
        { symbol: "GOLD", price: 62500.00, change: 0.05, isPositive: true },
    ]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setIndices(prev => prev.map(item => {
                const fluctuation = (Math.random() - 0.5) * (item.price * 0.0005); // 0.05% fluctuation
                const newPrice = item.price + fluctuation;
                const newChange = item.change + (Math.random() - 0.5) * 0.02;
                return {
                    ...item,
                    price: newPrice,
                    change: newChange,
                    isPositive: newChange >= 0
                };
            }));
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex animate-marquee hover:pause whitespace-nowrap">
            {[...indices, ...indices, ...indices, ...indices].map((item, i) => (
                <span key={i} className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono font-medium mr-6 ${item.isPositive ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10' : 'text-red-400 bg-red-400/5 border-red-400/10'}`}>
                    {item.symbol}
                    <span className="text-white font-bold">{item.price.toFixed(2).toLocaleString()}</span>
                    <span>{item.isPositive ? '▲' : '▼'}{Math.abs(item.change).toFixed(2)}%</span>
                </span>
            ))}
        </div>
    );
};

export default TickerMarquee;
