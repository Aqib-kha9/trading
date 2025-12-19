import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle, LineType } from 'lightweight-charts';
import {
    TrendingUp, Activity,
    Layers, DollarSign, Settings, Eye, EyeOff,
    Maximize2, ChevronDown, BarChart2, Zap, Search, X, Command,
    AlignLeft, Grid, Monitor, BarChart, ChevronRight, MoreHorizontal, ExternalLink, Plus, LayoutGrid, ArrowUpRight, ArrowDownRight, GripVertical, GripHorizontal
} from 'lucide-react';
import { clsx } from 'clsx';

// --- Constants ---
const getThemeColors = () => {
    const style = getComputedStyle(document.documentElement);
    const temp = document.createElement('div');
    temp.style.display = 'none';
    document.body.appendChild(temp);

    // Resolve CSS variable to hex/rgb
    const resolve = (varName, fallback) => {
        const val = style.getPropertyValue(varName).trim();
        if (!val) return fallback;
        let cssColor = val;
        // If it's a naked HSL value (e.g. "222.2 84% 4.9%"), wrap it
        if (!val.startsWith('#') && !val.startsWith('rgb') && !val.startsWith('hsl')) {
            cssColor = `hsl(${val})`;
        }
        temp.style.color = cssColor;
        const computed = getComputedStyle(temp).color;
        // Check if valid
        return computed !== '' ? computed : fallback;
    };

    const theme = {
        up: '#089981',
        down: '#f23645',
        // Resolve bg-background and bg-card for chart background
        bg: resolve('--background', '#0d1017'),
        grid: resolve('--border', '#1e293b'),
        text: resolve('--muted-foreground', '#94a3b8'),
        crosshair: resolve('--foreground', '#ffffff'),
        primary: resolve('--primary', '#2962ff'),
    };
    document.body.removeChild(temp);
    return theme;
};

const TIMEFRAMES = [{ label: '5m', val: '5m' }, { label: '15m', val: '15m' }, { label: '1H', val: '1h' }, { label: '4H', val: '4h' }, { label: 'D', val: 'D' }, { label: 'W', val: 'W' }];

const CHART_TYPES = [
    { id: 'Candle', label: 'Regular', icon: BarChart2 }, { id: 'Hollow', label: 'Hollow', icon: BarChart2 },
    { id: 'Bar', label: 'Bars', icon: AlignLeft }, { id: 'HeikinAshi', label: 'Heikin Ashi', icon: Layers },
    { id: 'Line', label: 'Line', icon: TrendingUp }, { id: 'Area', label: 'Area', icon: Activity },
    { id: 'Baseline', label: 'Baseline', icon: Activity }, { id: 'Step', label: 'Step Line', icon: TrendingUp },
    { id: 'Columns', label: 'Columns', icon: BarChart },
];

