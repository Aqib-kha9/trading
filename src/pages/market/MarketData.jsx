import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';
import {
    TrendingUp, Activity,
    Layers, DollarSign, Settings, Eye, EyeOff,
    Maximize2, ChevronDown, BarChart2, Zap
} from 'lucide-react';
import { clsx } from 'clsx';

// --- Constants ---
const getThemeColors = () => {
    const style = getComputedStyle(document.documentElement);

    // Create a temporary element to resolve CSS variables to RGB
    const temp = document.createElement('div');
    temp.style.display = 'none';
    document.body.appendChild(temp);

    const resolve = (varName, fallback) => {
        const val = style.getPropertyValue(varName).trim();
        if (!val) return fallback;

        // Handle Shadcn HSL channels (e.g. "215 20% 65%")
        let cssColor = val;
        if (!val.startsWith('#') && !val.startsWith('rgb') && !val.startsWith('hsl')) {
            cssColor = `hsl(${val})`;
        }

        temp.style.color = cssColor;
        // Force browser to compute the rgb value
        const computed = getComputedStyle(temp).color;
        // If computation fails (invalid color), return fallback
        return computed !== '' ? computed : fallback;
    };

    const theme = {
        up: '#089981',
        down: '#f23645',
        bg: resolve('--background', '#0d1017'),
        grid: resolve('--border', '#1e293b'),
        text: resolve('--muted-foreground', '#94a3b8'),
        crosshair: resolve('--foreground', '#ffffff'),
    };

    document.body.removeChild(temp);
    return theme;
};

const TIMEFRAMES = [
    { label: '5m', val: '5m' }, { label: '15m', val: '15m' },
    { label: '1H', val: '1h' }, { label: '4H', val: '4h' }, { label: 'D', val: 'D' }, { label: 'W', val: 'W' }
];

const CHART_TYPES = [
    { id: 'Candle', label: 'Candles', icon: BarChart2 },
    { id: 'Area', label: 'Area', icon: Activity },
    { id: 'Line', label: 'Line', icon: TrendingUp },
];

const MARKET_DATA = {
    indices: [
        { symbol: 'NIFTY 50', price: '21,750.00', change: '+120.50', changePercent: '+0.56%', isUp: true, low: '21,600.00', high: '21,800.00' },
        { symbol: 'BANKNIFTY', price: '48,100.00', change: '-150.00', changePercent: '-0.31%', isUp: false, low: '47,900.00', high: '48,350.00' },
        { symbol: 'SENSEX', price: '72,200.00', change: '+350.00', changePercent: '+0.49%', isUp: true, low: '71,900.00', high: '72,400.00' },
    ],
    crypto: [
        { symbol: 'BTC/USD', price: '42,500.00', change: '+850.00', changePercent: '+2.05%', isUp: true, low: '41,200.00', high: '42,800.00' },
        { symbol: 'ETH/USD', price: '2,250.00', change: '-30.00', changePercent: '-1.30%', isUp: false, low: '2,200.00', high: '2,310.00' },
        { symbol: 'SOL/USD', price: '98.50', change: '+5.20', changePercent: '+5.50%', isUp: true, low: '92.00', high: '102.00' },
    ],
    forex: [
        { symbol: 'EUR/USD', price: '1.0950', change: '+0.0020', changePercent: '+0.18%', isUp: true, low: '1.0910', high: '1.0980' },
        { symbol: 'GBP/USD', price: '1.2750', change: '-0.0015', changePercent: '-0.12%', isUp: false, low: '1.2720', high: '1.2790' },
    ],
    commodities: [
        { symbol: 'GOLD', price: '2,050.00', change: '+15.00', changePercent: '+0.75%', isUp: true, low: '2,030.00', high: '2,060.00' },
        { symbol: 'CRUDE OIL', price: '72.50', change: '-1.20', changePercent: '-1.65%', isUp: false, low: '71.80', high: '74.00' },
    ]
};

