'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '../../config/api';
import { useLanguage } from '../../src/contexts/LanguageContext';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [showAll, setShowAll] = useState(false);

    const { t, language } = useLanguage();

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                console.log('Fetching achievements from:', `${API_URL}/api/achievements`);
                const response = await fetch(`${API_URL}/api/achievements`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Achievements response:', data);
                setAchievements(data.data || []);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching achievements:', err);
                console.error('API_URL:', API_URL);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    // Get unique categories
    const categories = ['all', ...new Set(achievements.map(item => item.category))];

    // Filter achievements by category
    const filteredAchievements = activeCategory === 'all'
        ? achievements
        : achievements.filter(item => item.category === activeCategory);

    // Helpers
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const locale = language === 'en' ? 'en-US' : 'bn-BD';
        return dateString ? new Date(dateString).toLocaleDateString(locale, options) : '';
    };

    const getCategoryLabel = (category) => {
        const key = `achievements.categories.${category}`;
        const label = t(key);
        return label === key ? category : label;
    };

    // Category icons
    const categoryConfig = {
        'Academic': { icon: '🎓' },
        'Sports': { icon: '⚽' },
        'Cultural': { icon: '🎭' },
        'Science': { icon: '🔬' },
        'Arts': { icon: '🎨' },
        'Technology': { icon: '💻' }
    };

    // Fallback data if API fails
    const fallbackAchievements = [
        {
            _id: '6',
            title: t('achievements.fallbacks.mathOlympiad.title'),
            description: t('achievements.fallbacks.mathOlympiad.description'),
            date: '2024-08-25',
            category: 'Academic',
            achievements: t('achievements.fallbacks.mathOlympiad.achievements') || ['Perfect Score', 'Gold Medal', 'Special Recognition'],
            isActive: true
        }
    ];

    const displayAchievements = achievements.length > 0 ? filteredAchievements : fallbackAchievements.filter(item =>
        activeCategory === 'all' || item.category === activeCategory
    );

    // Show only 8 achievements initially (2 rows of 4), or all if showAll is true
    const visibleAchievements = showAll ? displayAchievements : displayAchievements.slice(0, 8);
    const hasMoreAchievements = displayAchievements.length > 8;

    if (loading) {
        return (
            <section className="py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 lg:mb-12">
                        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-80 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                                <div className="w-16 h-4 bg-gray-200 rounded mb-3"></div>
                                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10 lg:mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-3">
                        {t('achievements.ourAchievements')}
                    </h2>
                    <p className="text-gray-700 text-base lg:text-lg max-w-3xl mx-auto">
                        {t('achievements.subtitle')}
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 rounded-lg p-1">
                        <div className="flex gap-1 flex-wrap justify-center">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                                        activeCategory === category
                                            ? 'bg-blue-900 text-white shadow-sm'
                                            : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                >
                                    {category !== 'all' && (
                                        <span>{categoryConfig[category]?.icon || '🏆'}</span>
                                    )}
                                    <span>{category === 'all' ? t('achievements.filters.all') : getCategoryLabel(category)}</span>
                                </button>
                            ))} 
                        </div>
                    </div>
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {visibleAchievements.map((achievement, index) => {
                        const config = categoryConfig[achievement.category] || { icon: '🏆' };
                        return (
                            <div
                                key={achievement._id || index}
                                className="bg-white border border-gray-200 hover:border-blue-900 hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden"
                            >
                                <div className="p-6">
                                    {/* Category Badge */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 bg-blue-900 text-white rounded-lg flex items-center justify-center text-sm">
                                            {config.icon}
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 uppercase">
                                            {getCategoryLabel(achievement.category)}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                                        {achievement.title}
                                    </h3>

                                    {/* Date */}
                                    <div className="text-xs text-gray-500 mb-3 font-medium">
                                        {formatDate(achievement.date)}
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                                        {achievement.description}
                                    </p>

                                    {/* Sub-achievements */}
                                    {achievement.achievements && achievement.achievements.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">{t('achievements.highlights')}</h4>
                                            <ul className="space-y-1">
                                                {achievement.achievements.slice(0, 2).map((item, idx) => (
                                                    <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                                                        <div className="w-1 h-1 bg-blue-900 rounded-full shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {achievement.achievements.length > 2 && (
                                                <p className="text-xs text-gray-500 font-medium">
                                                    +{achievement.achievements.length - 2} {t('achievements.more')}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Show More/Less Button */}
                <div className="text-center mt-10">
                    {hasMoreAchievements && !showAll && (
                        <button
                            onClick={() => setShowAll(true)}
                            className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg transition-all duration-200"
                        >
                            {t('achievements.buttons.seeMore')}
                        </button>
                    )}
                    {showAll && (
                        <button
                            onClick={() => setShowAll(false)}
                            className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg transition-all duration-200"
                        >
                            {t('achievements.buttons.seeLess')}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Achievements;