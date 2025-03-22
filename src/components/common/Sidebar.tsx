import React, { useEffect, useState } from 'react';
import { Bell, Layout, Camera, ClipboardMinus, Key, Settings, Antenna, ChevronDown, ChevronUp, Eye, Store, BellDot, LayoutDashboard, MessagesSquare, ChartBarStacked } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCommon, Site } from '@/context/CommonContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Remove the local Site interface since we're importing it

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathName = usePathname();
  const { sites } = useCommon();
  const [expandedSites, setExpandedSites] = useState<Record<string, boolean>>({});

  // Add function to check if site is active
  const isSiteActive = (siteId: string) => {
    return pathName?.includes(`/sites/${siteId}`);
  };

  // Add function to check if specific site page is active
  const isSitePageActive = (siteId: string, pagePath: string) => {
    return pathName === `/sites/${siteId}/${pagePath}`;
  };

  // Auto expand site dropdown if we're on a site page
  useEffect(() => {
    sites?.forEach((site) => {
      if (isSiteActive(site.id) && !expandedSites[site.id]) {
        setExpandedSites(prev => ({
          ...prev,
          [site.id]: true
        }));
      }
    });
  }, [pathName, sites]);

  // Close all dropdowns when navigating to a page without a particular dropdown
  useEffect(() => {
    if (!sites?.some(site => isSiteActive(site.id))) {
      setExpandedSites({});
    }
  }, [pathName, sites]);

  const toggleSite = (siteId: string) => {
    setExpandedSites(prev => ({
      ...prev,
      [siteId]: !prev[siteId]
    }));
  };

  const navigationItems = [
    { name: 'Dashboard', icon: Layout, path: '/dashboard' },
    { name: 'AI Violations', icon: Antenna, path: '/ai-violations' },
    { name: 'Manual Violations', icon: ClipboardMinus, path: '/violations' },
    { name: 'Chatbot', icon: MessagesSquare, path: '/chat-bot' },
   // { name: 'Analytics', icon: ChartBarStacked, path: '/analytics' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];



  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden ${isOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 h-full w-64 max-w-[13.125rem] gredient-background-2 text-white z-50 transition-transform duration-300 lg:translate-x-0 overflow-y-auto scrollbar-hide ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col items-center">
          <div className="relative w-[11rem] h-16 mt-5">
            <Image
              src="/logo.svg"
              fill
              style={{ objectFit: 'contain' }}
              priority
              alt="Company Logo"
            />
          </div>
        </div>

        <nav className="py-4 pl-4 pr-2 space-y-2">
          {navigationItems.map((item, index) => {
            const isActive = pathName === item.path;
            const Icon = item.icon;

            // Changed index from 2 to 1 to insert sites after AI Violations
            if (index === 3) {
              return (
                <React.Fragment key="sites">
                  <Link href={item.path} key={item.name} onClick={onClose}>
                    <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer ${isActive ? 'bg-white text-[#4D5D79]' : 'hover:bg-teal-800'
                      }`}>
                      <div className={isActive ? 'text-teal-800 px-1 rounded-md' : 'p-1 '}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                  </Link>
                  {sites?.map((site: Site) => (
                    <div key={site.id}>
                      <div
                        onClick={() => toggleSite(site.id)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${expandedSites[site?.id] || isSiteActive(site.id)
                          ? 'bg-white text-[#4D5D79]'
                          : 'hover:bg-teal-800'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={
                            expandedSites[site?.id] || isSiteActive(site.id)
                              ? 'gredient-background text-white p-1 rounded-md'
                              : 'p-1 bg-white text-teal-800 rounded-md'
                          }>
                            <Store className="w-5 h-5" />
                          </div>
                          <span className="text-sm">{site?.name.replace(/-/g, ' ')}</span>
                        </div>
                        {expandedSites[site?.id] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSites[site?.id] ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                        <div className=" space-y-2 mt-2">
                          <Link href={`/sites/${site?.id}/overview`} onClick={onClose}>
                            <div className={`p-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-2 ${isSitePageActive(site.id, 'overview')
                              ? 'bg-teal-100 text-teal-800'
                              : 'hover:bg-teal-800'
                              }`}>
                              <LayoutDashboard className="w-4 h-4 ml-5" />
                              <span>Overview</span>
                            </div>
                          </Link>
                          <Link href={`/sites/${site?.id}/automatic-alarm`} onClick={onClose}>
                            <div className={`p-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-2 ${isSitePageActive(site.id, 'automatic-alarm')
                              ? 'bg-teal-100 text-teal-800'
                              : 'hover:bg-teal-800'
                              }`}>
                              <BellDot className="w-4 h-4 ml-5" />
                              <span>AI Violations</span>
                            </div>
                          </Link>
                          {site?.liveView && site.liveView.trim() !== '' && (
                            <Link href={`/sites/${site.id}/live-view`} onClick={onClose}>
                              <div
                                className={`p-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-2 ${isSitePageActive(site.id, 'live-view')
                                  ? 'bg-teal-100 text-teal-800'
                                  : 'hover:bg-teal-800'
                                  }`}
                              >
                                <Eye className="w-4 h-4 ml-5" />
                                <span>Live View</span>
                              </div>
                            </Link>
                          )}

                        </div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              );
            }

            return (
              <Link href={item.path} key={item.name} onClick={onClose}>
                <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer ${isActive ? 'bg-white text-[#4D5D79]' : 'hover:bg-teal-800'
                  }`}>
                  <div className={isActive ? 'text-teal-800 px-1 rounded-md' : 'p-1'}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;