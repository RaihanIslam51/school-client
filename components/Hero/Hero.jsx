'use client';
import React, { useState, useEffect, useRef, Fragment, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '../../config/api';
import { useLanguage } from '../../src/contexts/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();

// Simple fallback data
const defaultBanners = [{
    images: ['/school1.jpg'],
    headline: t('hero.welcomeTitle'),
    subheadline: t('hero.welcomeSubtitle'),
    stats: [
        { number: '25+', label: t('hero.welcomeTitle') },
        { number: '2000+', label: t('dashboard.students') },
        { number: '98%', label: 'Success Rate' }
    ]
}];
    const [currentSlide, setCurrentSlide] = useState(0);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const intervalRef = useRef(null);
    const sectionRef = useRef(null);

    // Intersection Observer for performance
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Fetch banner data
    useEffect(() => {
        const fetchBanner = async () => {
            try {
                console.log('Fetching banners from:', `${API_URL}/api/banners`);
                const response = await fetch(`${API_URL}/api/banners`);
                const data = await response.json();
                console.log('Banners response:', data);
                if (data.success && data.data.length > 0) {
                    setBanners(data.data);
                    setIsLoaded(true);
                } else {
                    setIsLoaded(true);
                }
            } catch (error) {
                console.error('Error fetching banner:', error);
                setIsLoaded(true);
            } finally {
                setLoading(false);
                setTimeout(() => setIsVisible(true), 100);
            }
        };
        fetchBanner();
    }, []);

    const activeBanners = banners.length > 0 ? banners : defaultBanners;
    const slides = useMemo(() => {
        const allSlides = activeBanners.flatMap(banner => {
            // Filter out banners with empty images array
            if (!banner.images || banner.images.length === 0) {
                return [];
            }
            return banner.images.map(image => ({ image, banner }));
        });
        // If no slides generated, use default
        return allSlides.length > 0 ? allSlides : [{ image: '/school1.jpg', banner: defaultBanners[0] }];
    }, [activeBanners]);

    // Simple auto-slide
    useEffect(() => {
        if (!isLoaded || !isAutoPlaying || slides.length <= 1) return;

        const slideDuration = 6000; // 6 seconds
        const progressStep = 100 / (slideDuration / 100);

        intervalRef.current = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + progressStep;
                if (newProgress >= 100) {
                    setCurrentSlide(prev => (prev + 1) % slides.length);
                    return 0;
                }
                return newProgress;
            });
        }, 100);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLoaded, isAutoPlaying, slides.length]);

    // Navigation functions
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setProgress(0);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setProgress(0);
    }, [slides.length]);

    const goToSlide = useCallback((index) => {
        setCurrentSlide(index);
        setProgress(0);
    }, []);

    // Touch gesture handling
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    // Simple loading skeleton
    if (loading) {
        return (
            <section className="relative bg-white min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4 sm:space-y-8 w-full max-w-4xl">
                    {/* Skeleton Headline */}
                    <div className="space-y-2 sm:space-y-4">
                        <div className="h-12 sm:h-16 lg:h-20 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-3xl"></div>
                        <div className="h-6 sm:h-8 lg:h-12 bg-gray-200 rounded animate-pulse mx-auto max-w-2xl"></div>
                    </div>

                    {/* Skeleton Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-lg p-4 sm:p-6 animate-pulse">
                                <div className="h-6 sm:h-8 bg-gray-200 rounded mb-2 mx-auto w-16"></div>
                                <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                            </div>
                        ))}
                    </div>

                    {/* Skeleton Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-8">
                        <div className="h-10 sm:h-12 bg-gray-200 rounded-lg animate-pulse w-36 sm:w-40"></div>
                        <div className="h-10 sm:h-12 bg-gray-100 rounded-lg animate-pulse w-28 sm:w-32"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-[50vh] md:min-h-[80vh] lg:h-150 flex items-center justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="banner"
            aria-label="Hero section"
        >
            {/* Clean Background Image */}
            <div className="absolute inset-0 w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.banner.alt || 'School banner'}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority={index === 0}
                            sizes="100vw"
                            unoptimized={slide.image.includes('i.ibb.co')}
                        />
                        {/* Simple overlay */}
                        <div className="absolute inset-0 bg-black/40 z-10"></div>
                    </div>
                ))}
            </div>

            {/* Simple Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12  hover:bg-white text-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                        aria-label="Previous slide"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12  hover:bg-white text-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                        aria-label="Next slide"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Simple Progress Indicator */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="w-24 sm:w-32 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Clean Content Section */}
            <div className="relative z-10 text-center container mx-auto w-full ">
                <div className="space-y-4 sm:space-y-6 lg:space-y-12">
                    {/* Simple Headline */}
                    <div className={`transition-all duration-1000 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`} style={{ transitionDelay: '0.2s' }}>
                        <h1 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-2 sm:mb-4 px-2">
                            {slides[currentSlide]?.banner.headline.split('Sunlight School').map((part, index) => (
                                index === 0 ? (
                                    <span key={index}>{part}</span>
                                ) : (
                                    <Fragment key={index}>
                                        <span className="text-blue-900">Sunlight School</span>
                                        {part}
                                    </Fragment>
                                )
                            ))}
                        </h1>
                    </div>

                    {/* Simple Sub-headline */}
                    <div className={`transition-all duration-1000 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`} style={{ transitionDelay: '0.4s' }}>
                        <p className="text-lg sm:text-xl lg:text-2xl text-white font-medium leading-relaxed max-w-3xl mx-auto px-4">
                            {slides[currentSlide]?.banner.subheadline}
                        </p>
                    </div>

                    {/* Clean Stats Grid */}
                    <div className={`hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-8 max-w-4xl mx-auto transition-all duration-1000 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                    }`} style={{ transitionDelay: '0.6s' }}>
                        {(slides[currentSlide]?.banner.stats || []).map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                                style={{ transitionDelay: `${0.8 + index * 0.1}s` }}
                            >
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-1 sm:mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 font-medium uppercase tracking-wide">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Simple Call to Action */}
                    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-8 transition-all duration-1000 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`} style={{ transitionDelay: '1s' }}>
                        {/* <Link
                            href="/about"
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base"
                        >
                            Discover Excellence
                        </Link> */}
                        {/* <Link
                            href="/contact"
                            className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base"
                        >
                            Get In Touch
                        </Link> */}
                    </div>
                </div>
            </div>

            {/* Simple Slide Indicators */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 sm:bottom-16 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                    {slides.map((slide, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Hero;