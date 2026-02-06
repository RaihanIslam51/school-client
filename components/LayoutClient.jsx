'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import LoginModal from './Auth/LoginModal';


const LayoutClient = ({ children }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const pathname = usePathname();
    
    // Hide Navbar and Footer for dashboard, portal, and teacherboard routes
    const isDashboard = pathname?.startsWith('/dashboard');
    const isPortal = pathname?.startsWith('/portal');
    const isTeacherboard = pathname?.startsWith('/teacherboard');

    return (
        <>
            {!isDashboard && !isPortal && !isTeacherboard && (
                <Navbar 
                    onOpenLogin={() => setIsLoginOpen(true)}
                />
            )}
            {children}
            {!isDashboard && !isPortal && !isTeacherboard && <Footer />}
            
            {/* Modals at root level */}
            <LoginModal 
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)}
                onOpenSignup={() => {
                    setIsLoginOpen(false);
                    setIsSignupOpen(true);
                }}
            />
            {/* <SignupModal 
                isOpen={isSignupOpen} 
                onClose={() => setIsSignupOpen(false)}
                onOpenLogin={() => {
                    setIsSignupOpen(false);
                    setIsLoginOpen(true);
                }}
            /> */}
        </>
    );
};

export default LayoutClient;
