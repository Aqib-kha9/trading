import React, { useState, useMemo } from 'react';
import {
    Calendar as CalendarIcon, Filter, Check,
    TrendingUp, TrendingDown, AlignLeft,
    Activity, Clock, Globe, X, Search, ChevronRight,
    ChevronLeft, ChevronDown, CalendarDays
} from 'lucide-react';
import { clsx } from 'clsx';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// --- Constants & Config ---

const IMPACT_LEVELS = [
    { id: 'high', label: 'High', color: 'bg-red-500', text: 'text-red-500' },
    { id: 'medium', label: 'Medium', color: 'bg-orange-500', text: 'text-orange-500' },
    { id: 'low', label: 'Low', color: 'bg-yellow-500', text: 'text-yellow-500' },
    { id: 'none', label: 'None', color: 'bg-slate-400', text: 'text-slate-400' },
];

const CURRENCIES = ['AUD', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'JPY', 'NZD', 'USD'];

const CURRENCY_NAMES = {
    AUD: 'Australian Dollar',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    NZD: 'New Zealand Dollar',
    USD: 'US Dollar',
};

const EVENT_TYPES = [
    'Growth', 'Inflation', 'Employment', 'Central Bank',
    'Bonds', 'Housing', 'Consumer Surveys', 'Business Surveys', 'Speeches', 'Misc'
];

// --- Mock Data with ISO Dates ---
// Mock Context: Today is 2025-12-15 (Monday)

const MOCK_EVENTS = [
    // Yesterday: Sun Dec 14
    {
        id: 101, dateIso: '2025-12-14', time: '10:00', currency: 'CNY', impact: 'low',
        event: 'FDI y/y', actual: '-1.4%', forecast: '', previous: '-0.3%',
        graphData: [-0.5, -0.8, -0.3, -1.4, -1.0, -1.2]
    },

    // Today: Mon Dec 15
    {
        id: 1, dateIso: '2025-12-15', time: '14:02', currency: 'NZD', impact: 'low',
        event: 'BusinessNZ Services Index', detail: 'Actual: 46.9',
        actual: '46.9', forecast: '', previous: '48.4',
        graphData: [48, 47, 49, 46.9, 47.5, 48]
    },
    {
        id: 2, dateIso: '2025-12-15', time: '15:20', currency: 'JPY', impact: 'low',
        event: 'Tankan Manufacturing Index', detail: 'Survey of manufacturing sentiment',
        actual: '15', forecast: '15', previous: '14',
        graphData: [12, 13, 14, 15, 14.5, 15]
    },
    {
        id: 3, dateIso: '2025-12-15', time: '15:20', currency: 'JPY', impact: 'medium',
        event: 'Tankan Non-Manufacturing Index', detail: 'Service sector sentiment',
        actual: '34', forecast: '35', previous: '34',
        graphData: [32, 33, 34, 34, 35, 34]
    },
    {
        id: 4, dateIso: '2025-12-15', time: '17:00', currency: 'CNY', impact: 'medium',
        event: 'Industrial Production y/y', detail: 'Measures change in output of factories',
        actual: '4.8%', forecast: '5.0%', previous: '4.9%',
        isHot: true,
        graphData: [4.5, 4.6, 4.9, 4.8, 5.1, 4.8]
    },
    {
        id: 5, dateIso: '2025-12-15', time: '17:00', currency: 'CNY', impact: 'high',
        event: 'Retail Sales y/y', detail: 'Primary gauge of consumer spending',
        actual: '1.3%', forecast: '3.0%', previous: '2.9%',
        impactType: 'negative',
        graphData: [2.5, 2.8, 2.9, 1.3, 3.1, 1.5]
    },
    {
        id: 8, dateIso: '2025-12-15', time: '19:30', currency: 'USD', impact: 'high',
        event: 'Core CPI m/m', detail: 'The big one - Excludes food and energy',
        actual: '', forecast: '0.3%', previous: '0.2%', pending: true,
        graphData: [0.3, 0.4, 0.2, 0.3, 0.2, 0.3]
    },

    // Tomorrow: Tue Dec 16
    {
        id: 9, dateIso: '2025-12-16', time: '00:30', currency: 'AUD', impact: 'high',
        event: 'Monetary Policy Meeting Minutes', detail: 'RBA Meeting details',
        actual: '', forecast: '', previous: '', pending: true,
        graphData: null
    },
    {
        id: 10, dateIso: '2025-12-16', time: '12:30', currency: 'GBP', impact: 'medium',
        event: 'Average Earnings Index 3m/y', detail: 'Wage inflation indicator',
        actual: '', forecast: '7.7%', previous: '7.9%', pending: true,
        graphData: null
    },

    // Next Week: Dec 23 (Mock)
    {
        id: 201, dateIso: '2025-12-23', time: '19:00', currency: 'USD', impact: 'high',
        event: 'Final GDP q/q', detail: 'Economic growth quarter over quarter',
        actual: '', forecast: '5.2%', previous: '5.2%', pending: true,
        graphData: null
    },
];

