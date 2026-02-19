'use client';
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutPage = () => {
    const { t } = useLanguage();

    const stats = [
        { number: '1000+', label: t('about.stats.students') },
        { number: '50+', label: t('about.stats.teachers') },
        { number: '30+', label: t('about.stats.years') },
        { number: '95%', label: t('about.stats.graduation') }
    ];

    const achievements = [
        { title: t('about.achievements.academicTitle'), year: '2024', description: t('about.achievements.academicDesc') },
        { title: t('about.achievements.stemTitle'), year: '2023', description: t('about.achievements.stemDesc') },
        { title: t('about.achievements.communityTitle'), year: '2022', description: t('about.achievements.communityDesc') },
        { title: t('about.achievements.sportsTitle'), year: '2024', description: t('about.achievements.sportsDesc') }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-8 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        {t('about.pageTitle')}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                        {t('about.heroDescription')}
                    </p>
                </div>
            </div>


            {/* Stats Section */}
            <div className="py-8 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-12 h-12 sm:w-16 md:w-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-base sm:text-xl md:text-2xl font-bold text-white">{stat.number}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{stat.label}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="py-8 md:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-12 items-center">
                        <div className="space-y-8">
                            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t('about.mission')}</h2>
                                </div>
                                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                                    {t('about.missionText')}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t('about.vision')}</h2>
                                </div>
                                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                                    {t('about.visionText')}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('about.whyTitle')}</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                                    <span className="text-gray-700">{t('about.why.personalized')}</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                                    <span className="text-gray-700">{t('about.why.facilities')}</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                                    <span className="text-gray-700">{t('about.why.experienced')}</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                                    <span className="text-gray-700">{t('about.why.extracurricular')}</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                                    <span className="text-gray-700">{t('about.why.community')}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="py-8 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('about.legacy.title')}</h2>
                            <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">{t('about.legacy.subtitle')}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-12 items-center">
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{t('about.history.1995.title')}</h3>
                                    <p className="text-gray-700">{t('about.history.1995.text')}</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.history.2010.title')}</h3>
                                    <p className="text-gray-700">{t('about.history.2010.text')}</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.history.2024.title')}</h3>
                                    <p className="text-gray-700">{t('about.history.2024.text')}</p>
                                </div>
                            </div>

                            <div className="bg-gray-900 p-6 sm:p-8 rounded-lg text-white">
                                <h3 className="text-2xl font-bold mb-6">{t('about.journey.title')}</h3>
                                <p className="text-sm sm:text-base leading-relaxed mb-6">{t('about.journey.text')}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold text-white">30+</div>
                                        <div className="text-sm opacity-80">{t('about.journey.years')}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold text-white">20x</div>
                                        <div className="text-sm opacity-80">{t('about.journey.growth')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Academic Programs */}
            <div className="py-8 md:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('about.programs.title')}</h2>
                        <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">{t('about.programs.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                        <div className="bg-gray-50 p-6 sm:p-8 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3">{t('about.programs.primary.title')}</h3>
                            <p className="text-sm sm:text-base text-gray-700 mb-4">{t('about.programs.primary.desc')}</p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>{t('about.programs.primary.features.0')}</li>
                                <li>{t('about.programs.primary.features.1')}</li>
                                <li>{t('about.programs.primary.features.2')}</li>
                                <li>{t('about.programs.primary.features.3')}</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 sm:p-8 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3">{t('about.programs.middle.title')}</h3>
                            <p className="text-sm sm:text-base text-gray-700 mb-4">{t('about.programs.middle.desc')}</p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>{t('about.programs.middle.features.0')}</li>
                                <li>{t('about.programs.middle.features.1')}</li>
                                <li>{t('about.programs.middle.features.2')}</li>
                                <li>{t('about.programs.middle.features.3')}</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 sm:p-8 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3">{t('about.programs.high.title')}</h3>
                            <p className="text-sm sm:text-base text-gray-700 mb-4">{t('about.programs.high.desc')}</p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>{t('about.programs.high.features.0')}</li>
                                <li>{t('about.programs.high.features.1')}</li>
                                <li>{t('about.programs.high.features.2')}</li>
                                <li>{t('about.programs.high.features.3')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements Section */}
            <div className="py-8 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('achievements.title')}</h2>
                        <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">{t('achievements.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8">
                        {achievements.map((achievement, index) => (
                            <div key={index} className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-base sm:text-xl font-bold text-gray-900">{achievement.title}</h3>
                                    <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-semibold">{achievement.year}</span>
                                </div>
                                <p className="text-sm text-gray-700">{achievement.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Facilities */}
            <div className="py-8 md:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('facilities.title')}</h2>
                        <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">{t('facilities.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">{t('facilities.smartClassrooms')}</h3>
                            <p className="text-sm text-gray-700">{t('facilities.smartClassroomsDesc')}</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('facilities.scienceLabs')}</h3>
                            <p className="text-gray-700">{t('facilities.scienceLabsDesc')}</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('facilities.sportsComplex')}</h3>
                            <p className="text-gray-700">{t('facilities.sportsComplexDesc')}</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('facilities.digitalLibrary')}</h3>
                            <p className="text-gray-700">{t('facilities.digitalLibraryDesc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="py-8 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('about.coreValues.title')}</h2>
                        <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">{t('about.coreValues.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                        <div className="text-center bg-white p-6 sm:p-8 rounded-lg border border-gray-200">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">{t('about.coreValues.excellence.title')}</h3>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{t('about.coreValues.excellence.text')}</p>
                        </div>

                        <div className="text-center bg-white p-6 sm:p-8 rounded-lg border border-gray-200">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">{t('about.coreValues.compassion.title')}</h3>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{t('about.coreValues.compassion.text')}</p>
                        </div>

                        <div className="text-center bg-white p-6 sm:p-8 rounded-lg border border-gray-200">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">{t('about.coreValues.community.title')}</h3>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{t('about.coreValues.community.text')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="py-8 md:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('contact.title')}</h2>
                        <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">{t('about.contactSubtitle')}</p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{t('about.contact.visitTitle')}</h3>
                                </div>
                                <div className="space-y-3 text-sm sm:text-base text-gray-700">
                                    <p>{t('about.contact.addressLine1')}</p>
                                    <p>{t('about.contact.addressLine2')}</p>
                                    <p>{t('about.contact.country')}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{t('about.contact.getInTouchTitle')}</h3>
                                </div>
                                <div className="space-y-3 text-sm sm:text-base text-gray-700">
                                    <p><strong>{t('contact.phone')}:</strong> {t('footer.phone')}</p>
                                    <p><strong>{t('contact.email')}:</strong> {t('footer.email')}</p>
                                    <p><strong>{t('about.contact.admissionsLabel')}:</strong> admissions@sunlightschool.edu</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{t('about.contact.hoursTitle')}</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">{t('about.contact.weekdays')}</span>
                                        <span className="text-gray-900 font-semibold">8:00 AM - 3:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">{t('about.contact.saturday')}</span>
                                        <span className="text-gray-900 font-semibold">9:00 AM - 12:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">{t('about.contact.sunday')}</span>
                                        <span className="text-gray-500">{t('about.contact.closed')}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        <strong>{t('about.contact.admissionsOfficeLabel')}:</strong><br />
                                        {t('about.contact.admissionsOfficeHours')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;