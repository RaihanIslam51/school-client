'use client';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';


const Facilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                console.log('Fetching facilities from:', `${API_URL}/api/facilities`);
                const response = await fetch(`${API_URL}/api/facilities`, { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Facilities response:', data);
                setFacilities(data.data || []);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching facilities:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, []);

    if (loading) {
        return (
            <section className="py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
                        <p className="mt-4 text-gray-700">Loading facilities...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-600">Error loading facilities: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    // Fallback to default facilities if no data from API
    const displayFacilities = facilities.length > 0 ? facilities : [
        // {
        //     _id: '1',
        //     title: 'Smart Classrooms',
        //     description: 'Interactive digital boards and modern teaching equipment for enhanced learning experience.',
        //     icon: '💻',
        //     features: ['Digital Boards', 'Audio Systems', 'AC Rooms']
        // },
        // {
        //     _id: '2',
        //     title: 'Science Lab',
        //     description: 'Well-equipped laboratories for Physics, Chemistry, and Biology with modern instruments.',
        //     icon: '🔬',
        //     features: ['Modern Equipment', 'Safety Measures', 'Expert Guidance']
        // },
        // {
        //     _id: '3',
        //     title: 'Computer Lab',
        //     description: 'State-of-the-art computer labs with latest technology and high-speed internet.',
        //     icon: '🖥️',
        //     features: ['Latest PCs', 'High-Speed WiFi', 'Coding Tools']
        // },
        // {
        //     _id: '4',
        //     title: 'Library',
        //     description: 'Extensive collection of books, journals, and digital resources for comprehensive learning.',
        //     icon: '📚',
        //     features: ['10,000+ Books', 'Digital Library', 'Reading Rooms']
        // },
        // {
        //     _id: '5',
        //     title: 'Playground',
        //     description: 'Spacious sports facilities including basketball, football, cricket, and indoor games.',
        //     icon: '⚽',
        //     features: ['Sports Ground', 'Indoor Games', 'Fitness Area']
        // },
        {
            _id: '6',
            title: 'Transportation',
            description: 'Safe and reliable bus service covering all major routes with GPS tracking.',
            icon: '🚌',
            features: ['GPS Tracking', 'Safe Routes', 'Trained Drivers']
        }
    ];

    // Show only first 4 facilities by default, or all if showAll is true
    const visibleFacilities = showAll ? displayFacilities : displayFacilities.slice(0, 4);

    return (
        <section className="py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10 lg:mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-3">
                        Our Facilities
                    </h2>
                    <p className="text-gray-700 text-base lg:text-lg max-w-2xl mx-auto">
                        Experience excellence with our modern facilities designed to provide the best learning environment
                    </p>
                </div>

                {/* Facilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 contaimer mx-auto">
                    {visibleFacilities.map((facility, index) => (
                        <div
                            key={facility._id || facility.id}
                            className="bg-white border border-gray-200 hover:border-blue-900 hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 bg-blue-900 text-white rounded-lg flex items-center justify-center text-2xl">
                                            {facility.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {facility.title}
                                        </h3>

                                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                            {facility.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {facility.features.map((feature, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* See More Button */}
                {displayFacilities.length > 4 && (
                    <div className="text-center mt-10">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg transition-all duration-200"
                        >
                            {showAll ? 'Show Less' : 'See More Facilities'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Facilities;