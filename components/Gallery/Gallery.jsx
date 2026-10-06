'use client';
import React, { useState, useEffect } from 'react';
import { useGallery } from '../../src/hooks/useApi';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Maximize2, 
    ChevronLeft, 
    ChevronRight, 
    X, 
    Image as ImageIcon, 
    Calendar, 
    Sparkles, 
    Clock, 
    ZoomIn,
    RefreshCw
} from 'lucide-react';

const fallbackGalleries = [
    {
        _id: 'fb1',
        title: 'Vibrant Campus Life',
        description: 'Students enjoying the lush green open spaces, modern courtyards, and collaborative study circles.',
        category: 'Campus Life',
        images: [
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
            'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
            'https://images.unsplash.com/photo-1562774053-701939374585?w=800'
        ],
        eventDate: '2025-05-20',
        featured: true,
        isActive: true
    },
    {
        _id: 'fb2',
        title: 'Interactive Smart Classrooms',
        description: 'Hands-on collaborative learning sessions using digital interactive boards and tablet-based modules.',
        category: 'Classroom Activities',
        images: [
            'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
            'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
        ],
        eventDate: '2025-04-18',
        featured: false,
        isActive: true
    },
    {
        _id: 'fb3',
        title: 'Annual Athletic Championship',
        description: 'Showcasing student speed, strength, and sportsmanship during the inter-school relay and track events.',
        category: 'Sports Events',
        images: [
            'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
            'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800',
            'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'
        ],
        eventDate: '2025-02-15',
        featured: false,
        isActive: true
    },
    {
        _id: 'fb4',
        title: 'Spring Festival of Arts',
        description: 'A colorful presentation of theatrical acts, traditional dance forms, and global music performances by students.',
        category: 'Cultural Programs',
        images: [
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
        ],
        eventDate: '2025-03-10',
        featured: false,
        isActive: true
    },
    {
        _id: 'fb5',
        title: 'Annual Science & Tech Fair',
        description: 'Exhibiting working smart city models, green energy generators, and student-designed coding software.',
        category: 'Science Fair',
        images: [
            'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
            'https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?w=800'
        ],
        eventDate: '2025-01-20',
        featured: true,
        isActive: true
    },
    {
        _id: 'fb6',
        title: 'Graduation Class of 2025',
        description: 'Celebrating the milestones and future pathways of our graduating seniors as they transition to top universities.',
        category: 'Graduation Ceremony',
        images: [
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
            'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800',
            'https://images.unsplash.com/photo-1589161782253-62580798be12?w=800'
        ],
        eventDate: '2025-05-30',
        featured: false,
        isActive: true
    }
];