// --- Helper: Generate Strict Data ---
const generateData = (points = 300, basePriceInput = 21750) => {
    let candleData = []; // { time, open, high, low, close }
    let lineData = [];   // { time, value }
    let stUp = [], stDown = [];

    const basePrice = typeof basePriceInput === 'string'
        ? parseFloat(basePriceInput.replace(/[^0-9.]/g, ''))
        : basePriceInput || 1000;

    let price = basePrice;
    let lastClose = price;

    const now = new Date();
    now.setHours(9, 15, 0, 0);
    // Start from past to present
    let currentTime = Math.floor(now.getTime() / 1000) - (points * 300);

    let trendDir = 1;
    let stVal = price * 0.99;

    for (let i = 0; i < points; i++) {
        const volatility = price * 0.002;
        const trend = Math.sin(i / 15) * volatility;
        const noise = (Math.random() - 0.5) * volatility;

        const open = lastClose;
        const close = open + trend + noise;
        const high = Math.max(open, close) + Math.abs(Math.random() * volatility * 0.5);
        const low = Math.min(open, close) - Math.abs(Math.random() * volatility * 0.5);

        const volVal = Math.floor(Math.random() * 1000) + 500;
        const isUp = close >= open;

        // Indicators
        const s20 = close + Math.cos(i / 10) * volatility * 2;
        const e50 = close + Math.cos(i / 20) * volatility * 3;

        // Supertrend
        const atr = (high - low) * 3;
        const upper = (high + low) / 2 + atr;
        const lower = (high + low) / 2 - atr;

        if (trendDir === 1) {
            stVal = Math.max(stVal, lower);
            if (close < stVal) { trendDir = -1; stVal = upper; }
        } else {
            stVal = Math.min(stVal, upper);
            if (close > stVal) { trendDir = 1; stVal = lower; }
        }

        // Strict Object Creation
        candleData.push({ time: currentTime, open, high, low, close });
        lineData.push({ time: currentTime, value: close });

        if (trendDir === 1) stUp.push({ time: currentTime, value: stVal });
        else stDown.push({ time: currentTime, value: stVal });

        lastClose = close;
        currentTime += 300;
    }

    return { candleData, lineData, stUp, stDown };
};

const Dropdown = ({ label, icon: Icon, children }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative z-50">
            <button
                onClick={() => setOpen(!open)}
                onBlur={() => setTimeout(() => setOpen(false), 200)}
                className={clsx("flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition-colors text-[11px]", open && "text-primary bg-primary/10")}
            >
                {Icon && <Icon size={14} />}
                <span>{label}</span>
                <ChevronDown size={10} className={clsx("transition-transform", open && "rotate-180")} />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-card border border-border rounded shadow-xl py-1 flex flex-col gap-0.5" onMouseDown={(e) => e.preventDefault()}>
                    {children}
                </div>
            )}
        </div>
    );
};

