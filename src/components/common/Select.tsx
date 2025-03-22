'use client';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select option',
    className = '',
}) => {
    return (
        <div className="relative w-full">
            <select
                value={value || ''}
                onChange={(e) => onChange?.(e.target.value)}
                className={`w-full p-1.5 text-xs border border-gray-200 rounded-md bg-white
                            appearance-none cursor-pointer hover:border-gray-300 focus:outline-none
                            focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 text-primary 
                            ${className}`}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
    );
};

export default Select;
