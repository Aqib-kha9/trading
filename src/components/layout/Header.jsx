import React from 'react';
import { Search, Bell, LogOut, Menu, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme-provider';
import TickerMarquee from './TickerMarquee';

const Header = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { theme, setTheme } = useTheme();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="h-8 bg-card border-b border-border flex items-center justify-between px-2 sticky top-0 z-50">

            {/* Left: Branding & Search */}
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} className="md:hidden text-muted-foreground hover:text-foreground">
                    <Menu size={14} />
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-tr from-primary to-emerald-600 rounded-md flex items-center justify-center font-bold text-black text-[10px] shadow-[0_0_10px_rgba(16,185,129,0.3)]">M</div>
                    <span className="font-sans text-xs font-bold tracking-tight hidden md:block text-white/90">MASTER<span className="text-primary">STROKE</span></span>
                    <span className="text-[9px] text-muted-foreground px-1.5 py-0.5 border border-white/10 bg-white/5 rounded-md hidden md:block">PRO_v2.4.0</span>
                </div>

                <div className="h-4 w-[1px] bg-white/10 mx-2 hidden md:block"></div>

                {/* Quick Ticker Inline - Floating */}
                <div className="hidden md:flex items-center overflow-hidden w-[400px] mask-linear-fade relative h-full">
                    <TickerMarquee />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Unified Search Bar */}
                <div className="relative group hidden md:block">
                    <Search className="absolute left-2.5 top-2 text-muted-foreground" size={12} />
                    <input
                        type="text"
                        placeholder="Search (CMD+K)"
                        className="bg-secondary/30 border border-white/5 h-6 pl-8 pr-3 w-48 text-[11px] font-medium rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                    />
                </div>

                <div className="h-4 w-[1px] bg-white/10 mx-1"></div>

                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-white/5 rounded-lg transition-all"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                </button>

                <button className="relative p-2 text-muted-foreground hover:text-primary hover:bg-white/5 rounded-lg transition-all">
                    <Bell size={14} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#050505]"></span>
                </button>

                <div className="flex items-center gap-2 pl-1 pr-3 py-1 border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 cursor-pointer transition-all rounded-full">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-primary to-amber-700 flex items-center justify-center text-black font-bold text-[10px] shadow-sm">
                        {user?.name?.[0] || 'A'}
                    </div>
                    <div className="flex flex-col leading-none hidden md:block">
                        <span className="text-[10px] font-bold text-white/90 truncate max-w-[80px]">{user?.name || 'Admin'}</span>
                        <span className="text-[8px] text-muted-foreground uppercase tracking-wide">SysAdmin</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut size={12} />
                </button>
            </div>
        </div>
    );
};

export default Header;
