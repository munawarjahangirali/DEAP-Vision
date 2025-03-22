'use client';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';

interface TabItem {
    key: string;
    title: string;
    content: React.ReactNode;
}

interface TabsProps {
    items: TabItem[];
    defaultIndex?: number;
}

const Tabs: React.FC<TabsProps> = ({ items, defaultIndex = 0 }) => {
    return (
        <Tab.Group defaultIndex={defaultIndex}>
            <Tab.List className="flex space-x-1 border-b border-gray-200">
                {items.map((item) => (
                    <Tab as={Fragment} key={item.key}>
                        {({ selected }) => (
                            <button
                                className={`
                  px-4 py-2.5 text-sm font-medium leading-5 
                  ${selected
                                        ? 'text-[#003C34] border-b-2 border-[#003C34]'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }
                `}
                            >
                                {item.title}
                            </button>
                        )}
                    </Tab>
                ))}
            </Tab.List>
            <Tab.Panels className="mt-4">
                {items.map((item) => (
                    <Tab.Panel key={item.key}>
                        {item.content}
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    );
};

export default Tabs;