const MARKET_DATA = {
    indices: [
        {
            symbol: 'SPX', description: 'S&P 500 Index', market: 'CBOE', price: '6,774.75', change: '+53.33', changePercent: '+0.79%', isUp: true, low: '6,720.00', high: '6,785.00',
            perf: { '1W': '+1.5%', '1M': '+3.2%', '3M': '+7.8%', '6M': '+14.1%', 'YTD': '+10.4%', '1Y': '+18.2%' },
            tech: 72, profile: { 'Sector': 'Index', 'Exch': 'CBOE' }
        },
        {
            symbol: 'NDQ', description: 'Nasdaq 100 Index', market: 'NASDAQ', price: '25,019.37', change: '+371.76', changePercent: '+1.51%', isUp: true, low: '24,800.00', high: '25,100.00',
            perf: { '1W': '+2.8%', '1M': '+5.1%', '3M': '+12.5%', '6M': '+22.5%', 'YTD': '+18.6%', '1Y': '+35.8%' },
            tech: 88, profile: { 'Sector': 'Index', 'Exch': 'NASDAQ' }
        },
        {
            symbol: 'DJI', description: 'Dow Jones Industrial Average', market: 'CBOE', price: '47,951.85', change: '+65.88', changePercent: '+0.14%', isUp: true, low: '47,800.00', high: '48,050.00',
            perf: { '1W': '+0.5%', '1M': '+1.8%', '3M': '+5.2%', '6M': '+8.5%', 'YTD': '+6.5%', '1Y': '+12.4%' },
            tech: 60, profile: { 'Sector': 'Index', 'Exch': 'CBOE' }
        },
        {
            symbol: 'VIX', description: 'Volatility S&P 500', market: 'CBOE', price: '16.18', change: '-0.69', changePercent: '-4.09%', isUp: false, low: '16.10', high: '17.20',
            perf: { '1W': '-5.2%', '1M': '-12.4%', '3M': '-25.8%', '6M': '-32.1%', 'YTD': '-15.4%', '1Y': '-45.2%' },
            tech: 20, profile: { 'Sector': 'Index', 'Exch': 'CBOE' }
        },
        {
            symbol: 'DXY', description: 'US Dollar Currency Index', market: 'ICE', price: '98.69', change: '+0.273', changePercent: '+0.28%', isUp: true, low: '98.40', high: '98.80',
            perf: { '1W': '+0.4%', '1M': '+1.2%', '3M': '+2.8%', '6M': '+4.1%', 'YTD': '+3.4%', '1Y': '+5.2%' },
            tech: 65, profile: { 'Sector': 'Currency', 'Exch': 'ICE' }
        },
    ],
    stocks: [
        {
            symbol: 'AAPL', description: 'Apple Inc.', market: 'NASDAQ', price: '272.19', change: '+0.35', changePercent: '+0.13%', isUp: true, low: '271.50', high: '273.40',
            perf: { '1W': '+1.2%', '1M': '+4.5%', '3M': '+15.8%', '6M': '+28.1%', 'YTD': '+24.4%', '1Y': '+45.2%' },
            tech: 78, profile: { 'Sector': 'Technology', 'Employees': '164k' }
        },
        {
            symbol: 'TSLA', description: 'Tesla Inc.', market: 'NASDAQ', price: '483.37', change: '+16.11', changePercent: '+3.45%', isUp: true, low: '470.00', high: '485.00',
            perf: { '1W': '+8.2%', '1M': '+18.4%', '3M': '+45.8%', '6M': '+82.1%', 'YTD': '+98.4%', '1Y': '+125.2%' },
            tech: 92, profile: { 'Sector': 'Consumer Cyclical', 'Employees': '127k' }
        },
        {
            symbol: 'NVDA', description: 'NVIDIA Corp.', market: 'NASDAQ', price: '892.10', change: '+25.50', changePercent: '+2.94%', isUp: true, low: '870.00', high: '900.00',
            perf: { '1W': '+5.2%', '1M': '+12.4%', '3M': '+35.8%', '6M': '+75.1%', 'YTD': '+150.4%', '1Y': '+220.2%' },
            tech: 95, profile: { 'Sector': 'Technology', 'Employees': '29k' }
        },
    ],
    crypto: [
        {
            symbol: 'BTC/USD', description: 'Bitcoin / US Dollar', market: 'CRYPTO', price: '42,500.00', change: '+850.00', changePercent: '+2.05%', isUp: true, low: '41,200.00', high: '42,800.00',
            perf: { '1W': '+5.2%', '1M': '+15.4%', '3M': '+35.8%', '6M': '+62.1%', 'YTD': '+108.4%', '1Y': '+145.2%' },
            tech: 85, profile: { 'ISIN': '-', 'Sector': 'Currency', 'Employees': '-' }
        },
    ],
    forex: [{ symbol: 'EUR/USD', description: 'Euro / US Dollar', market: 'FOREX', price: '1.0950', change: '+0.0020', changePercent: '+0.18%', isUp: true, low: '1.0910', high: '1.0980', perf: { '1W': '+0.1%', '1M': '-0.5%', '3M': '+1.2%', '6M': '+2.5%', 'YTD': '-1.2%', '1Y': '+3.4%' }, tech: 55, profile: { 'ISIN': '-', 'Sector': 'Currency', 'Employees': '-' } }],
    commodities: [{ symbol: 'GOLD', description: 'Gold Spot', market: 'MCX', price: '2,050.00', change: '+15.00', changePercent: '+0.75%', isUp: true, low: '2,030.00', high: '2,060.00', perf: { '1W': '+1.5%', '1M': '+3.4%', '3M': '+8.8%', '6M': '+10.1%', 'YTD': '+12.4%', '1Y': '+18.2%' }, tech: 75, profile: { 'ISIN': '-', 'Sector': 'Commodity', 'Employees': '-' } }]
};

