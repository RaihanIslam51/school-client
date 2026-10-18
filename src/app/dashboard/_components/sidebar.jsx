'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { X, LogOut, ChevronDown } from 'lucide-react';
import { menuItems, otherItems } from './navItems';

function NavGroup({ item, pathname, onClose }) {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isAnySubActive =
        hasSubItems && item.subItems.some((s) => pathname === s.path);
    const isActive = item.path ? pathname === item.path : isAnySubActive;

    const [isOpen, setIsOpen] = useState(isAnySubActive);

    useEffect(() => {
        if (isAnySubActive) setIsOpen(true);
    }, [isAnySubActive]);

    /* ── Flat link (e.g. Dashboard) ── */
    if (!hasSubItems) {
        return (
            <Link
                href={item.path}
                onClick={onClose}
                className={`group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                        ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`}
            >
                {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                )}
                <span
                    className={`flex-shrink-0 transition-colors duration-200 ${
                        isActive
                            ? 'text-indigo-500'
                            : 'text-slate-400 group-hover:text-indigo-500'
                    }`}
                >
                    {item.icon}
                </span>
                <span
                    className={`text-[13px] leading-none flex-1 ${
                        isActive ? 'font-semibold text-indigo-600' : 'font-medium'
                    }`}
                >
                    {item.name}
                </span>
                {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 animate-pulse" />
                )}
            </Link>
        );
    }

    /* ── Collapsible group ── */
    return (
        <div className="flex flex-col">
            <button
                onClick={() => setIsOpen((p) => !p)}
                className={`group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isAnySubActive
                        ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`}
            >
                {isAnySubActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                )}
                <span
                    className={`flex-shrink-0 transition-colors duration-200 ${
                        isAnySubActive
                            ? 'text-indigo-500'
                            : 'text-slate-400 group-hover:text-indigo-500'
                    }`}
                >
                    {item.icon}
                </span>
                <span
                    className={`flex-1 text-left text-[13px] leading-none ${
                        isAnySubActive ? 'font-semibold text-indigo-600' : 'font-medium'
                    }`}
                >
                    {item.name}
                </span>
                <ChevronDown
                    size={14}
                    strokeWidth={2.5}
                    className={`flex-shrink-0 transition-all duration-300 ${
                        isAnySubActive
                            ? 'text-indigo-500'
                            : 'text-slate-300 group-hover:text-indigo-400'
                    } ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>

            {/* Animated submenu */}
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: isOpen ? `${item.subItems.length * 40 + 12}px` : '0px',
                    opacity: isOpen ? 1 : 0,
                }}
            >
                <div className="ml-4 mt-1 pl-3 border-l-2 border-indigo-100 flex flex-col gap-0.5 pb-1.5">
                    {item.subItems.map((sub) => {
                        const subActive = pathname === sub.path;
                        return (
                            <Link
                                key={sub.name}
                                href={sub.path}
                                onClick={onClose}
                                className={`group flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg transition-all duration-150 ${
                                    subActive
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-500'
                                }`}
                            >
                                <span
                                    className={`flex-shrink-0 transition-colors duration-150 ${
                                        subActive
                                            ? 'text-indigo-500'
                                            : 'text-slate-300 group-hover:text-indigo-400'
                                    }`}
                                >
                                    {sub.icon}
                                </span>
                                <span
                                    className={`text-[12px] leading-none flex-1 ${
                                        subActive
                                            ? 'font-semibold text-indigo-600'
                                            : 'font-medium'
                                    }`}
                                >
                                    {sub.name}
                                </span>
                                {subActive && (
                                    <span className="w-1 h-1 rounded-full bg-indigo-500 flex-shrink-0" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function SectionLabel({ label }) {
    return (
        <div className="flex items-center gap-2 px-3 mt-4 mb-1.5">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[9.5px] font-bold text-slate-300 uppercase tracking-[0.12em]">
                {label}
            </span>
            <div className="h-px flex-1 bg-slate-100" />
        </div>
    );
}


export default function Sidebar({ isOpen, setIsOpen, onClose }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleClose = () => {
        if (onClose) onClose();
        if (setIsOpen) setIsOpen(false);
    };

    return (
        <>
            {/* ── Sidebar Panel ── */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-[260px]
                    flex flex-col
                    bg-white
                    border-r border-slate-100
                    transform transition-transform duration-300 ease-out
                    lg:translate-x-0 lg:static lg:inset-auto
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    will-change-transform
                `}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg shadow-indigo-200" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-black text-base tracking-tight">S</span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-slate-800 font-bold text-[14.5px] leading-tight tracking-tight">
                                Admin Panel
                            </h2>
                            <p className="text-indigo-500 text-[10.5px] font-medium mt-0.5 tracking-wide">
                                Sunlight School
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        aria-label="Close Sidebar"
                        className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors duration-150 p-1 rounded-lg hover:bg-slate-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ── Navigation ── */}
                <nav
                    className="flex-1 overflow-y-auto px-2.5 py-3 flex flex-col"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Main menu */}
                    <div className="flex flex-col gap-0.5">
                        {menuItems.map((item) => (
                            <NavGroup
                                key={item.name}
                                item={item}
                                pathname={pathname}
                                onClose={handleClose}
                            />
                        ))}
                    </div>

                    {/* Other section */}
                    <SectionLabel label="Other" />
                    <div className="flex flex-col gap-0.5">
                        {otherItems.map((item) => (
                            <NavGroup
                                key={item.name}
                                item={item}
                                pathname={pathname}
                                onClose={handleClose}
                            />
                        ))}
                    </div>

                    <div className="flex-1" />

                    {/* ── Logout ── */}
                    <div className="pt-3 mt-3 border-t border-slate-100">
                        <button
                            onClick={() => {
                                localStorage.removeItem('user');
                                router.push('/');
                            }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-slate-400 hover:bg-red-50 hover:text-red-500 group"
                        >
                            <LogOut
                                size={17}
                                strokeWidth={2}
                                className="flex-shrink-0 transition-colors duration-150 group-hover:text-red-500"
                            />
                            <span className="text-[13px] font-medium leading-none">Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>

            {/* ── Mobile Overlay ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm will-change-opacity transition-opacity duration-300 lg:hidden"
                    onClick={handleClose}
                />
            )}
        </>
    );
}
