import React, { useState, useMemo, useEffect } from 'react';
import {
    Calendar as CalendarIcon, Filter, Check,
    TrendingUp, TrendingDown, AlignLeft,
    Activity, Clock, Globe, X, Search, ChevronRight,
    ChevronLeft, ChevronDown, CalendarDays, ExternalLink, FileText, BarChart
} from 'lucide-react';
import { clsx } from 'clsx';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { fetchCalendarEvents } from '../../api/economic.api';

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

// Mock Data removed - using real API data

// --- Detail Panel Component ---

const CalendarDetailPanel = ({ event }) => {
    if (!event.specs && !event.history) return null;

    return (
        <div className="bg-muted/30 border-t border-b border-border p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Specs */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-1 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Specs</span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <span className="opacity-70">© Fair Economy</span>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        {event.specs?.source && (
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="font-bold text-muted-foreground">Source</span>
                                <a href={event.specs.source.url} className="text-primary hover:underline flex items-center gap-1">
                                    {event.specs.source.name} <ExternalLink size={10} />
                                </a>
                            </div>
                        )}
                        {event.specs?.measures && (
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="font-bold text-muted-foreground">Measures</span>
                                <span className="text-foreground/90">{event.specs.measures}</span>
                            </div>
                        )}
                        {event.specs?.effect && (
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="font-bold text-muted-foreground">Usual Effect</span>
                                <span className="text-foreground/90 italic">{event.specs.effect}</span>
                            </div>
                        )}
                        {event.specs?.frequency && (
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="font-bold text-muted-foreground">Frequency</span>
                                <span className="text-foreground/90">{event.specs.frequency}</span>
                            </div>
                        )}
                        {event.specs?.nextRelease && (
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="font-bold text-muted-foreground">Next Release</span>
                                <a href="#" className="text-primary hover:underline">{event.specs.nextRelease}</a>
                            </div>
                        )}
                        {event.specs?.whyCare && (
                            <div className="grid grid-cols-[100px_1fr] gap-2 mt-2 pt-2 border-t border-border">
                                <span className="font-bold text-muted-foreground">Why Traders Care</span>
                                <span className="text-foreground/90 leading-relaxed">{event.specs.whyCare}</span>
                            </div>
                        )}
                        {event.specs?.acronym && (
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="font-bold text-muted-foreground">Acro Expand</span>
                                <span className="text-foreground/90">{event.specs.acronym}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                            <FileText size={12} /> View full details for {event.currency} {event.event}
                        </button>
                    </div>
                </div>

                {/* Right: History & Stories */}
                <div className="space-y-6">
                    {/* History Table */}
                    <div>
                        <div className="flex items-center justify-between border-b border-border pb-1 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">History</span>
                            <div className="grid grid-cols-3 gap-8 text-[10px] font-bold text-muted-foreground mr-2">
                                <span className="text-right">Actual</span>
                                <span className="text-right">Forecast</span>
                                <span className="text-right">Previous</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            {event.history?.length > 0 ? event.history.map((h, i) => (
                                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-dashed border-border last:border-0 hover:bg-white/5 transition-colors rounded px-1">
                                    <span className="text-primary font-medium hover:underline cursor-pointer">{h.date}</span>
                                    <div className="grid grid-cols-3 gap-8 font-mono text-right mr-1">
                                        <span className="font-bold text-foreground">{h.actual}</span>
                                        <span className="text-muted-foreground">{h.forecast || '-'}</span>
                                        <span className="text-muted-foreground">{h.previous}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-4 text-xs text-muted-foreground italic">No history available</div>
                            )}
                            <div className="flex justify-between items-center mt-2 text-[10px]">
                                <button className="text-muted-foreground hover:text-primary flex items-center gap-1"><ChevronDown size={10} /> More</button>
                                <button className="text-muted-foreground hover:text-primary flex items-center gap-1">Graph <BarChart size={10} /></button>
                            </div>
                        </div>
                    </div>

                    {/* Stories */}
                    {event.stories?.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between border-b border-border pb-1 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Related Stories</span>
                            </div>
                            <div className="space-y-3">
                                {event.stories.map((story, i) => (
                                    <div key={i} className="flex gap-3 bg-muted/20 p-2 rounded border border-border">
                                        <div className="shrink-0 pt-0.5">
                                            <FileText size={16} className="text-muted-foreground" />
                                        </div>
                                        <div>
                                            <a href="#" className="text-xs font-bold text-primary hover:underline block mb-1">{story.title}</a>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
                                                <span className="bg-yellow-500/10 text-yellow-500 px-1 rounded">News</span>
                                                <span>From {story.source}</span>
                                                <span>•</span>
                                                <span>{story.time}</span>
                                            </div>
                                            <p className="text-[11px] text-foreground/80 leading-snug line-clamp-2">{story.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

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

    // Expanded Row State
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Data
    useEffect(() => {
        fetchEvents();
    }, [selectedDateRange]);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            // Calculate date range based on selectedDateRange.id
            const today = new Date();
            let from = new Date();
            let to = new Date();

            switch (selectedDateRange.id) {
                case 'today':
                    break; // from/to are today
                case 'tomorrow':
                    from.setDate(today.getDate() + 1);
                    to.setDate(today.getDate() + 1);
                    break;
                case 'thisWeek':
                    // Mock logic for week boundaries (Monday start)
                    const day = today.getDay();
                    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
                    from.setDate(diff);
                    to.setDate(diff + 6);
                    break;
                default:
                    // Default to this week
                    const d = today.getDay();
                    const df = today.getDate() - d + (d === 0 ? -6 : 1);
                    from.setDate(df);
                    to.setDate(df + 6);
                    break;
            }

            const fromStr = from.toISOString().split('T')[0];
            const toStr = to.toISOString().split('T')[0];

            const response = await fetchCalendarEvents({ from: fromStr, to: toStr });

            // Augment data with UI-specific mock details if missing
            const augmentedData = response.data.map(evt => ({
                ...evt,
                id: evt._id, // Ensure ID is present for key and expansion logic
                // Ensure date is ISO string for frontend logic
                dateIso: evt.date,
                // Generate mock history/specs if missing (for UI demo)
                specs: evt.specs || {
                    source: { name: 'Financial Source', url: '#' },
                    measures: `Measures the ${evt.event} impact on ${evt.currency} economy.`,
                    frequency: 'Released periodically',
                    whyCare: 'Significant indicator of economic health and currency valuation.'
                },
                history: evt.history || [
                    { date: 'Previous', actual: evt.previous || '-', forecast: '-', previous: '-' }
                ]
            }));

            setEvents(augmentedData);
        } catch (error) {
            console.error("Failed to fetch calendar events", error);
            // toast.error("Failed to load calendar data");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to format date header
    const formatDate = (dateIso) => {
        const d = new Date(dateIso);
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    // Data Filtering Logic
    const filteredEvents = useMemo(() => {
        return events.filter(e => {
            // 1. Text Search
            const matchesSearch = searchTerm === '' ||
                e.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (e.country && e.country.toLowerCase().includes(searchTerm.toLowerCase()));

            // 2. Filters
            // Map backend impact/country to filters if needed.
            // Backend impact: High, Medium, Low, None. Frontend IDs: high, medium, low, none.
            const impactLower = e.impact ? e.impact.toLowerCase() : 'none';
            const matchesImpact = selectedImpacts.includes(impactLower);

            const currency = e.currency || e.country || 'USD'; // Fallback
            const matchesCurrency = selectedCurrencies.includes(currency);

            return matchesSearch && matchesImpact && matchesCurrency;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [searchTerm, selectedImpacts, selectedCurrencies, events]);

    // Grouping by Date for headers
    const groupedEvents = useMemo(() => {
        const groups = {};
        filteredEvents.forEach(event => {
            // Backend date is full ISO string. Extract YYYY-MM-DD for grouping key.
            const dateKey = new Date(event.date).toISOString().split('T')[0];
            if (!groups[dateKey]) groups[dateKey] = [];

            // Augment event with display time
            const d = new Date(event.date);
            const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

            groups[dateKey].push({ ...event, time: timeStr, dateIso: dateKey });
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
                                <div key={event.id} className="flex flex-col border-b border-white/5">
                                    <div
                                        onClick={() => toggleExpand(event.id)}
                                        className={clsx(
                                            "grid grid-cols-12 gap-2 p-3 text-[11px] items-center transition-colors cursor-pointer select-none",
                                            expandedId === event.id ? "bg-white/5" : "hover:bg-white/5"
                                        )}
                                    >

                                        {/* Time */}
                                        <div className="col-span-2 md:col-span-1 pl-2 font-mono text-slate-300 border-l-2 border-transparent group-hover:border-primary pl-2 transition-all flex items-center gap-2">
                                            {event.time}
                                            {expandedId === event.id && <ChevronDown size={10} className="text-primary" />}
                                        </div>

                                        {/* Currency */}
                                        <div
                                            className="col-span-1 text-center font-bold text-slate-200"
                                            title={CURRENCY_NAMES[event.currency] || event.currency}
                                        >
                                            {event.currency}
                                        </div>

                                        {/* Impact Icon */}
                                        <div
                                            className="col-span-1 flex justify-center"
                                            title={(IMPACT_LEVELS.find(i => i.id === event.impact) || {}).label + " Impact"}
                                        >
                                            <div className={clsx(
                                                "w-4 h-4 rounded shadow-sm border border-black/20",
                                                (IMPACT_LEVELS.find(i => i.id === event.impact) || {}).color
                                            )}></div>
                                        </div>

                                        {/* Event Name */}
                                        <div
                                            className="col-span-4 md:col-span-5 font-medium text-slate-300 truncate pr-2"
                                            title={event.detail || event.event}
                                        >
                                            {event.event}
                                        </div>

                                        {/* Actual */}
                                        <div
                                            className={clsx(
                                                "col-span-1 text-right font-mono font-bold",
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
                                        <div className="col-span-1 text-right font-mono text-slate-500" title="Forecast">
                                            {event.forecast || '-'}
                                        </div>

                                        {/* Previous */}
                                        <div className="col-span-1 text-right font-mono text-slate-500" title="Previous">
                                            {event.previous || '-'}
                                        </div>

                                        {/* Graph */}
                                        <div className="col-span-1 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
                                            <MiniGraph data={event.graphData} />
                                        </div>
                                    </div>

                                    {/* EXPANDED DETAIL VIEW */}
                                    {expandedId === event.id && (
                                        <CalendarDetailPanel event={event} />
                                    )}
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
