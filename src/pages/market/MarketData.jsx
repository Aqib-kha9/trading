import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
    TrendingUp, TrendingDown, Activity, BarChart2, Globe, Bitcoin,
    Layers, DollarSign, Settings, LineChart, CandlestickChart,
    Eye, EyeOff, Grid, Search, ZoomIn
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Line,
    ComposedChart, Bar, Cell, Brush
} from 'recharts';
import { clsx } from 'clsx';

// Constants
const THEME = {
    up: '#10b981',   // Emerald 500
    down: '#ef4444', // Red 500
    line: '#2962ff', // Blue 600
    grid: '#1e293b', // Slate 800
    text: '#64748b'  // Slate 500
};

// --- Mock Data & Generators ---
const MARKET_DATA = {
    indices: [
        { symbol: 'NIFTY 50', price: '21,750.00', change: '+120.50', changePercent: '+0.56%', isUp: true, low: '21,600.00', high: '21,800.00' },
        { symbol: 'BANKNIFTY', price: '48,100.00', change: '-150.00', changePercent: '-0.31%', isUp: false, low: '47,900.00', high: '48,350.00' },
        { symbol: 'SENSEX', price: '72,200.00', change: '+350.00', changePercent: '+0.49%', isUp: true, low: '71,900.00', high: '72,400.00' },
        { symbol: 'FINNIFTY', price: '21,450.00', change: '+40.00', changePercent: '+0.19%', isUp: true, low: '21,380.00', high: '21,520.00' },
    ],
    crypto: [
        { symbol: 'BTC/USD', price: '42,500.00', change: '+850.00', changePercent: '+2.05%', isUp: true, low: '41,200.00', high: '42,800.00' },
        { symbol: 'ETH/USD', price: '2,250.00', change: '-30.00', changePercent: '-1.30%', isUp: false, low: '2,200.00', high: '2,310.00' },
        { symbol: 'SOL/USD', price: '98.50', priceRaw: 98.5, change: '+5.20', changePercent: '+5.50%', isUp: true, low: '92.00', high: '102.00' },
    ],
    forex: [
        { symbol: 'EUR/USD', price: '1.0950', change: '+0.0020', changePercent: '+0.18%', isUp: true, low: '1.0910', high: '1.0980' },
        { symbol: 'GBP/USD', price: '1.2750', change: '-0.0015', changePercent: '-0.12%', isUp: false, low: '1.2720', high: '1.2790' },
        { symbol: 'USD/JPY', price: '145.20', change: '+0.50', changePercent: '+0.35%', isUp: true, low: '144.50', high: '145.80' },
    ],
    commodities: [
        { symbol: 'GOLD', price: '2,050.00', change: '+15.00', changePercent: '+0.75%', isUp: true, low: '2,030.00', high: '2,060.00' },
        { symbol: 'CRUDE OIL', price: '72.50', change: '-1.20', changePercent: '-1.65%', isUp: false, low: '71.80', high: '74.00' },
        { symbol: 'SILVER', price: '23.10', change: '+0.25', changePercent: '+1.10%', isUp: true, low: '22.80', high: '23.50' },
    ]
};

const generateCandleData = (points = 100, basePriceInput = 21750, timeframeMultiplier = 1) => {
    let data = [];
    const basePrice = typeof basePriceInput === 'string'
        ? parseFloat(basePriceInput.replace(/[^0-9.]/g, ''))
        : basePriceInput;

    let price = basePrice || 1000;
    const baseVolatility = (price * 0.002) * timeframeMultiplier;

    for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.5) * baseVolatility;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.abs(Math.random() * baseVolatility);
        const low = Math.min(open, close) - Math.abs(Math.random() * baseVolatility);

        const sma5 = close + (Math.random() - 0.5) * (baseVolatility * 1.5);
        const sma20 = close + (Math.random() - 0.5) * (baseVolatility * 3);

        price = close;
        const isUp = close >= open;

        data.push({
            time: `${10 + Math.floor(i / 12)}:${(i % 12) * 5}`.replace(/:(\d)$/, ':0$1'),
            open, high, low, close,
            sma5, sma20,
            volume: 500 + Math.floor(Math.random() * 1500),
            isUp,
            candleBody: [Math.min(open, close), Math.max(open, close)],
            candleWick: [low, high]
        });
    }
    return data;
};