const Gallery = () => {
    const { data: galleriesData, isLoading: loading, error: fetchError, refetch } = useGallery();
    const galleries = galleriesData?.data || [];
    const error = fetchError?.message || null;

    const [activeCategory, setActiveCategory] = useState('all');
    const [showAll, setShowAll] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const { t, language } = useLanguage();

    const formatDate = (dateString, opts = { month: 'short', day: 'numeric', year: 'numeric' }) => {
        if (!dateString) return '';
        const locale = language === 'en' ? 'en-US' : 'bn-BD';
        try {
            return new Date(dateString).toLocaleDateString(locale, opts);
        } catch (e) {
            return dateString;
        }
    };

    const getCategoryLabel = (category) => {
        const key = `gallery.categories.${category}`;
        const label = t(key);
        if (label && label !== key) return label;
        return category.replace(/([A-Z])/g, ' $1').trim();
    };

    const displayGalleries = galleries.length > 0 
        ? galleries.filter(item => item.isActive !== false) 
        : fallbackGalleries;

    const categories = ['all', ...new Set(displayGalleries.map(item => item.category))];

    const filteredGalleries = activeCategory === 'all'
        ? displayGalleries
        : displayGalleries.filter(item => item.category === activeCategory);

    const visibleGridGalleries = showAll ? filteredGalleries : filteredGalleries.slice(0, 6);
    const hasMoreGalleries = filteredGalleries.length > 6;

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

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedImage) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

    if (loading) {
        return (
            <section className="py-16 sm:py-24 bg-[#F4F5F8]">
                <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-12 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded-full w-32 mx-auto mb-3" />
                        <div className="h-10 bg-gray-200 rounded-xl w-64 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-sm border border-gray-200 h-72 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 sm:py-24 bg-[#F4F5F8] font-sans text-[#0B0F28] relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* ─── SECTION HEADER ─── */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <p className="text-xs sm:text-sm font-extrabold text-[#FF5500] tracking-widest uppercase mb-2">
                        {t('gallery.ourGallery') || 'OUR GALLERY'}
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B0F28] tracking-tight">
                        {t('gallery.title') || 'School Gallery'}
                    </h2>
                </div>

                {/* ─── CATEGORY FILTER TABS ─── */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white border border-gray-200 p-1 flex flex-wrap gap-2 justify-center shadow-sm">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setActiveCategory(category);
                                    setShowAll(false);
                                }}
                                className={`px-5 py-2 font-extrabold text-xs uppercase tracking-wider transition-all duration-200 ${
                                    activeCategory === category
                                        ? 'bg-[#FF5500] text-white shadow-sm'
                                        : 'text-[#0B0F28] hover:bg-gray-100'
                                }`}
                            >
                                {category === 'all' ? (language === 'bn' ? 'সব ছবি' : 'All Photos') : getCategoryLabel(category)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── GALLERY CARDS GRID ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {visibleGridGalleries.map((gallery, idx) => {
                        const mainImage = gallery.images && gallery.images.length > 0 ? gallery.images[0] : 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400';
                        
                        return (
                            <motion.div
                                key={gallery._id || idx}
                                whileHover={{ y: -6 }}
                                className="bg-white border border-gray-200/80 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[#FF5500] group"
                            >
                                <div>
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer" onClick={() => openLightbox(gallery, 0)}>
                                        <img 
                                            src={mainImage} 
                                            alt={gallery.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-[#FF5500] text-white rounded-full flex items-center justify-center shadow-lg">
                                                <ZoomIn size={22} />
                                            </div>
                                        </div>

                                        {/* Image Count Badge */}
                                        {gallery.images && gallery.images.length > 1 && (
                                            <span className="absolute top-3 right-3 bg-black/70 text-white px-2.5 py-1 text-[10px] font-bold flex items-center gap-1">
                                                <ImageIcon size={12} />
                                                <span>{gallery.images.length}</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Text Info */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-extrabold text-[#FF5500] uppercase tracking-wider">
                                                {getCategoryLabel(gallery.category)}
                                            </span>
                                            <span className="text-[11px] text-gray-400 flex items-center gap-1 font-semibold">
                                                <Calendar size={12} />
                                                {formatDate(gallery.eventDate)}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-[#0B0F28] mb-2 leading-snug group-hover:text-[#FF5500] transition-colors duration-200">
                                            {gallery.title}
                                        </h3>

                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                            {gallery.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom Link */}
                                <div className="px-6 pb-6 pt-0">
                                    <button 
                                        onClick={() => openLightbox(gallery, 0)}
                                        className="text-xs font-extrabold text-[#FF5500] uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
                                    >
                                        <span>{t('gallery.viewGallery') || 'VIEW GALLERY'}</span>
                                        <span>›</span>
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ─── VIEW MORE BUTTON ─── */}
                {hasMoreGalleries && (
                    <div className="text-center mt-12">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="px-8 py-3.5 bg-[#FF5500] hover:bg-[#e04b00] text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-md transition-all duration-200 cursor-pointer"
                        >
                            {showAll ? 'VIEW LESS' : 'VIEW MORE'}
                        </button>
                    </div>
                )}

            </div>

            {/* ─── LIGHTBOX MODAL ─── */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-4xl w-full bg-[#0B0F28] text-white overflow-hidden shadow-2xl border border-gray-800"
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeLightbox}
                                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 hover:bg-[#FF5500] text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>

                            {/* Slideshow Arrows */}
                            {selectedImage.images && selectedImage.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 hover:bg-[#FF5500] text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                        <ChevronLeft size={22} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 hover:bg-[#FF5500] text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                        <ChevronRight size={22} />
                                    </button>
                                </>
                            )}

                            {/* Image View */}
                            <div className="relative aspect-[16/10] bg-black flex items-center justify-center">
                                <img
                                    src={selectedImage.images[lightboxIndex]}
                                    alt={`${selectedImage.title} - ${lightboxIndex + 1}`}
                                    className="w-full h-full object-contain max-h-[60vh]"
                                />
                                {selectedImage.images && selectedImage.images.length > 1 && (
                                    <span className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 text-xs font-bold rounded">
                                        {lightboxIndex + 1} / {selectedImage.images.length}
                                    </span>
                                )}
                            </div>

                            {/* Content Details */}
                            <div className="p-6 bg-[#0B0F28] border-t border-gray-800">
                                <h3 className="text-xl font-bold text-white mb-2">{selectedImage.title}</h3>
                                <p className="text-xs text-gray-300 leading-relaxed mb-4">{selectedImage.description}</p>
                                
                                {/* Thumbnails */}
                                {selectedImage.images && selectedImage.images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pt-2">
                                        {selectedImage.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setLightboxIndex(idx)}
                                                className={`relative w-14 h-14 shrink-0 border-2 transition-all cursor-pointer ${
                                                    idx === lightboxIndex ? 'border-[#FF5500] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;