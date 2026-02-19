'use client';
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const ContactPage = () => {
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
        alert('Thank you for your message! We will get back to you soon.');
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-8 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
                        {t('contact.pageTitle')}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                        {t('contact.heroSubtitle')}
                    </p>
                </div>
            </div>

            {/* Contact Information Cards */}
            <div className="py-8 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('contact.multipleWaysTitle')}</h2>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">{t('contact.multipleWaysSubtitle')}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                            <div className="w-10 h-10 sm:w-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2">{t('contact.cards.visitTitle')}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                {t('contact.cards.addressLine1')}<br />
                                {t('contact.cards.addressLine2')}<br />
                                {t('contact.cards.country')}
                            </p>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                            <div className="w-10 h-10 sm:w-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2">{t('contact.cards.callTitle')}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                <strong>{t('contact.cards.mainLabel')}:</strong> (555) 123-4567<br />
                                <strong>{t('contact.cards.admissionsLabel')}:</strong> (555) 123-4568<br />
                                <strong>{t('contact.cards.emergencyLabel')}:</strong> (555) 123-4569
                            </p>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                            <div className="w-10 h-10 sm:w-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2">{t('contact.cards.emailTitle')}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                <strong>{t('contact.cards.emailGeneralLabel')}:</strong><br />info@sunlightschool.edu<br />
                                <strong>{t('contact.cards.emailAdmissionsLabel')}:</strong><br />admissions@sunlightschool.edu<br />
                                <strong>{t('contact.cards.emailSupportLabel')}:</strong><br />support@sunlightschool.edu
                            </p>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                            <div className="w-10 h-10 sm:w-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2">{t('contact.cards.hoursTitle')}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                <strong>{t('contact.cards.hoursWeekdaysLabel')}:</strong> 8:00 AM - 3:00 PM<br />
                                <strong>{t('contact.cards.hoursSaturdayLabel')}:</strong> 9:00 AM - 12:00 PM<br />
                                <strong>{t('contact.cards.hoursSundayLabel')}:</strong> {t('contact.cards.closedLabel')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Form and Map */}
            <div className="py-8 md:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Contact Form */}
                        <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t('contact.form.title')}</h2>
                                <p className="text-sm text-gray-600">{t('contact.form.subtitle')}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.nameLabel')}</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                            placeholder={t('contact.form.placeholders.name')}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.emailLabel')}</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                            placeholder={t('contact.form.placeholders.email')}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.phoneLabel')}</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                            placeholder={t('contact.form.placeholders.phone')}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.subjectLabel')}</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                        >
                                            <option value="">{t('contact.form.selectSubject')}</option>
                                            <option value="admissions">{t('contact.form.subjects.admissions')}</option>
                                            <option value="academic">{t('contact.form.subjects.academic')}</option>
                                            <option value="facilities">{t('contact.form.subjects.facilities')}</option>
                                            <option value="events">{t('contact.form.subjects.events')}</option>
                                            <option value="support">{t('contact.form.subjects.support')}</option>
                                            <option value="other">{t('contact.form.subjects.other')}</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.form.messageLabel')}</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors resize-none"
                                        placeholder={t('contact.form.placeholders.message')}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gray-900 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                                >
                                    {t('contact.form.sendButton')}
                                </button>
                            </form>
                        </div>

                        {/* Map and Additional Info */}
                        <div className="space-y-8">
                            {/* Map Placeholder */}
                            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{t('contact.map.title')}</h3>

                                {/* Embedded responsive map (latitude/longitude provided) */}
                                <div className="w-full overflow-hidden rounded-lg mb-4">
                                    <iframe
                                        title="Sunlight School — Map"
                                        src="https://www.google.com/maps?q=25.6333,88.6333&z=16&hl=en&output=embed"
                                        className="w-full h-56 sm:h-64 border-0 rounded-lg"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div>
                                        <div className="font-semibold">Sunlight School</div>
                                        <div className="text-xs">Latitude: 25.6333° N · Longitude: 88.6333° E</div>
                                        <div className="text-xs text-gray-500">123 Education Street, Knowledge City</div>
                                    </div>

                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=25.6333,88.6333"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="ml-4 inline-block bg-gray-900 text-white px-3 py-2 rounded text-xs hover:bg-gray-800"
                                    >
                                        {t('contact.map.openInMaps')}
                                    </a>
                                </div>
                            </div>

                            {/* Quick Contact Options */}
                            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{t('contact.quick.title')}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{t('contact.quick.liveChat.title')}</h4>
                                            <p className="text-gray-600 text-xs sm:text-sm">{t('contact.quick.liveChat.subtitle')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{t('contact.quick.tour.title')}</h4>
                                            <p className="text-gray-600 text-xs sm:text-sm">{t('contact.quick.tour.subtitle')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{t('contact.quick.request.title')}</h4>
                                            <p className="text-gray-600 text-xs sm:text-sm">{t('contact.quick.request.subtitle')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('contact.faq.title')}</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('contact.faq.subtitle')}</p>
                    </div>

                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">{t('contact.faq.q1.question')}</h3>
                            <p className="text-gray-600">{t('contact.faq.q1.answer')}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">{t('contact.faq.q2.question')}</h3>
                            <p className="text-gray-600">{t('contact.faq.q2.answer')}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">{t('contact.faq.q3.question')}</h3>
                            <p className="text-gray-600">{t('contact.faq.q3.answer')}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">{t('contact.faq.q4.question')}</h3>
                            <p className="text-gray-600">{t('contact.faq.q4.answer')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;