const MiniGraph = ({ data }) => {
    if (!data) return <div className="w-12 h-6 bg-white/5 rounded"></div>;
    const chartData = data.map((v, i) => ({ v, i }));
    return (
        <div className="w-16 h-8">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <Area type="monotone" dataKey="v" stroke="#2962ff" fill="#2962ff" fillOpacity={0.2} strokeWidth={1} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- Filter Components ---

const FilterCheckbox = ({ label, color, checked, onChange, isColorIcon = false }) => (
    <button
        onClick={onChange}
        className={clsx(
            "flex items-center gap-2 text-[11px] font-medium transition-colors p-2 rounded-lg hover:bg-white/5 w-full",
            checked ? "bg-primary/5 text-primary" : "text-muted-foreground"
        )}
    >
        <div className={clsx(
            "w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0",
            checked ? "bg-primary border-primary text-black" : "border-slate-700 bg-transparent"
        )}>
            {checked && <Check size={12} strokeWidth={4} />}
        </div>

        {isColorIcon && color && (
            <div className={`w-3 h-3 rounded-full shrink-0 ${color}`}></div>
        )}

        <span className="truncate">{label}</span>
    </button>
);

const FilterDialog = ({
    isOpen, onClose,
    selectedImpacts, setSelectedImpacts,
    selectedCurrencies, setSelectedCurrencies,
    selectedEventTypes, setSelectedEventTypes
}) => {
    if (!isOpen) return null;

    const toggleFilter = (set, item) => {
        set(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const toggleAll = (set, allItems) => {
        set(prev => prev.length === allItems.length ? [] : allItems);
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-[800px] h-[600px] bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative">
                {/* Close Button Absolute */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-white z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-6 border-b border-white/5 bg-white/5">
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-3">
                        <Filter size={20} className="text-primary" />
                        Configure Calendar Filters
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Select the specific data points you want to see in the calendar.</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-8 custom-scrollbar">
                    {/* Impact */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-2 mb-2">
                            <span>Impact</span>
                            <div className="flex gap-2 text-[10px] text-primary cursor-pointer">
                                <span onClick={() => toggleAll(setSelectedImpacts, IMPACT_LEVELS.map(i => i.id))}>All</span>
                                <span onClick={() => setSelectedImpacts([])} className="text-muted-foreground hover:text-white">None</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            {IMPACT_LEVELS.map(impact => (
                                <FilterCheckbox
                                    key={impact.id}
                                    label={impact.label}
                                    color={impact.color}
                                    isColorIcon={true}
                                    checked={selectedImpacts.includes(impact.id)}
                                    onChange={() => toggleFilter(setSelectedImpacts, impact.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Currencies */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-2 mb-2">
                            <span>Currencies</span>
                            <div className="flex gap-2 text-[10px] text-primary cursor-pointer">
                                <span onClick={() => toggleAll(setSelectedCurrencies, CURRENCIES)}>All</span>
                                <span onClick={() => setSelectedCurrencies([])} className="text-muted-foreground hover:text-white">None</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            {CURRENCIES.map(curr => (
                                <FilterCheckbox
                                    key={curr}
                                    label={curr}
                                    checked={selectedCurrencies.includes(curr)}
                                    onChange={() => toggleFilter(setSelectedCurrencies, curr)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Types */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-white/5 pb-2 mb-2">
                            <span>Categories</span>
                            <div className="flex gap-2 text-[10px] text-primary cursor-pointer">
                                <span onClick={() => toggleAll(setSelectedEventTypes, EVENT_TYPES)}>All</span>
                                <span onClick={() => setSelectedEventTypes([])} className="text-muted-foreground hover:text-white">None</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            {EVENT_TYPES.map(type => (
                                <FilterCheckbox
                                    key={type}
                                    label={type}
                                    checked={selectedEventTypes.includes(type)}
                                    onChange={() => toggleFilter(setSelectedEventTypes, type)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
                    <button
                        onClick={() => {
                            setSelectedImpacts(IMPACT_LEVELS.map(i => i.id));
                            setSelectedCurrencies(CURRENCIES);
                            setSelectedEventTypes(EVENT_TYPES);
                        }}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Reset Default
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-xs font-bold bg-primary text-black hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Date Navigator Component ---

const DateNavigatorDialog = ({ isOpen, onClose, selectedDateRange, onSelect }) => {
    if (!isOpen) return null;

    // Simple calendar grid generation
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const currentDay = 15; // Mock current day DEC 15

    // Quick Links Config
    const links = [
        { label: 'Today', sub: 'Dec 15', id: 'today' },
        { label: 'Tomorrow', sub: 'Dec 16', id: 'tomorrow' },
        { label: 'This Week', sub: 'Dec 15-21', id: 'thisWeek' },
        { label: 'Next Week', sub: 'Dec 22-28', id: 'nextWeek' },
        { label: 'This Month', sub: 'Dec 1-31', id: 'month' },
    ];

    // History Links
    const historyLinks = [
        { label: 'Yesterday', sub: 'Dec 14', id: 'yesterday' },
        { label: 'Last Week', sub: 'Dec 8-14', id: 'lastWeek' },
    ];

    const handleSelect = (id, label) => {
        onSelect({ id, label });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-[380px] bg-[#0f172a] border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-muted/50 p-3 flex items-center justify-between border-b border-white/5">
                    <button className="p-1 hover:bg-white/10 rounded text-muted-foreground hover:text-white"><ChevronLeft size={16} /></button>
                    <span className="font-bold text-sm text-foreground">DEC 2025</span>
                    <button className="p-1 hover:bg-white/10 rounded text-muted-foreground hover:text-white"><ChevronRight size={16} /></button>
                </div>

                {/* Calendar Grid */}
                <div className="p-2 border-b border-white/5 bg-black/20">
                    <div className="grid grid-cols-7 mb-2">
                        {days.map(d => (
                            <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 31 }).map((_, i) => {
                            const day = i + 1;
                            const isSelected = selectedDateRange.id === 'thisWeek' && day >= 15 && day <= 21;
                            const isToday = day === 15;
                            return (
                                <button
                                    key={i}
                                    className={clsx(
                                        "h-8 rounded text-xs font-medium flex items-center justify-center transition-colors",
                                        isSelected ? "bg-primary text-black font-bold" : (
                                            isToday ? "border border-primary text-primary" : "text-slate-300 hover:bg-white/10"
                                        )
                                    )}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="p-3 bg-card grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="space-y-1">
                        {links.map(link => (
                            <button
                                key={link.id}
                                onClick={() => handleSelect(link.id, link.label + (link.sub ? ` (${link.sub})` : ''))}
                                className={clsx(
                                    "w-full text-left px-2 py-1.5 rounded text-[11px] group transition-colors flex justify-between items-center",
                                    selectedDateRange.id === link.id ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                <span>{link.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="space-y-1 pt-4 border-t border-white/5 mt-auto">
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-1">History</div>
                        {historyLinks.map(link => (
                            <button
                                key={link.id}
                                onClick={() => handleSelect(link.id, link.label + ` (${link.sub})`)}
                                className={clsx(
                                    "w-full text-left px-2 py-1.5 rounded text-[11px] group transition-colors flex justify-between items-center",
                                    selectedDateRange.id === link.id ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-3 border-t border-white/5 bg-muted/30 flex justify-end">
                    <button onClick={onClose} className="text-xs text-primary font-bold hover:underline">Close</button>
                </div>
            </div>
        </div>
    )
}

// --- Main Page Component ---

const CalendarPage = () => {
    // Filter States
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter Selections
    const [selectedImpacts, setSelectedImpacts] = useState(['high', 'medium', 'low', 'none']);
    const [selectedCurrencies, setSelectedCurrencies] = useState(CURRENCIES);
    const [selectedEventTypes, setSelectedEventTypes] = useState(EVENT_TYPES);

    // Date State (Mock)
    // id: 'thisWeek', label: 'Dec 15 - Dec 21'
    const [selectedDateRange, setSelectedDateRange] = useState({ id: 'thisWeek', label: 'This Week (Dec 15-21)' });

    // Helper to format date header
    const formatDate = (dateIso) => {
        const d = new Date(dateIso);
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    // Data Filtering Logic
    const filteredEvents = useMemo(() => {
        return MOCK_EVENTS.filter(e => {
            // 1. Text Search
            const matchesSearch = searchTerm === '' ||
                e.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.currency.toLowerCase().includes(searchTerm.toLowerCase());

            // 2. Filters
            const matchesImpact = selectedImpacts.includes(e.impact);
            const matchesCurrency = selectedCurrencies.includes(e.currency);

            // 3. Date Filter (Mock Logic)
            let matchesDate = false;
            const d = e.dateIso;
            switch (selectedDateRange.id) {
                case 'today': matchesDate = (d === '2025-12-15'); break;
                case 'tomorrow': matchesDate = (d === '2025-12-16'); break;
                case 'yesterday': matchesDate = (d === '2025-12-14'); break;
                case 'thisWeek': matchesDate = (d >= '2025-12-15' && d <= '2025-12-21'); break;
                case 'nextWeek': matchesDate = (d >= '2025-12-22' && d <= '2025-12-28'); break;
                case 'lastWeek': matchesDate = (d >= '2025-12-08' && d <= '2025-12-14'); break;
                case 'month': matchesDate = d.startsWith('2025-12'); break;
                default: matchesDate = true;
            }

            return matchesSearch && matchesImpact && matchesCurrency && matchesDate;
        }).sort((a, b) => a.dateIso.localeCompare(b.dateIso) || a.time.localeCompare(b.time)); // Sort by Date then Time
    }, [searchTerm, selectedImpacts, selectedCurrencies, selectedDateRange]);

    // Grouping by Date for headers
    const groupedEvents = useMemo(() => {
        const groups = {};
        filteredEvents.forEach(event => {
            if (!groups[event.dateIso]) groups[event.dateIso] = [];
            groups[event.dateIso].push(event);
        });
        return groups;
    }, [filteredEvents]);

    return (
        <div className="h-full flex flex-col gap-2 relative">

            {/* --- Standardized Toolbar --- */}
            <div className="flex items-center justify-between shrink-0 bg-card border border-white/5 p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                        <CalendarIcon size={16} className="text-primary" />
                        Economic Calendar
                    </h2>

                    <div className="h-6 w-[1px] bg-white/10"></div>

                    <button
                        onClick={() => setIsDateOpen(true)}
                        className="flex items-center gap-2 text-xs font-bold text-foreground bg-white/5 px-3 py-1.5 rounded-md border border-white/10 hover:border-primary/50 transition-colors"
                    >
                        <CalendarDays size={14} className="text-primary" />
                        <span className="uppercase">{selectedDateRange.label}</span>
                        <ChevronDown size={12} className="text-muted-foreground" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mr-2 font-mono bg-black/20 px-2 py-1 rounded">
                        <Clock size={10} /> GMT+05:30
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="h-8 px-3 rounded-lg border border-white/10 flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-white hover:border-primary/50 transition-colors bg-secondary/30 uppercase tracking-wide"
                    >
                        <Filter size={12} />
                        Filter Data
                        {(selectedImpacts.length < IMPACT_LEVELS.length || selectedCurrencies.length < CURRENCIES.length) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse ml-1" />
                        )}
                    </button>

                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-2 text-muted-foreground" size={12} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="SEARCH EVENT..."
                            className="bg-secondary/30 border border-white/5 h-8 pl-9 pr-3 w-56 text-[11px] font-mono rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>
            </div>

            {/* --- Main Table Area --- */}
            <div className="flex-1 min-h-0 bg-card border border-border rounded-lg shadow-xl overflow-hidden flex flex-col relative w-full">
                <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10" />

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 bg-muted/50 p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border sticky top-0 z-20 backdrop-blur-md">
                    <div className="col-span-2 md:col-span-1 pl-2">Time</div>
                    <div className="col-span-1 text-center">Curr</div>
                    <div className="col-span-1 text-center">Imp</div>
                    <div className="col-span-4 md:col-span-5">Event</div>
                    <div className="col-span-1 text-right">Actual</div>
                    <div className="col-span-1 text-right">Forecast</div>
                    <div className="col-span-1 text-right">Previous</div>
                    <div className="col-span-1 text-center">Graph</div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">

                    {Object.keys(groupedEvents).map(dateIso => (
                        <div key={dateIso}>
                            {/* Sticky Date Header */}
                            <div className="bg-muted/20 px-4 py-2 text-xs font-bold text-primary border-y border-white/5 sticky top-0 backdrop-blur-sm z-10 w-full flex items-center gap-2">
                                <ChevronRight size={12} /> {formatDate(dateIso)}
                            </div>

                            {groupedEvents[dateIso].map((event) => (
                                <div key={event.id} className="grid grid-cols-12 gap-2 p-3 text-[11px] items-center border-b border-white/5 hover:bg-white/5 transition-colors group">

                                    {/* Time */}
                                    <div className="col-span-2 md:col-span-1 pl-2 font-mono text-slate-300 border-l-2 border-transparent group-hover:border-primary pl-2 transition-all">
                                        {event.time}
                                    </div>

                                    {/* Currency */}
                                    <div
                                        className="col-span-1 text-center font-bold text-slate-200 cursor-help"
                                        title={CURRENCY_NAMES[event.currency] || event.currency}
                                    >
                                        {event.currency}
                                    </div>

                                    {/* Impact Icon */}
                                    <div
                                        className="col-span-1 flex justify-center cursor-help"
                                        title={(IMPACT_LEVELS.find(i => i.id === event.impact) || {}).label + " Impact"}
                                    >
                                        <div className={clsx(
                                            "w-4 h-4 rounded shadow-sm border border-black/20",
                                            (IMPACT_LEVELS.find(i => i.id === event.impact) || {}).color
                                        )}></div>
                                    </div>

                                    {/* Event Name */}
                                    <div
                                        className="col-span-4 md:col-span-5 font-medium text-slate-300 truncate pr-2 cursor-help"
                                        title={event.detail || event.event}
                                    >
                                        {event.event}
                                    </div>

                                    {/* Actual */}
                                    <div
                                        className={clsx(
                                            "col-span-1 text-right font-mono font-bold cursor-help",
                                            event.pending ? "text-slate-600" : (
                                                event.impactType === 'positive' ? "text-emerald-500" :
                                                    event.impactType === 'negative' ? "text-red-500" : "text-slate-200"
                                            )
                                        )}
                                        title="Actual Value"
                                    >
                                        {event.actual || '-'}
                                    </div>

                                    {/* Forecast */}
                                    <div className="col-span-1 text-right font-mono text-slate-500 cursor-help" title="Forecast">
                                        {event.forecast || '-'}
                                    </div>

                                    {/* Previous */}
                                    <div className="col-span-1 text-right font-mono text-slate-500 cursor-help" title="Previous">
                                        {event.previous || '-'}
                                    </div>

                                    {/* Graph */}
                                    <div className="col-span-1 flex justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                                        <MiniGraph data={event.graphData} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {filteredEvents.length === 0 && (
                        <div className="p-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <Filter size={20} className="opacity-50" />
                            </div>
                            <span className="text-xs font-medium">No events match your current filters.</span>
                            <button
                                onClick={() => {
                                    setSelectedDateRange({ id: 'thisWeek', label: 'This Week (Dec 15-21)' });
                                    setSelectedImpacts(IMPACT_LEVELS.map(i => i.id));
                                    setSelectedCurrencies(CURRENCIES);
                                }}
                                className="text-[10px] text-primary hover:underline"
                            >
                                Reset filters and date
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter Dialog */}
            <FilterDialog
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                selectedImpacts={selectedImpacts}
                setSelectedImpacts={setSelectedImpacts}
                selectedCurrencies={selectedCurrencies}
                setSelectedCurrencies={setSelectedCurrencies}
                selectedEventTypes={selectedEventTypes}
                setSelectedEventTypes={setSelectedEventTypes}
            />

            {/* Date Navigator Dialog */}
            <DateNavigatorDialog
                isOpen={isDateOpen}
                onClose={() => setIsDateOpen(false)}
                selectedDateRange={selectedDateRange}
                onSelect={setSelectedDateRange}
            />

        </div>
    );
};

export default CalendarPage;
