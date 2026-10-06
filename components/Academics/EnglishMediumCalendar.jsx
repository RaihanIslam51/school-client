'use client';
import React from 'react';
import Image from 'next/image';

const holidays = [
    { date: '5th February', days: 'Saturday (weekend)', name: '*Saraswati Puja' },
    { date: '21st February', days: 'Monday', name: 'International Mother Language Day' },
    { date: '1st March', days: 'Tuesday', name: '*Sab-E-Miraz & Shib Ratri' },
    { date: '17th March', days: 'Thursday', name: 'Birthday of Father of the Nation' },
    { date: '19th March', days: 'Saturday (weekend)', name: '*Sab-E-Barat' },
    { date: '26th March', days: 'Saturday (weekend)', name: 'Independence Day' },
    { date: '14th April', days: 'Thursday', name: 'Pohela Boishakh' },
    { date: '17th & 18th April', days: 'Sunday & Monday', name: 'Easter Sunday (Easter Holiday)' },
    { date: '19th- 30th April', days: 'Tuesday - Saturday', name: '*Ramadan Holidays' },
    { date: '29th April', days: 'Friday', name: '*Sab-E-Qadar' },
    { date: '1st May', days: 'Sunday', name: 'May Day (Labour Day)' },
    { date: '2nd- 9th May', days: 'Monday-Sunday', name: '*Eid-Ul-Fitr' },
    { date: '15th May', days: 'Sunday', name: '*Buddha Purnima' },
    { date: '10th- 14th July', days: 'Sunday- Thursday', name: '*Eid-Ul-Azha' },
    { date: '9th August', days: 'Tuesday', name: '*Ashura/ Muharram' },
    { date: '15th August', days: 'Monday', name: 'National Mourning Day' },
    { date: '18th August', days: 'Thursday', name: '*Janmashtami' },
    { date: '21st- 30th August', days: 'Sunday-Tuesday', name: 'Summer vacation' },
    { date: '21st September', days: 'Wednesday', name: '*Akhari Chahar Sombha' },
    { date: '25th September', days: 'Sunday', name: 'Shuvo Mahalaya' },
    { date: '2nd- 6th October', days: 'Sunday- Thursday', name: '*Durga Puja Holidays' },
    { date: '9th October', days: 'Sunday', name: '*Eid-E- Milad-Un-Nobi' },
    { date: '16th December', days: 'Friday', name: 'Victory Day' },
    { date: '21st- 29th December', days: 'Wednesday- Thursday', name: 'Christmas Holidays' },
    { date: '1st- 5th January', days: 'Sunday- Thursday', name: 'New Year Holidays of 2023' },
];

const keyDates = [
    {
        date: '09/01/2022 YearlyExam)',
        day: 'Sunday',
        event: 'Classes Commence (Half',
        bgColor: 'bg-[#B5E399] text-gray-900 font-bold'
    },
    {
        date: '10/03/2022',
        day: 'Thursday',
        event: 'Parents-Teachers Meeting',
        bgColor: 'bg-[#9EC5E8] text-gray-900 font-bold'
    },
    {
        date: '16/03/2022',
        day: 'Wednesday',
        event: 'Half Yearly Examination begins',
        bgColor: 'bg-[#B5E399] text-gray-900 font-bold'
    },
    {
        date: '31/03/2021',
        day: 'Thursday',
        event: 'Report Card Day',
        bgColor: 'bg-[#FFFF55] text-gray-900 font-bold'
    },
    {
        date: '03/04/2021',
        day: 'Monday',
        event: 'Classes Commence (Final Exam)',
        bgColor: 'bg-[#B5E399] text-gray-900 font-bold'
    },
    {
        date: '09/06/2022',
        day: 'Thursday',
        event: 'Parents-Teachers Meeting',
        bgColor: 'bg-[#9EC5E8] text-gray-900 font-bold'
    },
    {
        date: '15/06/2022',
        day: 'Wednesday',
        event: 'Final Examination begins',
        bgColor: 'bg-[#B5E399] text-gray-900 font-bold'
    },
    {
        date: '30/06/2021',
        day: 'Thursday',
        event: 'Report Card Day',
        bgColor: 'bg-[#FFFF55] text-gray-900 font-bold'
    }
];

