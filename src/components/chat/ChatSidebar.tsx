import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios';

const fetchPrompts = async (searchTerm: string) => {
  const response = await axiosInstance.get('/frequent-prompts', {
    params: { search: searchTerm },
  });
  return response.data.data;
};

export const ChatSidebar = ({ onPromptClick }: any) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: prompts = [], refetch } = useQuery({
    queryKey: ['frequentPrompts', searchTerm],
    queryFn: () => fetchPrompts(searchTerm),
    enabled: true, 
  });

  useEffect(() => {
    refetch();
  }, [searchTerm, refetch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="!min-w-96 bg-white p-6 shadow-sm rounded-xl h-full overflow-y-scroll custom-scrollbar hidden md:block">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Frequent Prompts</h2>
      
      {/* Search Box */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search Prompts"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
      </div>

      {/* Prompt Links */}
      <div className="space-y-3">
        {prompts.map((prompt: any, index: any) => (
          <Link
            key={index}
            href="#"
            className="block p-4 text-gray-700 hover:bg-gray-50 rounded-lg border transition-colors"
            onClick={() => onPromptClick(prompt)}
          >
            {prompt.query}
          </Link>
        ))}
      </div>
    </div>
  );
};