const MarketData = () => {
    const [activeTab, setActiveTab] = useState('indices');
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [chartType, setChartType] = useState('Candle');
    const [timeFrame, setTimeFrame] = useState('5m');
    const [features, setFeatures] = useState({
        supertrend: false,
    });
    // Add state to track theme changes
    const [themeVersion, setThemeVersion] = useState(0);

    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const legendRef = useRef(null); // Ref for the legend div
    const seriesRef = useRef({});
    const currentDataRef = useRef({}); // Store current data for legend

    // --- Theme Observer ---
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    setThemeVersion(v => v + 1);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    // --- Chart Init ---
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const theme = getThemeColors();

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: theme.bg },
                textColor: theme.text
            },
            grid: {
                vertLines: { color: theme.grid, style: LineStyle.Dotted },
                horzLines: { color: theme.grid, style: LineStyle.Dotted }
            },
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    labelBackgroundColor: theme.bg,
                },
                horzLine: {
                    labelBackgroundColor: theme.bg,
                }
            },
            timeScale: { borderColor: theme.grid, timeVisible: true },
            rightPriceScale: { borderColor: theme.grid, autoScale: true },
        });

        let mainSeries;
        if (chartType === 'Area') {
            mainSeries = chart.addAreaSeries({
                lineColor: '#2962ff', topColor: 'rgba(41, 98, 255, 0.4)', bottomColor: 'rgba(41, 98, 255, 0)'
            });
        } else if (chartType === 'Line') {
            mainSeries = chart.addLineSeries({ color: '#2962ff' });
        } else {
            mainSeries = chart.addCandlestickSeries({
                upColor: theme.up, downColor: theme.down, borderVisible: false, wickUpColor: theme.up, wickDownColor: theme.down
            });
        }

        // Supertrend Series
        const stUpSeries = chart.addLineSeries({ color: theme.up, lineWidth: 2, visible: false });
        const stDownSeries = chart.addLineSeries({ color: theme.down, lineWidth: 2, visible: false });

        seriesRef.current = { main: mainSeries, stUp: stUpSeries, stDown: stDownSeries };
        chartRef.current = chart;

        // --- Legend Logic ---
        chart.subscribeCrosshairMove(param => {
            if (!legendRef.current) return;

            const { main } = seriesRef.current;
            let open, high, low, close;

            if (param.time) {
                // Hovering over a candle
                const mainData = param.seriesData.get(main);

                if (mainData) {
                    if (chartType === 'Candle') {
                        ({ open, high, low, close } = mainData);
                    } else {
                        close = mainData.value;
                    }
                }
            } else {
                // Mouse Leave - Show Last Candle (Fallback)
                if (currentDataRef.current.candleData?.length > 0) {
                    const last = currentDataRef.current.candleData[currentDataRef.current.candleData.length - 1];
                    ({ open, high, low, close } = last);
                }
            }

            // HTML Format
            let html = `<div class="flex items-center gap-4 text-[11px] font-mono">`;

            if (open !== undefined || close !== undefined) {
                const isUp = close >= open;
                const colorClass = isUp ? 'text-[#089981]' : 'text-[#f23645]';

                if (chartType === 'Candle') {
                    html += `<span>O <span class="${colorClass}">${open.toFixed(2)}</span></span>`;
                    html += `<span>H <span class="${colorClass}">${high.toFixed(2)}</span></span>`;
                    html += `<span>L <span class="${colorClass}">${low.toFixed(2)}</span></span>`;
                    html += `<span>C <span class="${colorClass}">${close.toFixed(2)}</span></span>`;
                } else {
                    html += `<span>Price <span class="text-[#2962ff]">${(close || 0).toFixed(2)}</span></span>`;
                }
            }
            html += `</div>`;
            legendRef.current.innerHTML = html;
        });

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
            }
        };
        const observer = new ResizeObserver(handleResize);
        observer.observe(chartContainerRef.current);

        return () => {
            observer.disconnect();
            chart.remove();
        };
    }, [chartType, features, themeVersion]);

    // --- Data Update ---
    useEffect(() => {
        if (!selectedSymbol || !chartRef.current) return;

        // Generate
        const data = generateData(500, selectedSymbol.price);
        currentDataRef.current = data; // Store for fallback

        // Set Data - Handle Type Mismatch
        if (chartType === 'Candle') {
            seriesRef.current.main.setData(data.candleData);
        } else {
            seriesRef.current.main.setData(data.lineData);
        }

        seriesRef.current.stUp.setData(data.stUp);
        seriesRef.current.stDown.setData(data.stDown);

        // Update Visibility
        seriesRef.current.stUp.applyOptions({ visible: features.supertrend });
        seriesRef.current.stDown.applyOptions({ visible: features.supertrend });

        // Force Scale Fit (Ensures data is visible on type switch)
        chartRef.current.timeScale().fitContent();

        chartRef.current.applyOptions({
            watermark: {
                visible: true,
                fontSize: 24,
                horzAlign: 'center',
                vertAlign: 'center',
                color: 'rgba(255, 255, 255, 0.05)',
                text: `${selectedSymbol.symbol} • ${timeFrame} • Market`,
            },
        });

    }, [selectedSymbol, features, timeFrame, chartType]);

    // Init
    useEffect(() => {
        if (!selectedSymbol && MARKET_DATA[activeTab].length) {
            setSelectedSymbol(MARKET_DATA[activeTab][0]);
        }
    }, [activeTab]);

    const toggleFeature = (key) => setFeatures(f => ({ ...f, [key]: !f[key] }));

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Header Tabs */}
            <div className="flex flex-col gap-4 shrink-0">
                <div className="flex items-center gap-1 border-b border-border overflow-x-auto custom-scrollbar">
                    {Object.keys(MARKET_DATA).map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setSelectedSymbol(MARKET_DATA[tab][0]); }}
                            className={clsx(
                                "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 whitespace-nowrap",
                                activeTab === tab ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
                {/* 1. Chart Area (Now FIRST/LEFT) */}
                <div className="terminal-panel lg:col-span-2 border border-border bg-card rounded-lg overflow-hidden flex flex-col shadow-2xl relative">
                    {/* Toolbar */}
                    <div className="h-10 border-b border-white/5 bg-[#0f172a] flex items-center px-4 gap-2 shrink-0">
                        <div className="flex items-center gap-2 mr-4 min-w-[120px]">
                            <span className="font-bold text-sm text-foreground">{selectedSymbol?.symbol}</span>
                            <span className="text-[10px] text-muted-foreground bg-white/5 px-1 rounded">CME</span>
                        </div>

                        <div className="h-4 w-[1px] bg-white/10 mx-1 mobile-hide" />

                        <div className="flex bg-black/20 rounded p-0.5">
                            {TIMEFRAMES.map(tf => (
                                <button
                                    key={tf.val}
                                    onClick={() => setTimeFrame(tf.val)}
                                    className={clsx(
                                        "px-2 py-0.5 text-[10px] font-bold rounded transition-colors",
                                        timeFrame === tf.val ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                                    )}
                                >
                                    {tf.label}
                                </button>
                            ))}
                        </div>

                        <div className="h-4 w-[1px] bg-white/10 mx-1" />

                        <Dropdown label={CHART_TYPES.find(t => t.id === chartType)?.label} icon={CHART_TYPES.find(t => t.id === chartType)?.icon}>
                            {CHART_TYPES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setChartType(t.id)}
                                    className={clsx(
                                        "px-3 py-1.5 text-left text-[11px] hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2",
                                        chartType === t.id && "text-primary font-bold"
                                    )}
                                >
                                    <t.icon size={12} /> {t.label}
                                </button>
                            ))}
                        </Dropdown>

                        <div className="h-4 w-[1px] bg-white/10 mx-1" />
                    </div>

                    <div className="flex-1 w-full relative bg-background">
                        {/* LEGEND OVERLAY */}
                        <div ref={legendRef} className="absolute left-3 top-2 z-20 pointer-events-none select-none">
                            {/* Content injected by crosshair handler */}
                        </div>
                        <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />
                    </div>
                </div>

                {/* 2. Watchlist (Now SECOND/RIGHT) */}
                <div className="terminal-panel lg:col-span-1 border border-border bg-card rounded-lg overflow-hidden flex flex-col shadow-2xl">
                    <div className="p-3 border-b border-border bg-muted/20 font-bold text-xs uppercase text-muted-foreground">
                        {activeTab} Live
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <tbody className="text-[11px] font-mono">
                                {MARKET_DATA[activeTab].map(m => (
                                    <tr
                                        key={m.symbol}
                                        onClick={() => setSelectedSymbol(m)}
                                        className={clsx(
                                            "cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5",
                                            selectedSymbol?.symbol === m.symbol && "bg-primary/10"
                                        )}
                                    >
                                        <td className="p-3 font-bold text-foreground">{m.symbol}</td>
                                        <td className="p-3 text-right">{m.price}</td>
                                        <td className={clsx("p-3 text-right font-bold", m.isUp ? "text-[#089981]" : "text-[#f23645]")}>
                                            {m.changePercent}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketData;
