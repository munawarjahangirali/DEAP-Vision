import {  Search } from 'lucide-react';
import { FC, ChangeEvent } from 'react';

interface SearchInputProps {
    className?: string;
    wrapperClassName?: string;
    value?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const SearchInput: FC<SearchInputProps> = ({
    className,
    wrapperClassName,
    value,
    onChange,
    placeholder
}) => {
    return (
        <div className={`relative mr-2 text-sm ${wrapperClassName || ''}`}>
            <input
                className={`form-input ${className || ''}`}
                style={{borderRadius: 4, padding: '8px 8px 8px 32px'}}
                value={value}
                onChange={onChange}
                placeholder={placeholder || 'Search'}/>
            <Search className="absolute top-3 left-2.5 text-gray-500 size-4"/>
        </div>
    )
}

export default SearchInput;