'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '../../config/api';

const Gallery = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [showAll, setShowAll] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);


    useEffect(() => {
        const fetchGalleries = async () => {
            try {
                console.log('Fetching galleries from:', `${API_URL}/api/gallery`);
                const response = await fetch(`${API_URL}/api/gallery`, { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Galleries response:', data);
                setGalleries(data.data || []);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching galleries:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleries();
    }, []);

    // Get unique categories
    const categories = ['all', ...new Set(galleries.map(item => item.category))];

    // Filter galleries by category
    const filteredGalleries = activeCategory === 'all'
        ? galleries
        : galleries.filter(item => item.category === activeCategory);

    // Category icons
    const categoryConfig = {
        'Events': { icon: '🎉' },
        'Sports': { icon: '⚽' },
        'Cultural': { icon: '🎭' },
        'Academic': { icon: '🎓' },
        'Infrastructure': { icon: '🏗️' },
        'Technology': { icon: '💻' },
        'Arts': { icon: '🎨' },
        'Science': { icon: '🔬' }
    };

    // Fallback data if API fails
    const fallbackGalleries = [
        // {
        //     _id: '1',
        //     title: 'Annual Sports Day 2025',
        //     description: 'Celebrating excellence in sports with various competitions and team events showcasing student athletic achievements.',
        //     category: 'Sports',
        //     images: [
        //         'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
        //         'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400',
        //         'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
        //     ],
        //     eventDate: '2025-02-15',
        //     isActive: true,
        //     featured: true
        // },
        // {
        //     _id: '2',
        //     title: 'Cultural Festival 2025',
        //     description: 'A vibrant celebration of diverse cultures with traditional dances, music performances, and artistic exhibitions.',
        //     category: 'Cultural',
        //     images: [
        //         'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
        //         'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        //         'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400'
        //     ],
        //     eventDate: '2025-01-20',
        //     isActive: true,
        //     featured: false
        // },
        // {
        //     _id: '3',
        //     title: 'Science Exhibition 2025',
        //     description: 'Innovative science projects and experiments demonstrating student creativity and scientific understanding.',
        //     category: 'Science',
        //     images: [
        //         'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
        //         'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        //         'https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?w=400'
        //     ],
        //     eventDate: '2025-01-10',
        //     isActive: true,
        //     featured: true
        // },
        // {
        //     _id: '4',
        //     title: 'New Campus Infrastructure',
        //     description: 'Modern facilities including state-of-the-art laboratories, sports complex, and learning spaces.',
        //     category: 'Infrastructure',
        //     images: [
        //         'https://images.unsplash.com/photo-1562774053-701939374585?w=400',
        //         'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400',
        //         'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400'
        //     ],
        //     eventDate: '2024-12-01',
        //     isActive: true,
        //     featured: false
        // },
        // {
        //     _id: '5',
        //     title: 'Art & Craft Exhibition',
        //     description: 'Showcasing student artwork, crafts, and creative expressions from various art forms and mediums.',
        //     category: 'Arts',
        //     images: [
        //         'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
        //         'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
        //         'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'
        //     ],
        //     eventDate: '2024-11-25',
        //     isActive: true,
        //     featured: false
        // },
        {
            _id: '6',
            title: 'Technology Innovation Day',
            description: 'Presenting cutting-edge technology projects, coding competitions, and digital innovation showcases.',
            category: 'Technology',
            images: [
                'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400',
                'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
                'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400'
            ],
            eventDate: '2024-11-15',
            isActive: true,
            featured: true
        }
    ];

    const displayGalleries = galleries.length > 0 ? filteredGalleries : fallbackGalleries.filter(item =>
        activeCategory === 'all' || item.category === activeCategory
    );

    // Show only 6 galleries initially (2 rows of 3), or all if showAll is true
    const visibleGalleries = showAll ? displayGalleries : displayGalleries.slice(0, 6);
    const hasMoreGalleries = displayGalleries.length > 6;

    // Lightbox functions
    const openLightbox = (gallery, imageIndex) => {
        setSelectedImage(gallery);
        setLightboxIndex(imageIndex);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        setLightboxIndex(0);
    };

    const nextImage = () => {
        if (selectedImage && selectedImage.images) {
            setLightboxIndex((prev) => (prev + 1) % selectedImage.images.length);
        }
    };

    const prevImage = () => {
        if (selectedImage && selectedImage.images) {
            setLightboxIndex((prev) => (prev - 1 + selectedImage.images.length) % selectedImage.images.length);
        }
    };

    if (loading) {
        return (
            <section className="py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 lg:mb-12">
                        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-80 mx-auto"></div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-10 bg-gray-200 rounded-full px-6 animate-pulse"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                                <div className="aspect-4/3 bg-gray-200"></div>
                                <div className="p-6">
                                    <div className="flex justify-between mb-4">
                                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-6 lg:py-8 bg-white">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10 lg:mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-3">
                        Our Gallery
                    </h2>
                    <p className="text-gray-700 text-base lg:text-lg max-w-3xl mx-auto">
                        Explore our vibrant collection of school events, achievements, and memorable moments that define our community
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
                                        <span>{categoryConfig[category]?.icon || '📁'}</span>
                                    )}
                                    <span>{category === 'all' ? 'All' : category}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {visibleGalleries.map((gallery, index) => {
                        const config = categoryConfig[gallery.category] || { icon: '📁' };
                        const mainImage = gallery.images && gallery.images.length > 0 ? gallery.images[0] : 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400';
                        return (
                            <div
                                key={gallery._id || index}
                                className="bg-white border border-gray-200 hover:border-blue-900 hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                                    <img
                                        src={mainImage}
                                        alt={gallery.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                        loading="lazy"
                                    />

                                    {/* Status Badges */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {gallery.featured && (
                                            <div className="bg-blue-900 text-white px-2 py-1 rounded text-xs font-medium">
                                                Featured
                                            </div>
                                        )}
                                    </div>

                                    {/* Image Counter */}
                                    {gallery.images && gallery.images.length > 1 && (
                                        <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                                            {gallery.images.length} photos
                                        </div>
                                    )}

                                    {/* View Gallery Button */}
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                                        <button
                                            onClick={() => openLightbox(gallery, 0)}
                                            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all duration-200"
                                        >
                                            View Gallery
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Category & Date */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-blue-900 text-white rounded flex items-center justify-center text-sm">
                                                {config.icon}
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 uppercase">
                                                {gallery.category}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">
                                            {new Date(gallery.eventDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                                        {gallery.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {gallery.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Show More/Less Button */}
                <div className="text-center">
                    {hasMoreGalleries && !showAll && (
                        <button
                            onClick={() => setShowAll(true)}
                            className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg transition-all duration-200"
                        >
                            See More Galleries
                        </button>
                    )}
                    {showAll && (
                        <button
                            onClick={() => setShowAll(false)}
                            className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg transition-all duration-200"
                        >
                            See Less
                        </button>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-xl">
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-20 w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Navigation */}
                        {selectedImage.images && selectedImage.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Main Image */}
                        <div className="relative aspect-16/10 bg-gray-100">
                            <img
                                src={selectedImage.images[lightboxIndex]}
                                alt={`${selectedImage.title} - Image ${lightboxIndex + 1}`}
                                className="w-full h-full object-contain"
                            />

                            {/* Image Counter */}
                            {selectedImage.images && selectedImage.images.length > 1 && (
                                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                                    {lightboxIndex + 1} of {selectedImage.images.length}
                                </div>
                            )}
                        </div>

                        {/* Content Panel */}
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedImage.title}</h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">{selectedImage.description}</p>
                                </div>
                                <div className="md:text-right">
                                    <div className="flex items-center gap-2 mb-2 justify-end">
                                        <div className="w-6 h-6 bg-blue-900 text-white rounded flex items-center justify-center text-sm">
                                            {categoryConfig[selectedImage.category]?.icon}
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">{selectedImage.category}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">
                                        {new Date(selectedImage.eventDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnail Strip */}
                            {selectedImage.images && selectedImage.images.length > 1 && (
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {selectedImage.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setLightboxIndex(index)}
                                                className={`shrink-0 relative w-16 h-16 rounded overflow-hidden border-2 transition-all duration-200 ${
                                                    index === lightboxIndex
                                                        ? 'border-blue-900 scale-110'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;