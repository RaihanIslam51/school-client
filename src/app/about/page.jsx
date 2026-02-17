import React from 'react';

const AboutPage = () => {
    const stats = [
        { number: '1000+', label: 'Students' },
        { number: '50+', label: 'Expert Teachers' },
        { number: '30+', label: 'Years of Excellence' },
        { number: '95%', label: 'Graduation Rate' }
    ];

    const achievements = [
        { title: 'Academic Excellence Award', year: '2024', description: 'Recognized for outstanding academic performance' },
        { title: 'STEM Innovation Prize', year: '2023', description: 'Winner of regional STEM competition' },
        { title: 'Community Service Award', year: '2022', description: 'Excellence in community engagement' },
        { title: 'Sports Championship', year: '2024', description: 'State champions in basketball and soccer' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-8 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        About Sunlight School
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                        Illuminating minds and shaping futures since 1995. Where excellence meets innovation,
                        and every student discovers their limitless potential.
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
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Our Mission</h2>
                                </div>
                                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                                    To provide exceptional education that empowers students to become confident,
                                    compassionate, and capable individuals who contribute positively to society.
                                    We strive to create a nurturing environment where every student can discover
                                    their potential and achieve academic excellence through innovative teaching
                                    and personalized learning experiences.
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
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Our Vision</h2>
                                </div>
                                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                                    To be a leading educational institution recognized for academic excellence,
                                    innovative teaching methods, and holistic development of students. We envision
                                    a future where our graduates become leaders, innovators, and responsible citizens
                                    who make meaningful contributions to their communities and the world.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Sunlight School?</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Personalized learning approach</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                                    <span className="text-gray-700">State-of-the-art facilities</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Experienced faculty</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Comprehensive extracurricular programs</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Strong community partnerships</span>
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
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Legacy of Excellence</h2>
                            <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
                                Three decades of commitment to educational excellence and student success
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-12 items-center">
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">1995: Humble Beginnings</h3>
                                    <p className="text-gray-700">
                                        Founded with a vision to provide quality education to 50 local students,
                                        starting in a modest building with dedicated educators.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">2010: Expansion & Growth</h3>
                                    <p className="text-gray-700">
                                        Expanded to serve over 500 students with new facilities, advanced curriculum,
                                        and modern teaching methodologies.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">2024: Excellence Today</h3>
                                    <p className="text-gray-700">
                                        A comprehensive educational center serving 1,000+ students with cutting-edge
                                        technology and innovative programs.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-900 p-6 sm:p-8 rounded-lg text-white">
                                <h3 className="text-2xl font-bold mb-6">Our Journey</h3>
                                <p className="text-sm sm:text-base leading-relaxed mb-6">
                                    Over the past three decades, Sunlight School has evolved from a small community
                                    school into a beacon of educational excellence. We've maintained our commitment
                                    to quality while embracing modern teaching methodologies and technological advancements.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold text-white">30+</div>
                                        <div className="text-sm opacity-80">Years of Service</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold text-white">20x</div>
                                        <div className="text-sm opacity-80">Student Growth</div>
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
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comprehensive Academic Programs</h2>
                        <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
                            From foundation to advanced learning, we offer complete educational pathways
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                        <div className="bg-gray-50 p-6 sm:p-8 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3">Primary Education</h3>
                            <p className="text-sm sm:text-base text-gray-700 mb-4">
                                Comprehensive foundation program for grades K-5, focusing on core subjects
                                and fundamental skills development through play-based learning.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Interactive learning methods</li>
                                <li>• Arts and creativity programs</li>
                                <li>• Physical education</li>
                                <li>• Basic STEM introduction</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 sm:p-8 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3">Middle School</h3>
                            <p className="text-sm sm:text-base text-gray-700 mb-4">
                                Advanced curriculum for grades 6-8, preparing students for high school
                                with specialized subjects and extracurricular activities.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Advanced mathematics & science</li>
                                <li>• Foreign language programs</li>
                                <li>• Leadership development</li>
                                <li>• Competitive sports teams</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 sm:p-8 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3">High School</h3>
                            <p className="text-sm sm:text-base text-gray-700 mb-4">
                                College preparatory program for grades 9-12, offering advanced placement
                                courses and comprehensive career guidance.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• AP & honors courses</li>
                                <li>• College counseling</li>
                                <li>• Research opportunities</li>
                                <li>• Internship programs</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements Section */}
            <div className="py-8 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Recognition & Achievements</h2>
                        <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Celebrating our commitment to excellence and innovation in education
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8">
                        {achievements.map((achievement, index) => (
                            <div key={index} className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-base sm:text-xl font-bold text-gray-900">{achievement.title}</h3>
                                    <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {achievement.year}
                                    </span>
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
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">State-of-the-Art Facilities</h2>
                        <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Modern infrastructure designed to enhance learning and development
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">Smart Classrooms</h3>
                            <p className="text-sm text-gray-700">Interactive whiteboards, digital projectors, and modern furniture for optimal learning</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Science Labs</h3>
                            <p className="text-gray-700">Fully equipped physics, chemistry, and biology labs with latest technology</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Sports Complex</h3>
                            <p className="text-gray-700">Basketball court, gymnasium, swimming pool, and outdoor athletic fields</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Library</h3>
                            <p className="text-gray-700">Extensive collection with digital resources, e-books, and research databases</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="py-8 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
                            The principles that guide everything we do at Sunlight School
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                        <div className="text-center bg-white p-6 sm:p-8 rounded-lg border border-gray-200">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">Excellence</h3>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                We strive for the highest standards in education, fostering a culture of
                                continuous improvement and achievement in everything we do.
                            </p>
                        </div>

                        <div className="text-center bg-white p-6 sm:p-8 rounded-lg border border-gray-200">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">Compassion</h3>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                We create a caring and supportive environment where every student feels
                                valued, respected, and empowered to reach their full potential.
                            </p>
                        </div>

                        <div className="text-center bg-white p-6 sm:p-8 rounded-lg border border-gray-200">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">Community</h3>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                We build strong partnerships with parents, staff, and the community to
                                support student success and foster lifelong learning.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="py-8 md:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Connect With Us</h2>
                        <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Ready to join our community of excellence? Get in touch today.
                        </p>
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
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Visit Our Campus</h3>
                                </div>
                                <div className="space-y-3 text-sm sm:text-base text-gray-700">
                                    <p>123 Education Street</p>
                                    <p>Knowledge City, KC 12345</p>
                                    <p>United States</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Get in Touch</h3>
                                </div>
                                <div className="space-y-3 text-sm sm:text-base text-gray-700">
                                    <p><strong>Phone:</strong> (555) 123-4567</p>
                                    <p><strong>Email:</strong> info@sunlightschool.edu</p>
                                    <p><strong>Admissions:</strong> admissions@sunlightschool.edu</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">School Hours</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Monday - Friday</span>
                                        <span className="text-gray-900 font-semibold">8:00 AM - 3:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Saturday</span>
                                        <span className="text-gray-900 font-semibold">9:00 AM - 12:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Sunday</span>
                                        <span className="text-gray-500">Closed</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        <strong>Admissions Office:</strong><br />
                                        Monday - Friday: 9:00 AM - 5:00 PM
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