// --- Custom Components ---

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const d = payload.find(p => p.payload.candleBody)?.payload || payload[0].payload;
        return (
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg shadow-2xl text-[10px] font-mono z-50 min-w-[180px] backdrop-blur-md">
                <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className={clsx("font-bold px-1.5 py-0.5 rounded", d.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                        {d.close.toFixed(2)}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <span className="text-slate-500">Open</span>
                    <span className="text-slate-200 text-right">{d.open.toFixed(2)}</span>
                    <span className="text-slate-500">High</span>
                    <span className="text-slate-200 text-right">{d.high.toFixed(2)}</span>
                    <span className="text-slate-500">Low</span>
                    <span className="text-slate-200 text-right">{d.low.toFixed(2)}</span>
                    <span className="text-slate-500">Close</span>
                    <span className="text-slate-200 text-right">{d.close.toFixed(2)}</span>
                    <span className="text-slate-500">Volume</span>
                    <span className="text-yellow-500 text-right">{d.volume.toLocaleString()}</span>
                </div>
            </div>
        );
    }
    return null;
};

const SettingsMenu = ({ config, setConfig, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="absolute bottom-12 right-4 w-56 bg-card border border-border shadow-2xl rounded-lg overflow-hidden z-[100] animate-in slide-in-from-bottom-2 fade-in duration-200">
            <div className="p-3 border-b border-border bg-muted/20 font-bold text-[10px] uppercase tracking-wider text-muted-foreground">
                Chart Settings
            </div>

            <div className="p-2 space-y-1">
                {/* Chart Type */}
                <div className="flex flex-col gap-1 p-2 bg-muted/10 rounded">
                    <span className="text-[10px] font-semibold text-foreground mb-1">Chart Style</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setConfig({ ...config, type: 'area' })}
                            className={clsx("flex-1 py-1.5 px-2 text-[10px] rounded border transition-colors flex items-center justify-center gap-1",
                                config.type === 'area' ? "bg-primary/10 border-primary text-primary" : "border-transparent hover:bg-white/5 text-muted-foreground"
                            )}
                        >
                            <LineChart size={12} /> Line
                        </button>
                        <button
                            onClick={() => setConfig({ ...config, type: 'candle' })}
                            className={clsx("flex-1 py-1.5 px-2 text-[10px] rounded border transition-colors flex items-center justify-center gap-1",
                                config.type === 'candle' ? "bg-primary/10 border-primary text-primary" : "border-transparent hover:bg-white/5 text-muted-foreground"
                            )}
                        >
                            <CandlestickChart size={12} /> Candle
                        </button>
                    </div>
                </div>

                {/* Toggles */}
                <button
                    onClick={() => setConfig({ ...config, showZoom: !config.showZoom })}
                    className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded transition-colors text-[11px]"
                >
                    <span className="flex items-center gap-2 text-muted-foreground"><ZoomIn size={12} /> Zoom Slider</span>
                    {config.showZoom ? <Eye size={12} className="text-primary" /> : <EyeOff size={12} />}
                </button>

                <button
                    onClick={() => setConfig({ ...config, showVolume: !config.showVolume })}
                    className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded transition-colors text-[11px]"
                >
                    <span className="flex items-center gap-2 text-muted-foreground"><BarChart2 size={12} /> Volume Bars</span>
                    {config.showVolume ? <Eye size={12} className="text-primary" /> : <EyeOff size={12} />}
                </button>

                <button
                    onClick={() => setConfig({ ...config, showGrid: !config.showGrid })}
                    className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded transition-colors text-[11px]"
                >
                    <span className="flex items-center gap-2 text-muted-foreground"><Grid size={12} /> Grid Lines</span>
                    {config.showGrid ? <Eye size={12} className="text-primary" /> : <EyeOff size={12} />}
                </button>
            </div>
        </div>
    );
};

