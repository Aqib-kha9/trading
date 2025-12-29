import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

const SearchableSelect = ({
    options = [],
    value,
    onChange,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    className = "",
    buttonClassName = "",
    dropdownClassName = "",
    disabled = false,
    searchable = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter options based on search
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between gap-2 px-2 py-1.5 text-[10px] 
                    bg-secondary/30 border border-white/10 rounded 
                    hover:border-primary/50 transition-colors
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${isOpen ? 'border-primary ring-1 ring-primary/20' : ''}
                    ${buttonClassName}
                `}
            >
                <span className={`truncate ${selectedOption ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className={`
                    absolute z-50 mt-1 w-full bg-[#0f172a] border border-white/10 rounded overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top
                    ${dropdownClassName}
                `}>
                    {/* Search Input */}
                    {searchable && (
                        <div className="p-2 border-b border-white/5 bg-black/20 sticky top-0">
                            <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    className="w-full bg-secondary/50 border border-white/5 rounded pl-8 pr-8 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-2 top-2 text-muted-foreground hover:text-white"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className={`
                                        w-full text-left px-3 py-2 text-xs rounded flex items-center justify-between
                                        hover:bg-primary/10 hover:text-primary transition-colors
                                        ${value === option.value ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground'}
                                    `}
                                >
                                    <span>{option.label}</span>
                                    {value === option.value && <Check size={14} />}
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                                No results found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