// --- Widgets ---
const PerformanceCard = ({ label, value }) => {
    const isPos = value.includes('+');
    return (
        <div className={clsx("flex flex-col items-center justify-center p-2 rounded-md transition-colors", isPos ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
            <span className="text-xs font-bold">{value}</span>
            <span className="text-[10px] opacity-60 uppercase">{label}</span>
        </div>
    );
};

const Gauge = ({ value }) => (
    <div className="flex flex-col items-center">
        <div className="relative w-32 h-16 overflow-hidden">
            {/* Background Arc */}
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[6px] border-muted/20" style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent', transform: 'rotate(-45deg)', transformOrigin: '50% 50%' }}></div>
            {/* Colored Arcs */}
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[6px] border-transparent" style={{ borderTopColor: '#f23645', transform: 'rotate(-45deg)', transformOrigin: '50% 50%', clipPath: 'polygon(0 0, 20% 0, 50% 50%, 0 20%)' }}></div>
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[6px] border-transparent" style={{ borderTopColor: '#eab308', transform: 'rotate(0deg)', transformOrigin: '50% 50%', clipPath: 'polygon(40% 0, 60% 0, 50% 50%)' }}></div>
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[6px] border-transparent" style={{ borderTopColor: '#089981', transform: 'rotate(45deg)', transformOrigin: '50% 50%', clipPath: 'polygon(80% 0, 100% 0, 50% 50%)' }}></div>
            {/* Needle */}
            <div className="absolute bottom-0 left-1/2 w-0.5 h-14 bg-foreground origin-bottom transition-all duration-500 ease-out z-10" style={{ transform: `translateX(-50%) rotate(${(value / 100) * 180 - 90}deg)` }}></div>
            <div className="absolute bottom-[-4px] left-1/2 w-2 h-2 bg-foreground rounded-full -translate-x-1/2 z-20" />
        </div>
        <div className="flex justify-between w-full px-2 text-[9px] text-muted-foreground mt-1">
            <span>Sell</span>
            <span className="font-bold text-foreground">Neutral</span>
            <span>Buy</span>
        </div>
    </div>
);

const LineChartMock = ({ color }) => (
    <svg viewBox="0 0 100 40" className="w-full h-10 overflow-visible">
        <path d="M0,35 C10,32 15,38 25,25 C35,15 45,28 55,20 C65,12 75,18 85,10 C92,5 98,8 100,2" fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <circle cx="100" cy="2" r="2" fill={color} />
    </svg>
);

// --- Market Data Page ---
const MarketData = () => {
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [chartType, setChartType] = useState('Candle');
    const [timeFrame, setTimeFrame] = useState('5m');
    const [features, setFeatures] = useState({ supertrend: false });
    const [themeVersion, setThemeVersion] = useState(0);
    // Search States
    const [searchQuery, setSearchQuery] = useState(''); // Sidebar search
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Global search modal
    const [globalSearchQuery, setGlobalSearchQuery] = useState('');

    // Chart Settings
    const [chartSettings, setChartSettings] = useState({ showGrid: true, showWatermark: true, showLegend: true });

    // Layout State
    const [sidebarWidth, setSidebarWidth] = useState(380);
    const [detailsHeight, setDetailsHeight] = useState(400); // Height of the bottom details panel
    const sidebarRef = useRef(null);
    const detailsRef = useRef(null);
    const containerRef = useRef(null);

    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const legendRef = useRef(null);
    const seriesRef = useRef({});

    // --- Resizing Logic ---
    const startResizingSidebar = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = sidebarWidth;
        const doDrag = (moveEvent) => {
            const newWidth = startWidth - (moveEvent.clientX - startX);
            if (newWidth > 250 && newWidth < 800) setSidebarWidth(newWidth);
        };
        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.body.style.cursor = 'default';
        };
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
        document.body.style.cursor = 'col-resize';
    };

    const startResizingDetails = (e) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = detailsHeight;
        const doDrag = (moveEvent) => {
            // Dragging up increases height (since it's at the bottom)
            const newHeight = startHeight - (moveEvent.clientY - startY);
            if (newHeight > 100 && newHeight < 800) setDetailsHeight(newHeight);
        };
        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.body.style.cursor = 'default';
        };
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
        document.body.style.cursor = 'row-resize';
    };

    // --- Chart Logic ---
    useEffect(() => {
        if (!chartContainerRef.current) return;
        const theme = getThemeColors();
        const chart = createChart(chartContainerRef.current, {
            layout: { background: { type: ColorType.Solid, color: theme.bg }, textColor: theme.text },
            grid: { vertLines: { color: theme.grid, visible: chartSettings.showGrid }, horzLines: { color: theme.grid, visible: chartSettings.showGrid } },
            crosshair: { mode: CrosshairMode.Normal }, timeScale: { borderColor: theme.grid }, rightPriceScale: { borderColor: theme.grid }
        });

        let mainSeries;
        if (chartType === 'Area') mainSeries = chart.addAreaSeries({ lineColor: '#2962ff', topColor: 'rgba(41, 98, 255, 0.4)', bottomColor: 'rgba(41, 98, 255, 0)' });
        else if (chartType === 'Line') mainSeries = chart.addLineSeries({ color: '#2962ff' });
        else if (chartType === 'Bar') mainSeries = chart.addBarSeries({ upColor: theme.up, downColor: theme.down });
        else if (chartType === 'Hollow') mainSeries = chart.addCandlestickSeries({ upColor: theme.bg, downColor: theme.down, borderVisible: true, wickUpColor: theme.up, wickDownColor: theme.down, borderColor: theme.up });
        else if (chartType === 'Baseline') mainSeries = chart.addBaselineSeries({ baseValue: { type: 'price', price: 0 }, topLineColor: theme.up, bottomLineColor: theme.down });
        else if (chartType === 'Step') mainSeries = chart.addLineSeries({ color: theme.up, lineType: LineType.Step });
        else if (chartType === 'Columns') mainSeries = chart.addHistogramSeries({ color: theme.primary });
        else mainSeries = chart.addCandlestickSeries({ upColor: theme.up, downColor: theme.down, borderVisible: false, wickUpColor: theme.up, wickDownColor: theme.down });

        seriesRef.current = { main: mainSeries };
        chartRef.current = chart;

        // Legend
        chart.subscribeCrosshairMove(param => {
            if (!legendRef.current) return;
            if (!chartSettings.showLegend) { legendRef.current.innerHTML = ''; return; }

            const { main } = seriesRef.current;
            let open, high, low, close;

            if (param.time) {
                const mainData = param.seriesData.get(main);
                if (mainData) {
                    if (['Candle', 'HeikinAshi', 'Bar', 'Hollow'].includes(chartType)) { ({ open, high, low, close } = mainData); }
                    else { close = mainData.value; }
                }
            }

            let html = `<div class="flex items-center gap-4 text-[11px] font-mono">`;
            if (open !== undefined || close !== undefined) {
                const isUp = close >= open;
                const colorClass = isUp ? 'text-emerald-500' : 'text-red-500';
                if (['Candle', 'HeikinAshi', 'Bar', 'Hollow'].includes(chartType)) {
                    html += `<span>O <span class="${colorClass}">${open.toFixed(2)}</span></span>`;
                    html += `<span>H <span class="${colorClass}">${high.toFixed(2)}</span></span>`;
                    html += `<span>L <span class="${colorClass}">${low.toFixed(2)}</span></span>`;
                    html += `<span>C <span class="${colorClass}">${close.toFixed(2)}</span></span>`;
                } else {
                    html += `<span>Price <span class="text-primary">${(close || 0).toFixed(2)}</span></span>`;
                }
            }
            html += `</div>`;
            legendRef.current.innerHTML = html;
        });

        // Resize
        const handleResize = () => { if (chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight }); };
        const observer = new ResizeObserver(handleResize);
        observer.observe(chartContainerRef.current);
        return () => { observer.disconnect(); chart.remove(); };
    }, [chartType, features, themeVersion, chartSettings]); // Dependent on sidebarWidth for resizing

    // Data Update (Simulated)
    useEffect(() => {
        if (!selectedSymbol || !chartRef.current) return;
        const data = [];
        let price = parseFloat(selectedSymbol.price.replace(/,/g, ''));
        let time = Math.floor(Date.now() / 1000) - 300 * 500;
        for (let i = 0; i < 500; i++) {
            const move = (Math.random() - 0.5) * (price * 0.005);
            price += move;
            data.push({ time, open: price, high: price + Math.abs(move), low: price - Math.abs(move), close: price + move / 2, value: price });
            time += 300;
        }
        const series = seriesRef.current.main;
        if (['Candle', 'Bar', 'Hollow', 'HeikinAshi'].includes(chartType)) series.setData(data);
        else if (chartType === 'Columns') series.setData(data.map(d => ({ time: d.time, value: d.close, color: d.close > d.open ? '#089981' : '#f23645' })));
        else series.setData(data.map(d => ({ time: d.time, value: d.value })));
        if (chartType === 'Baseline') series.applyOptions({ baseValue: { type: 'price', price: price } });
        chartRef.current.timeScale().fitContent();
        chartRef.current.applyOptions({ watermark: { visible: chartSettings.showWatermark, fontSize: 24, horzAlign: 'center', vertAlign: 'center', color: 'rgba(128, 128, 128, 0.1)', text: `\${selectedSymbol.symbol} • \${timeFrame} • Market` } });
    }, [selectedSymbol, chartType, chartSettings, timeFrame]);

    useEffect(() => { if (!selectedSymbol) setSelectedSymbol(MARKET_DATA.indices[0]); }, []);
    useEffect(() => {
        const obs = new MutationObserver((m) => { m.forEach((mu) => { if (mu.type === 'attributes' && mu.attributeName === 'class') { setThemeVersion(v => v + 1); } }); });
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);

    const getFilteredData = () => {
        const result = {};
        Object.entries(MARKET_DATA).forEach(([category, symbols]) => {
            const filtered = symbols.filter(m => m.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
            if (filtered.length > 0) result[category] = filtered;
        });
        return result;
    };
    const filteredData = getFilteredData();
    const allSymbols = React.useMemo(() => Object.entries(MARKET_DATA).flatMap(([cat, syms]) => syms.map(s => ({ ...s, category: cat }))), []);
    const globalSearchResults = allSymbols.filter(s => s.symbol.toLowerCase().includes(globalSearchQuery.toLowerCase()));

    const handleGlobalSymbolSelect = (symbol) => { setSelectedSymbol(symbol); setIsSearchOpen(false); setGlobalSearchQuery(''); };
    const toggleSetting = (key) => setChartSettings(s => ({ ...s, [key]: !s[key] }));

    const Dropdown = ({ label, icon: Icon, children, align = 'left' }) => {
        const [open, setOpen] = useState(false);
        return (
            <div className="relative z-50">
                <button onClick={() => setOpen(!open)} onBlur={() => setTimeout(() => setOpen(false), 200)} className={clsx("flex items-center gap-1 px-2 py-1 rounded hover:bg-muted/10 transition-colors text-[11px] text-muted-foreground hover:text-foreground", open && "text-primary bg-primary/10")}>
                    {Icon && <Icon size={14} />} <span>{label}</span> <ChevronDown size={10} className={clsx("transition-transform", open && "rotate-180")} />
                </button>
                {open && <div className={clsx("absolute top-full mt-1 w-40 bg-card border border-border rounded shadow-xl py-1 flex flex-col gap-0.5 z-[100]", align === 'right' ? "right-0" : "left-0")} onMouseDown={(e) => e.preventDefault()}>{children}</div>}
            </div>
        );
    };

    // --- Main Render (Flex Layout) ---
    return (
        <div ref={containerRef} className="h-full flex flex-col gap-4 relative overflow-hidden">
            {/* Global Search Modal */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-20" onClick={() => setIsSearchOpen(false)}>
                    <div className="w-[500px] max-w-[90vw] bg-popover border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-3 border-b border-border flex items-center gap-3">
                            <Search size={18} className="text-muted-foreground" />
                            <input autoFocus type="text" placeholder="Search symbol..." value={globalSearchQuery} onChange={(e) => setGlobalSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground" />
                            <button onClick={() => setIsSearchOpen(false)} className="text-muted-foreground hover:text-foreground"><span className="text-xs bg-muted/20 px-1.5 py-0.5 rounded">ESC</span></button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                            {globalSearchResults.map((s, idx) => (
                                <button key={`${s.category}-${s.symbol}-${idx}`} onClick={() => handleGlobalSymbolSelect(s)} className="w-full flex items-center justify-between p-2 hover:bg-muted/10 rounded transition-colors group text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">{s.symbol.substring(0, 1)}</div>
                                        <div><div className="text-sm font-bold text-foreground">{s.symbol}</div><div className="text-[10px] text-muted-foreground uppercase">{s.category}</div></div>
                                    </div>
                                    <div className="text-right"><div className="text-xs font-mono text-muted-foreground">{s.price}</div></div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 min-h-0 bg-background flex flex-row border border-border rounded-lg overflow-hidden shadow-xl">
                {/* 1. Chart Area (Flexible) */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="h-10 border-b border-border bg-card flex items-center px-4 gap-2 shrink-0">
                        <div className="flex items-center gap-2 mr-4 min-w-[120px]">
                            <span className="font-bold text-sm text-foreground">{selectedSymbol?.symbol}</span>
                            <button onClick={() => setIsSearchOpen(true)} className="p-1 hover:bg-muted/10 rounded-full transition-colors text-muted-foreground hover:text-primary" title="Search Symbol (Ctrl+K)"><Search size={14} /></button>
                            <span className="text-[10px] text-muted-foreground bg-muted/10 px-1 rounded uppercase">{selectedSymbol?.market}</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border mx-1 mobile-hide" />
                        <div className="flex bg-muted/10 rounded p-0.5">
                            {TIMEFRAMES.map(tf => <button key={tf.val} onClick={() => setTimeFrame(tf.val)} className={clsx("px-2 py-0.5 text-[10px] font-bold rounded transition-colors", timeFrame === tf.val ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{tf.label}</button>)}
                        </div>
                        <div className="h-4 w-[1px] bg-border mx-1" />
                        <Dropdown label={CHART_TYPES.find(t => t.id === chartType)?.label} icon={CHART_TYPES.find(t => t.id === chartType)?.icon}>
                            {CHART_TYPES.map(t => <button key={t.id} onClick={() => setChartType(t.id)} className={clsx("px-3 py-1.5 text-left text-[11px] hover:bg-muted/10 hover:text-primary transition-colors flex items-center gap-2", chartType === t.id && "text-primary font-bold")}><t.icon size={12} /> {t.label}</button>)}
                        </Dropdown>
                        <div className="h-4 w-[1px] bg-border mx-1" />
                        <Dropdown label="Settings" icon={Settings} align="right">
                            <button onClick={() => toggleSetting('showGrid')} className={clsx("px-3 py-1.5 text-left text-[11px] hover:bg-muted/10 hover:text-primary transition-colors flex items-center gap-2", chartSettings.showGrid && "text-primary font-bold")}><Grid size={12} /> Grid Lines</button>
                            <button onClick={() => toggleSetting('showWatermark')} className={clsx("px-3 py-1.5 text-left text-[11px] hover:bg-muted/10 hover:text-primary transition-colors flex items-center gap-2", chartSettings.showWatermark && "text-primary font-bold")}><Activity size={12} /> Watermark</button>
                            <button onClick={() => toggleSetting('showLegend')} className={clsx("px-3 py-1.5 text-left text-[11px] hover:bg-muted/10 hover:text-primary transition-colors flex items-center gap-2", chartSettings.showLegend && "text-primary font-bold")}><Monitor size={12} /> Legend</button>
                        </Dropdown>
                    </div>

                    <div className="flex-1 w-full relative bg-background">
                        <div ref={legendRef} className="absolute left-3 top-2 z-20 pointer-events-none select-none"></div>
                        <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />
                    </div>
                </div>

                {/* Resizer: Horizontal (Chart vs Sidebar) */}
                <div onMouseDown={startResizingSidebar} className="w-1 hover:w-1.5 bg-border hover:bg-primary cursor-col-resize transition-all z-30 flex items-center justify-center group shrink-0">
                    <div className="h-8 w-0.5 bg-muted-foreground/20 group-hover:bg-primary-foreground/50 rounded-full" />
                </div>

                {/* 2. Watchlist & Details (Resizable Width) */}
                <div ref={sidebarRef} style={{ width: sidebarWidth }} className="bg-card flex flex-col min-w-[250px] max-w-[50vw]">
                    {/* Watchlist Header */}
                    <div className="p-2 border-b border-border bg-muted/5 flex items-center justify-between shrink-0">
                        <span className="text-sm font-semibold pl-2 text-foreground">Watchlist</span>
                        <Search size={14} className="text-muted-foreground mr-2" />
                    </div>
                    <div className="p-2 border-b border-border shrink-0">
                        <input type="text" placeholder="Filter watchlist..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-muted/20 border-border rounded px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] px-3 py-1.5 border-b border-border bg-muted/10 text-[10px] font-bold text-muted-foreground shrink-0">
                        <div>Symbol</div><div className="text-right">Last</div><div className="text-right">Chg</div><div className="text-right">Chg%</div>
                    </div>

                    {/* Scrollable List (Top Half) - Flex 1 */}
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-card/50">
                        {Object.entries(filteredData).map(([category, symbols]) => (
                            <div key={category}>
                                <div className="px-3 py-1 bg-muted/5 border-b border-border flex items-center gap-2 sticky top-0 z-10 backdrop-blur-sm">
                                    <ChevronDown size={10} className="text-muted-foreground" />
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{category}</span>
                                </div>
                                {symbols.map(m => (
                                    <div key={m.symbol} onClick={() => setSelectedSymbol(m)} className={clsx("grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center px-3 py-2 cursor-pointer hover:bg-muted/5 border-b border-border transition-colors group", selectedSymbol?.symbol === m.symbol && "bg-primary/5 border-l-2 border-l-primary pl-[10px]")}>
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="min-w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-bold">{m.symbol[0]}</div>
                                            <span className={clsx("text-xs font-semibold truncate", selectedSymbol?.symbol === m.symbol ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>{m.symbol}</span>
                                        </div>
                                        <div className="text-xs font-medium text-right text-foreground">{m.price}</div>
                                        <div className={clsx("text-xs font-medium text-right", m.isUp ? "text-emerald-500" : "text-red-500")}>{m.change}</div>
                                        <div className={clsx("text-xs font-medium text-right", m.isUp ? "text-emerald-500" : "text-red-500")}>{m.changePercent}</div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Resizer: Vertical (List vs Details) */}
                    <div onMouseDown={startResizingDetails} className="h-1 hover:h-1.5 bg-border hover:bg-primary cursor-row-resize transition-all z-30 flex items-center justify-center group shrink-0 w-full relative">
                        <div className="w-8 h-0.5 bg-muted-foreground/20 group-hover:bg-primary-foreground/50 rounded-full" />
                    </div>

                    {/* Detail Panel (Bottom - Resizable Height) */}
                    <div ref={detailsRef} style={{ height: detailsHeight }} className="shrink-0 overflow-y-auto custom-scrollbar bg-card border-t border-border p-4 flex flex-col gap-6 min-h-[150px] max-h-[80%]">
                        {selectedSymbol ? (
                            <>
                                <div>
                                    <div className="text-xl font-bold text-foreground mb-1">{selectedSymbol.symbol}</div>
                                    <div className="text-xs text-muted-foreground">{selectedSymbol.description}</div>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-3xl font-bold text-foreground">{selectedSymbol.price}</span>
                                        <span className="text-xs font-bold text-muted-foreground">USD</span>
                                        <span className={clsx("text-sm font-bold ml-auto", selectedSymbol.isUp ? "text-emerald-500" : "text-red-500")}>{selectedSymbol.change} ({selectedSymbol.changePercent})</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-foreground mb-3">Performance</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {selectedSymbol.perf && Object.entries(selectedSymbol.perf).map(([label, val]) => (<PerformanceCard key={label} label={label} value={val} />))}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2"><h3 className="text-xs font-bold text-foreground">Technicals</h3><span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/20 text-muted-foreground">1 Day</span></div>
                                    <div className="bg-muted/5 border border-border rounded-lg p-4 py-6"><Gauge value={selectedSymbol.tech || 50} /><div className="text-center mt-2 text-sm font-bold text-blue-500">Neutral</div></div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-foreground mb-3">Seasonals</h3>
                                    <div className="p-3 bg-muted/5 border border-border rounded-lg relative h-32 flex items-end">
                                        <LineChartMock color="hsl(var(--primary))" /><div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20"><div className="w-full h-[1px] bg-foreground/20 absolute top-1/2"></div><div className="h-full w-[1px] bg-foreground/20 absolute left-1/3"></div><div className="h-full w-[1px] bg-foreground/20 absolute left-2/3"></div></div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-foreground mb-3">Profile</h3>
                                    <div className="space-y-2">
                                        {selectedSymbol.profile ? Object.entries(selectedSymbol.profile).map(([k, v]) => (<div key={k} className="flex justify-between items-center text-xs py-1 border-b border-border last:border-0"><span className="text-muted-foreground">{k}</span><span className="text-foreground font-medium">{v}</span></div>)) : <div className="text-muted-foreground text-xs">No profile data available</div>}
                                    </div>
                                </div>
                            </>
                        ) : (<div className="flex items-center justify-center h-full text-muted-foreground text-xs">Select a symbol</div>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketData;
