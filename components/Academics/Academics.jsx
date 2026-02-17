'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '../../config/api';

const Academics = () => {
    const [academics, setAcademics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeMedium, setActiveMedium] = useState('english');
    const [activeTab, setActiveTab] = useState('classes');

    useEffect(() => {
        const fetchAcademics = async () => {
            try {
                setLoading(true);
                console.log('Fetching academics from:', `${API_URL}/api/academics`);
                const response = await fetch(`${API_URL}/api/academics`, { cache: 'no-store' });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Academics response:', data);
                console.log('Academics data array:', data.data);
                
                setAcademics(data.data || []);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching academics:', err);
                console.error('API_URL:', API_URL);
            } finally {
                setLoading(false);
            }
        };

        fetchAcademics();
    }, []);

    // Organize data by type
    const classes = academics.filter(item => item.type === 'class') || [];
    const subjects = academics.filter(item => item.type === 'subject' && item.medium === activeMedium) || [];
    const activities = academics.filter(item => item.type === 'activity') || [];

    // Fallback data if no API data
    const fallbackClasses = [
        // {
        //     _id: '1',
        //     title: 'Pre-Primary',
        //     description: 'Building foundation through play-based learning and creative exploration',
        //     level: 'Pre-Primary',
        //     grades: ['Play', 'Nursery', 'KG'],
        //     icon: '🎨',
        //     ageGroup: 'Ages 2-5',
        //     type: 'class',
        //     stats: { students: '120+', teachers: '8', activities: '15+' }
        // },
        // {
        //     _id: '2',
        //     title: 'Primary',
        //     description: 'Developing core academic and social skills with interactive learning',
        //     level: 'Primary',
        //     grades: ['Class 1-5'],
        //     icon: '📚',
        //     ageGroup: 'Ages 6-10',
        //     type: 'class',
        //     stats: { students: '250+', teachers: '15', activities: '20+' }
        // },
        // {
        //     _id: '3',
        //     title: 'Secondary',
        //     description: 'Preparing for board examinations with advanced curriculum',
        //     level: 'Secondary',
        //     grades: ['Class 6-10'],
        //     icon: '🎓',
        //     ageGroup: 'Ages 11-15',
        //     type: 'class',
        //     stats: { students: '300+', teachers: '20', activities: '25+' }
        // },
        {
            _id: '4',
            title: 'Higher Secondary',
            description: 'Specialization in Science, Arts & Commerce streams',
            level: 'Higher Secondary',
            grades: ['Class 11-12'],
            icon: '🏆',
            ageGroup: 'Ages 16-17',
            type: 'class',
            stats: { students: '180+', teachers: '12', activities: '18+' }
        }
    ];

    const fallbackSubjects = {
        english: [
            { _id: 's1', title: 'English', icon: '📖', type: 'subject', medium: 'english', description: 'Literature, Grammar & Communication' },
            { _id: 's2', title: 'Mathematics', icon: '🔢', type: 'subject', medium: 'english', description: 'Numbers, Logic & Problem Solving' },
            { _id: 's3', title: 'Science', icon: '🔬', type: 'subject', medium: 'english', description: 'Physics, Chemistry & Biology' },
            { _id: 's4', title: 'Social Studies', icon: '🌍', type: 'subject', medium: 'english', description: 'History, Geography & Civics' },
            { _id: 's5', title: 'Computer Science', icon: '💻', type: 'subject', medium: 'english', description: 'Programming & Digital Literacy' },
            { _id: 's6', title: 'Physical Education', icon: '⚽', type: 'subject', medium: 'english', description: 'Sports, Fitness & Teamwork' }
        ],
        bangla: [
            { _id: 'b1', title: 'বাংলা', icon: '📖', type: 'subject', medium: 'bangla', description: 'সাহিত্য, ব্যাকরণ এবং যোগাযোগ' },
            { _id: 'b2', title: 'গণিত', icon: '🔢', type: 'subject', medium: 'bangla', description: 'সংখ্যা, যুক্তি এবং সমস্যা সমাধান' },
            { _id: 'b3', title: 'বিজ্ঞান', icon: '🔬', type: 'subject', medium: 'bangla', description: 'পদার্থবিদ্যা, রসায়ন এবং জীববিদ্যা' },
            { _id: 'b4', title: 'সামাজিক বিজ্ঞান', icon: '🌍', type: 'subject', medium: 'bangla', description: 'ইতিহাস, ভূগোল এবং নাগরিক শিক্ষা' },
            { _id: 'b5', title: 'কম্পিউটার', icon: '💻', type: 'subject', medium: 'bangla', description: 'প্রোগ্রামিং এবং ডিজিটাল সাক্ষরতা' },
            { _id: 'b6', title: 'শারীরিক শিক্ষা', icon: '⚽', type: 'subject', medium: 'bangla', description: 'খেলাধুলা, শারীরিক ফিটনেস এবং দলগত কাজ' }
        ]
    };

    const fallbackActivities = [
        // {
        //     _id: 'a1',
        //     title: 'Music & Dance',
        //     description: 'Vocal and instrumental music with cultural dance performances',
        //     details: ['Classical & Contemporary Music', 'Traditional & Modern Dance', 'Annual Cultural Programs', 'Instrument Training'],
        //     icon: '🎵',
        //     type: 'activity',
        //     category: 'Arts',
        //     participants: '200+'
        // },
        // {
        //     _id: 'a2',
        //     title: 'Arts & Crafts',
        //     description: 'Creative expression through various art forms and crafts',
        //     details: ['Drawing & Painting', 'Sculpture & Pottery', 'Digital Art', 'Creative Workshops'],
        //     icon: '🎨',
        //     type: 'activity',
        //     category: 'Arts',
        //     participants: '150+'
        // },
        // {
        //     _id: 'a3',
        //     title: 'Sports',
        //     description: 'Comprehensive sports program with professional coaching',
        //     details: ['Football, Cricket, Basketball', 'Athletics & Swimming', 'Inter-School Competitions', 'Fitness Training'],
        //     icon: '⚽',
        //     type: 'activity',
        //     category: 'Sports',
        //     participants: '300+'
        // },
        // {
        //     _id: 'a4',
        //     title: 'Drama & Theatre',
        //     description: 'Public speaking, acting, and stage performance development',
        //     details: ['Theatre Productions', 'Public Speaking', 'Creative Expression', 'Stage Management'],
        //     icon: '🎭',
        //     type: 'activity',
        //     category: 'Arts',
        //     participants: '120+'
        // },
        // {
        //     _id: 'a5',
        //     title: 'Debate & Quiz',
        //     description: 'Critical thinking, research, and competitive events',
        //     details: ['Model United Nations', 'Quiz Competitions', 'Debate Tournaments', 'Research Projects'],
        //     icon: '🗣️',
        //     type: 'activity',
        //     category: 'Academics',
        //     participants: '180+'
        // },
        {
            _id: 'a6',
            title: 'Science Club',
            description: 'Hands-on experiments, research, and science competitions',
            details: ['Science Olympiads', 'Research Projects', 'Science Fairs', 'Lab Experiments'],
            icon: '🔬',
            type: 'activity',
            category: 'Science',
            participants: '100+'
        }
    ];

    // Use API data or fallback
    const displayClasses = classes.length > 0 ? classes : fallbackClasses;
    const displaySubjects = subjects.length > 0 ? subjects : fallbackSubjects[activeMedium];
    const displayActivities = activities.length > 0 ? activities : fallbackActivities;

    const tabs = [
        { id: 'classes', label: 'Academic Levels', icon: '🏫', count: displayClasses.length },
        { id: 'subjects', label: 'Core Subjects', icon: '📚', count: displaySubjects.length },
        { id: 'activities', label: 'Co-Curricular', icon: '🎨', count: displayActivities.length }
    ];

    if (loading) {
        return (
            <section className="py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-8">
                        <div className="text-center">
                            <div className="h-12 bg-gray-200 rounded-lg w-80 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                    <div className="flex gap-2 justify-center">
                                        <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-6 lg:py-8 bg-white">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-6 lg:mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-3">
                        Our Academics
                    </h2>
                    <p className="text-gray-700 text-base lg:text-lg max-w-3xl mx-auto">
                        Comprehensive education from Pre-Primary to Higher Secondary with world-class curriculum,
                        experienced faculty, and cutting-edge learning methodologies
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="bg-gray-100 rounded-lg p-1">
                        <div className="flex gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'bg-blue-900 text-white shadow-sm'
                                            : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Classes Section */}
                {activeTab === 'classes' && (
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-8">
                            {displayClasses.map((classLevel, index) => (
                                <div
                                    key={classLevel._id || index}
                                    className="bg-white border border-gray-200 hover:border-blue-900 hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden"
                                >
                                    <div className="p-6">
                                        {/* Icon */}
                                        <div className="flex justify-center mb-4">
                                            <div className="w-16 h-16 bg-blue-900 text-white rounded-lg flex items-center justify-center text-3xl">
                                                {classLevel.icon}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                                            {classLevel.title || classLevel.level}
                                        </h3>

                                        {/* Age Group */}
                                        <p className="text-sm font-medium text-gray-600 mb-3 text-center uppercase">
                                            {classLevel.ageGroup}
                                        </p>

                                        {/* Description */}
                                        <p className="text-gray-700 text-sm leading-relaxed mb-4 text-center">
                                            {classLevel.description}
                                        </p>

                                        {/* Grades */}
                                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                                            {classLevel.grades.map((grade, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                                                >
                                                    {grade}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Stats */}
                                        {classLevel.stats && (
                                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-gray-900">{classLevel.stats.students}</div>
                                                    <div className="text-xs font-medium text-gray-600 uppercase">Students</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-gray-900">{classLevel.stats.teachers}</div>
                                                    <div className="text-xs font-medium text-gray-600 uppercase">Teachers</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-gray-900">{classLevel.stats.activities}</div>
                                                    <div className="text-xs font-medium text-gray-600 uppercase">Activities</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Subjects Section */}
                {activeTab === 'subjects' && (
                    <div>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-3">
                                Core Subjects
                            </h3>
                            <p className="text-gray-700 text-base max-w-2xl mx-auto mb-6">
                                Comprehensive curriculum with English and Bangla medium options
                            </p>

                            {/* Medium Toggle */}
                            <div className="inline-flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveMedium('english')}
                                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                                        activeMedium === 'english'
                                            ? 'bg-blue-900 text-white'
                                            : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                >
                                    <span>🇺🇸</span>
                                    <span>English Medium</span>
                                </button>
                                <button
                                    onClick={() => setActiveMedium('bangla')}
                                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                                        activeMedium === 'bangla'
                                            ? 'bg-blue-900 text-white'
                                            : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                >
                                    <span>🇧🇩</span>
                                    <span>Bangla Medium</span>
                                </button>
                            </div>
                        </div>

                        {/* Subjects Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {displaySubjects.map((subject, index) => (
                                <div
                                    key={subject._id || index}
                                    className="bg-white border border-gray-200 hover:border-blue-900 hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden"
                                >
                                    <div className="p-6">
                                        {/* Icon */}
                                        <div className="flex justify-center mb-4">
                                            <div className="w-16 h-16 bg-blue-900 text-white rounded-lg flex items-center justify-center text-3xl">
                                                {subject.icon}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h4 className="text-lg font-bold text-gray-900 mb-2 text-center">
                                            {subject.title || subject.name}
                                        </h4>

                                        {/* Description */}
                                        <p className="text-gray-700 text-sm leading-relaxed text-center mb-4">
                                            {subject.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex justify-center gap-6 pt-4 border-t border-gray-200">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-gray-900">A+</div>
                                                <div className="text-xs font-medium text-gray-600 uppercase">Grade</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-gray-900">Expert</div>
                                                <div className="text-xs font-medium text-gray-600 uppercase">Faculty</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-gray-900">100%</div>
                                                <div className="text-xs font-medium text-gray-600 uppercase">Pass Rate</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Additional Info Section */}
                        <div className="mt-12 bg-gray-50 rounded-lg p-8">
                            <h4 className="text-xl font-bold text-blue-900 mb-6 text-center">Why Choose Our Core Subjects?</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-900 text-white rounded-lg flex items-center justify-center text-xl mx-auto mb-3">🎯</div>
                                    <h5 className="text-lg font-bold text-gray-900 mb-2">Targeted Learning</h5>
                                    <p className="text-gray-700 text-sm">Focused curriculum designed for academic excellence and real-world application</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-900 text-white rounded-lg flex items-center justify-center text-xl mx-auto mb-3">👨‍🏫</div>
                                    <h5 className="text-lg font-bold text-gray-900 mb-2">Expert Faculty</h5>
                                    <p className="text-gray-700 text-sm">Highly qualified teachers with years of experience and innovative teaching methods</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-900 text-white rounded-lg flex items-center justify-center text-xl mx-auto mb-3">📊</div>
                                    <h5 className="text-lg font-bold text-gray-900 mb-2">Proven Results</h5>
                                    <p className="text-gray-700 text-sm">Consistent high performance with 100% pass rates and excellent board results</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Activities Section */}
                {activeTab === 'activities' && (
                    <div>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-3">
                                Co-Curricular Activities
                            </h3>
                            <p className="text-gray-700 text-base max-w-2xl mx-auto">
                                Nurturing talents beyond academics for holistic development
                            </p>
                        </div>

                        <div className="space-y-8">
                            {displayActivities.map((activity, index) => (
                                <div
                                    key={activity._id || index}
                                    className="bg-white border border-gray-200 hover:border-blue-900 hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            {/* Icon */}
                                            <div className="shrink-0">
                                                <div className="w-16 h-16 bg-blue-900 text-white rounded-lg flex items-center justify-center text-3xl">
                                                    {activity.icon}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-medium rounded-full">
                                                        {activity.category}
                                                    </span>
                                                </div>

                                                <h4 className="text-xl font-bold text-gray-900 mb-2">
                                                    {activity.title || activity.name}
                                                </h4>

                                                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                                    {activity.description}
                                                </p>

                                                {/* Activity Details */}
                                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                                    {activity.details.map((detail, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                                                        >
                                                            {detail}
                                                        </span>
                                                    ))}
                                                </div>

                                                {activity.participants && (
                                                    <div className="text-center md:text-left">
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {activity.participants} Participants
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Academics;

