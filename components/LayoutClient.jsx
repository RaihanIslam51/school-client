'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import LoginModal from './Auth/LoginModal';
import swManager from '../src/swRegister';


const LayoutClient = ({ children }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const pathname = usePathname();
    
    // Aggressively unregister all service workers on every page load
    useEffect(() => {
        const unregisterAllSW = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    console.log(`[Layout] Found ${registrations.length} service worker(s) to unregister`);
                    
                    for (const registration of registrations) {
                        const result = await registration.unregister();
                        console.log('[Layout] Unregistered service worker:', result);
                    }
                    
                    console.log('[Layout] All service workers unregistered from LayoutClient');
                    
                    // Also clear all caches to ensure clean state
                    if ('caches' in window) {
                        const cacheNames = await caches.keys();
                        console.log(`[Layout] Found ${cacheNames.length} caches to clear`);
                        await Promise.all(
                            cacheNames.map(cacheName => {
                                console.log(`[Layout] Deleting cache: ${cacheName}`);
                                return caches.delete(cacheName);
                            })
                        );
                        console.log('[Layout] All caches cleared');
                    }
                } catch (error) {
                    console.error('[Layout] Failed to unregister service workers:', error);
                }
            }
        };
        
        unregisterAllSW();
    }, []);

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

            {/* Service Worker Update Notification */}
            {updateAvailable && (
                <div className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Update Available</p>
                            <p className="text-sm opacity-90">A new version is ready to install.</p>
                        </div>
                        <div className="ml-4 flex space-x-2">
                            <button
                                onClick={() => {
                                    swManager.skipWaiting();
                                    setUpdateAvailable(false);
                                }}
                                className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setUpdateAvailable(false)}
                                className="text-white opacity-70 hover:opacity-100 text-sm"
                            >
                                Later
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LayoutClient;