const MarketData = () => {
    const [activeTab, setActiveTab] = useState('indices');
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [chartData, setChartData] = useState([]);

    // UI States
    const [timeFrame, setTimeFrame] = useState('1h');
    const [showSettings, setShowSettings] = useState(false);

    // Chart Config
    const [config, setConfig] = useState({
        type: 'area', // 'area' | 'candle'
        showVolume: true,
        showGrid: true,
        showIndicators: false,
        showZoom: true
    });

    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // --- Effects ---

    useLayoutEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) setDimensions({ width, height });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!selectedSymbol && MARKET_DATA[activeTab].length > 0) {
            setSelectedSymbol(MARKET_DATA[activeTab][0]);
        }
    }, [activeTab]);

    useEffect(() => {
        if (selectedSymbol) {
            const multipliers = { '1m': 0.2, '5m': 0.5, '15m': 0.8, '1h': 1, '4h': 2, 'D': 4, 'W': 10 };
            const multiplier = multipliers[timeFrame] || 1;
            setChartData(generateCandleData(80, selectedSymbol.price, multiplier));
        }
    }, [selectedSymbol, timeFrame]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedSymbol(MARKET_DATA[tab][0]);
    };

    // --- Renderers ---

    const renderChart = () => {
        if (!dimensions.width) return null;

        return (
            <ComposedChart
                width={dimensions.width}
                height={dimensions.height}
                data={chartData}
                margin={{ top: 10, right: 0, left: 10, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="gradientPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={THEME.line} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={THEME.line} stopOpacity={0} />
                    </linearGradient>
                </defs>

                {config.showGrid && (
                    <CartesianGrid strokeDasharray="3 3" vertical={true} stroke={THEME.grid} opacity={0.3} />
                )}

                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: THEME.text }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={false}
                    interval={Math.floor(dimensions.width / 120)}
                />

                <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 10, fill: THEME.text }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={false}
                    tickFormatter={(val) => val.toFixed(2)}
                    width={50}
                />
                <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={[0, 'dataMax * 4']}
                    hide
                />

                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }}
                />

                {/* ZOOM SLIDER (Brush) */}
                {config.showZoom && (
                    <Brush
                        dataKey="time"
                        height={20}
                        stroke={THEME.text}
                        fill="#0b121f"
                        tickFormatter={() => ''}
                        travellerWidth={10}
                        y={dimensions.height - 20}
                    />
                )}

                {/* Volume Layer */}
                {config.showVolume && (
                    <Bar
                        yAxisId="left"
                        dataKey="volume"
                        barSize={4}
                        fillOpacity={0.3}
                        radius={[2, 2, 0, 0]}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isUp ? THEME.up : THEME.down} />
                        ))}
                    </Bar>
                )}

                {/* Price Layer: Area vs Candle */}
                {config.type === 'area' ? (
                    <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="close"
                        stroke={THEME.line}
                        strokeWidth={2}
                        fill="url(#gradientPrice)"
                        activeDot={{ r: 4, strokeWidth: 2, stroke: '#0f172a', fill: '#fff' }}
                        animationDuration={300}
                    />
                ) : (
                    /* Authentic Candlestick using Dual Floating Bars */
                    <>
                        {/* Wick */}
                        <Bar
                            yAxisId="right"
                            dataKey="candleWick"
                            barSize={1}
                            minPointSize={1}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`wick-${index}`} fill={entry.isUp ? THEME.up : THEME.down} />
                            ))}
                        </Bar>
                        {/* Body */}
                        <Bar
                            yAxisId="right"
                            dataKey="candleBody"
                            barSize={6}
                            minPointSize={1}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`body-${index}`} fill={entry.isUp ? THEME.up : THEME.down} />
                            ))}
                        </Bar>
                    </>
                )}

                {/* Indicators */}
                {config.showIndicators && (
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="sma5"
                        stroke="#fbbf24"
                        strokeWidth={1.5}
                        dot={false}
                        opacity={0.8}
                    />
                )}
            </ComposedChart>
        );
    };

    return (
        <div className="h-full flex flex-col gap-4">
            {/* --- Header Tabs --- */}
            <div className="flex flex-col gap-4 shrink-0">
                <div className="flex items-center gap-1 border-b border-border overflow-x-auto custom-scrollbar">
                    {['indices', 'crypto', 'forex', 'commodities'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={clsx(
                                "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 whitespace-nowrap",
                                activeTab === tab
                                    ? "border-primary text-primary bg-primary/5"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                        >
                            {tab === 'indices' && <Layers size={14} />}
                            {tab === 'crypto' && <Bitcoin size={14} />}
                            {tab === 'forex' && <Globe size={14} />}
                            {tab === 'commodities' && <DollarSign size={14} />}
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">

                {/* --- Data Table Panel --- */}
                {/* CHANGED: h-[500px] -> h-full for full screen fill */}
                <div className="terminal-panel w-full h-full overflow-hidden border border-border bg-card rounded-lg shadow-2xl relative flex flex-col lg:col-span-1 min-h-0">
                    <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    <div className="p-3 border-b border-border bg-muted/20 font-bold text-xs uppercase text-muted-foreground flex justify-between items-center relative z-20 backdrop-blur-sm">
                        <span>{activeTab} Overview</span>
                        <div className="text-[9px] font-mono opacity-70">Live Feed</div>
                    </div>

                    <div className="overflow-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-muted/50 sticky top-0 z-10 uppercase tracking-widest text-[9px] font-bold text-muted-foreground border-b border-border shadow-sm backdrop-blur-md">
                                <tr>
                                    <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Symbol</th>
                                    <th className="px-5 py-3 border-r border-border text-right bg-muted/90 backdrop-blur-sm">Price</th>
                                    <th className="px-5 py-3 border-r border-border text-right bg-muted/90 backdrop-blur-sm">Change</th>
                                    <th className="px-5 py-3 border-r border-border text-right bg-muted/90 backdrop-blur-sm">H/L</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-transparent text-[11px] font-medium font-mono">
                                {MARKET_DATA[activeTab].map((m) => (
                                    <tr
                                        key={m.symbol}
                                        onClick={() => setSelectedSymbol(m)}
                                        className={clsx(
                                            "cursor-pointer transition-colors group relative",
                                            selectedSymbol?.symbol === m.symbol ? "bg-primary/5" : "hover:bg-primary/[0.02]"
                                        )}
                                    >
                                        <td className="px-5 py-3 border-r border-border relative">
                                            {selectedSymbol?.symbol === m.symbol && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary"></div>}
                                            <span className={clsx("font-bold", selectedSymbol?.symbol === m.symbol ? "text-primary" : "text-foreground")}>{m.symbol}</span>
                                        </td>
                                        <td className="px-5 py-3 text-right text-foreground font-bold border-r border-border">{m.price}</td>
                                        <td className={`px-5 py-3 text-right font-bold border-r border-border ${m.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                                            <div className="flex items-center justify-end gap-1">
                                                {m.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                {m.change}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right text-muted-foreground border-r border-border">
                                            <span className="text-emerald-500/80">{m.high}</span>/<span className="text-red-500/80">{m.low}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- Chart Panel --- */}
                {/* CHANGED: h-[500px] -> h-full for full screen fill */}
                <div className="terminal-panel w-full h-full overflow-hidden border border-border bg-card rounded-lg shadow-2xl relative flex flex-col transition-all duration-300 lg:col-span-2 min-h-0">
                    {/* Top Bar Info */}
                    <div className="p-3 border-b border-border bg-muted/20 flex flex-col gap-2 shrink-0 relative z-20 backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
                                {selectedSymbol ? selectedSymbol.symbol : 'Select Symbol'}
                                <span className="text-[10px] text-muted-foreground font-normal border border-white/10 px-1 rounded">NSE</span>
                            </h3>
                            {selectedSymbol && (
                                <div className="flex items-center gap-3">
                                    <span className={clsx("text-lg font-bold tracking-tight font-mono", selectedSymbol.isUp ? "text-emerald-500" : "text-red-500")}>
                                        {selectedSymbol.price}
                                    </span>
                                    <span className={clsx("text-xs font-mono", selectedSymbol.isUp ? "text-emerald-500" : "text-red-500")}>
                                        {selectedSymbol.change} ({selectedSymbol.changePercent})
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="flex-1 w-full min-h-0 relative bg-[#0b121f] flex flex-col group">
                        {/* Toolbar */}
                        <div className="h-10 border-b border-white/5 flex items-center px-4 gap-4 text-[11px] text-muted-foreground bg-[#0f172a] shrink-0 overflow-x-auto custom-scrollbar">
                            <button
                                onClick={() => setConfig({ ...config, showIndicators: !config.showIndicators })}
                                className={clsx("flex items-center gap-1 hover:text-white cursor-pointer transition-colors px-2 py-1 rounded", config.showIndicators && "bg-primary/20 text-primary")}
                            >
                                <Activity size={14} /> Indicators
                            </button>

                            <div className="h-4 w-[1px] bg-white/10"></div>

                            {['1m', '5m', '15m', '1h', '4h', 'D', 'W'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTimeFrame(t)}
                                    className={clsx(
                                        "cursor-pointer hover:text-primary transition-colors px-2 py-1 rounded min-w-[30px] text-center",
                                        timeFrame === t ? "text-primary font-bold bg-white/5" : ""
                                    )}
                                >
                                    {t}
                                </button>
                            ))}

                            <div className="flex-1"></div>

                            <div className="flex items-center gap-2 relative">
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className={clsx("p-1.5 rounded transition-colors relative z-20", showSettings ? "bg-primary text-black hover:bg-primary/90" : "hover:bg-white/5 text-white hover:text-primary")}
                                    title="Settings"
                                >
                                    <Settings size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Settings Popover */}
                        <SettingsMenu config={config} setConfig={setConfig} isOpen={showSettings} onClose={() => setShowSettings(false)} />

                        {/* Rendering Area */}
                        {/* Ensure min-height or flex behavior keeps it visible */}
                        <div ref={containerRef} className="flex-1 w-full h-full min-h-[400px] relative overflow-hidden cursor-crosshair">
                            {renderChart()}
                            {!selectedSymbol && (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                                    Select a symbol to view chart
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketData;
