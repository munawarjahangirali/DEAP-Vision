'use client';
import React, { useState, useEffect } from 'react';
import { Menu, User2, KeyRound, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useCommon } from '@/context/CommonContext';

interface HeaderProps {
    onSidebarOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarOpen }) => {
    const [isSticky, setIsSticky] = useState(false);
    const pathName = usePathname();
    const router = useRouter();
    const { profileData } = useAuth();
    const { setProfileData, setIsAuthenticated } = useAuth();
    const { sites } = useCommon();

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getPageTitle = () => {
        switch (true) {
            case /^\/sites\/[^/]+\/overview/.test(pathName || ''):
                const siteId = pathName?.split('/')[2];
                const site = sites?.find(site => site.id.toString() === siteId);
                const getRpmDot = (rpm: number | null | undefined, boardID: number | null | undefined) => {
                    if (boardID) {
                        if (rpm === null || rpm === undefined) return '';
                        if (rpm === 0) return '🟢'; else return '🔴';
                    }
                    return '';
                };
                return site ? `OVERVIEW - ${site.name.toUpperCase().replace(/-/g, ' ')} ${getRpmDot((site as any).rpm, (site as any).boardID)}` : 'OVERVIEW';
            case /^\/sites\/[^/]+\/live-view/.test(pathName || ''):
                const liveSiteId = pathName?.split('/')[2];
                const liveSite = sites?.find(site => site.id.toString() === liveSiteId);
                return liveSite ? `LIVE VIEW - ${liveSite.name.toUpperCase().replace(/-/g, ' ')}` : 'LIVE VIEW';
                
            case '/ai-violations' === pathName:
                return 'AI VIOLATIONS';
            case '/violations' === pathName:
                return 'MANUAL VIOLATIONS';
            case '/settings' === pathName:
                return 'SETTINGS';
            case '/settings/create' === pathName:
                return 'CREATE SETTING';
            case '/change-password' === pathName:
                return 'CHANGE PASSWORD';
            case '/chat-bot' === pathName:
                return 'CHATBOT';
            case '/analytics' === pathName:
                return 'ANALYTICS';
            default:
                return 'DASHBOARD';
        }
    };

    const handleLogout = () => {
        try {
            if (setIsAuthenticated) {
                setIsAuthenticated(false);
            }
            if (setProfileData) {
                setProfileData(undefined);
            }
            localStorage.removeItem('token'); // Clear the token
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            toast.error('Error logging out');
        }
    };

    return (
        <div className="sticky top-0 pt-5 px-5 z-50">
            <header className={`rounded-lg transition-colors duration-200 relative ${isSticky ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
                <div className="flex justify-between items-center md:p-4 p-2">
                    <div className="flex items-center gap-1">
                        <button
                            className="lg:hidden p-2 hover:bg-gray-100 rounded"
                            onClick={onSidebarOpen}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-semibold text-primary">{getPageTitle()}</h2>
                    </div>
                    <div className="hidden md:flex items-center ">
                        <div className="relative w-[20rem] h-16 -mt-5">
                            <Image
                                src="/logo2.png"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                                alt="Company Logo"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/profile" className="text-secondary hover:text-primary flex items-center gap-2 text-sm font-semibold">
                            <User2 className="w-5 h-5" />
                            <span className="hidden md:inline">{profileData?.role}</span>
                        </Link>
                        <Link href="/change-password" className="text-secondary hover:text-primary flex items-center gap-2  text-sm font-semibold">
                            <KeyRound className="w-5 h-5" />
                            <span className="hidden md:inline">Change Password</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-secondary hover:text-primary flex items-center gap-2 text-sm font-semibold"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
