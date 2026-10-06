'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const PhotoGallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Initial gallery photos
    const photos = [
        {
            id: 1,
            title: 'International Mother Language Day Celebration',
            src: '/photo_gallery1.png',
            category: 'Events',
        },
        {
            id: 2,
            title: 'School Campus & Activities',
            src: '/school1.png',
            category: 'Campus',
        },
    ];

    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="Photo gallery"
                    fill
                    priority
                    className="object-cover opacity-60 filter brightness-90"
                />
                <div className="absolute inset-0 bg-black/40" />

                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 px-4 container mx-auto text-center"
                >
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
                        Photo gallery
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - Photo gallery
                    </p>
                </motion.div>
            </div>

            {/* ─── MAIN GALLERY CONTENT ─── */}
            <div className="py-10 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="flex flex-col items-center">
                    
                    {/* Main Featured Photo Display */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-4xl bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <div className="relative w-full h-[280px] sm:h-[420px] md:h-[500px] bg-black/5 flex items-center justify-center">
                            <Image
                                src="/photo_gallery1.png"
                                alt="Photo Gallery"
                                fill
                                className="object-contain p-2 sm:p-4"
                                priority
                            />
                        </div>
                        <div className="p-4 sm:p-6 bg-white border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                    International Mother Language Day Celebration
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 font-medium">
                                    School Event &amp; Cultural Moments
                                </p>
                            </div>
                            <span className="inline-block px-3.5 py-1.5 bg-[#FF5500]/10 text-[#FF5500] text-xs font-bold rounded-full w-fit">
                                Featured Photo
                            </span>
                        </div>
                    </motion.div>

                    {/* Gallery Grid Showcase */}
                    <div className="w-full mt-12">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 border-l-4 border-[#FF5500] pl-3">
                            Gallery Collection
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {photos.map((photo, index) => (
                                <motion.div
                                    key={photo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    onClick={() => setSelectedImage(photo)}
                                    className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                                >
                                    <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                                        <Image
                                            src={photo.src}
                                            alt={photo.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <span className="bg-white/90 text-gray-900 text-xs font-semibold px-4 py-2 rounded-full shadow-md">
                                                View Photo
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-1 group-hover:text-[#FF5500] transition-colors">
                                            {photo.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {photo.category}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" 
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors text-lg"
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                            <div className="relative w-full h-[55vh] sm:h-[70vh] bg-black">
                                <Image
                                    src={selectedImage.src}
                                    alt={selectedImage.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="p-4 sm:p-6 bg-white">
                                <h3 className="text-lg font-bold text-gray-800">{selectedImage.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">{selectedImage.category}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default PhotoGallery;