const EnglishMediumCalendar = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-56 sm:h-72 md:h-88 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-md">
                <Image
                    src="/school1.png"
                    alt="English Medium Academic Calendar"
                    fill
                    priority
                    className="object-cover opacity-50 filter brightness-90"
                />
                <div className="absolute inset-0 bg-black/45" />

                <div className="relative z-10 px-4 max-w-4xl mx-auto">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-md">
                        English Medium Academic Calendar
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        home - English Medium Academic Calendar
                    </p>
                </div>
            </div>

            {/* ─── MAIN CONTENT: TABLES CONTAINER ─── */}
            <div className="py-10 px-3 sm:px-6 md:px-8 max-w-5xl mx-auto flex flex-col items-center">
                
                {/* ─── TABLE 1: HOLIDAY CALENDAR 2022 ─── */}
                <div className="w-full max-w-3xl overflow-x-auto shadow-md border-2 border-gray-700 bg-white rounded-sm">
                    <table className="w-full text-xs sm:text-sm border-collapse text-gray-900">
                        <thead>
                            <tr className="border-b-2 border-gray-700 bg-white">
                                <th colSpan="3" className="py-2 px-4 text-center font-bold text-sm sm:text-base tracking-wide text-gray-900">
                                    Holiday Calender-2022
                                </th>
                            </tr>
                            <tr className="border-b-2 border-gray-700 bg-white">
                                <th colSpan="3" className="py-1.5 px-4 text-center font-bold text-xs sm:text-sm text-gray-900">
                                    2022 (January to December)
                                </th>
                            </tr>
                            <tr className="border-b-2 border-gray-700 bg-gray-100 text-gray-900">
                                <th className="py-2 px-4 text-center font-bold border-r-2 border-gray-700 w-1/4 sm:w-1/4">Date</th>
                                <th className="py-2 px-4 text-center font-bold border-r-2 border-gray-700 w-1/3 sm:w-1/3">Days</th>
                                <th className="py-2 px-4 text-left font-bold w-1/2">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holidays.map((item, idx) => (
                                <tr
                                    key={idx}
                                    className={`border-b border-gray-400 hover:bg-gray-50 transition-colors ${
                                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                    }`}
                                >
                                    <td className="py-1.5 px-3 text-center border-r border-gray-400 text-xs sm:text-sm font-medium text-gray-900">
                                        {item.date}
                                    </td>
                                    <td className="py-1.5 px-3 text-left border-r border-gray-400 text-xs sm:text-sm font-medium text-gray-800">
                                        {item.days}
                                    </td>
                                    <td className="py-1.5 px-3 text-left text-xs sm:text-sm font-medium text-gray-800">
                                        {item.name}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footnote under Table 1 */}
                <p className="text-[11px] sm:text-xs text-gray-600 mt-4 text-center max-w-2xl font-medium leading-relaxed px-2">
                    * Religious holidays are subject to the appearance of the moon and any changes or additions of the above dates can be made by the school authority if needed.
                </p>

                {/* ─── TABLE 2: KEY DATES OF 2022 - 2023 SESSION ─── */}
                <div className="w-full max-w-2xl mt-10 overflow-x-auto shadow-md border-2 border-gray-700 rounded-sm">
                    <table className="w-full text-xs sm:text-sm border-collapse">
                        <thead>
                            <tr className="bg-[#4A5568] text-white border-b-2 border-gray-700">
                                <th colSpan="3" className="py-2.5 px-4 text-center font-extrabold tracking-wider text-xs sm:text-sm uppercase">
                                    KEY DATES OF 2022 – 2023 SESSION
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {keyDates.map((item, idx) => (
                                <tr key={idx} className={`${item.bgColor} border-b border-gray-600`}>
                                    <td className="py-2 px-3 text-center border-r border-gray-600 text-xs sm:text-sm font-bold border-b border-gray-600">
                                        {item.date}
                                    </td>
                                    <td className="py-2 px-3 text-center border-r border-gray-600 text-xs sm:text-sm font-bold border-b border-gray-600">
                                        {item.day}
                                    </td>
                                    <td className="py-2 px-3 text-left text-xs sm:text-sm font-bold border-b border-gray-600">
                                        {item.event}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    );
};

export default EnglishMediumCalendar;
