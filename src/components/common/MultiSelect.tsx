import React from 'react';
import Select from 'react-select';

export interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    value: Option[];
    onChange: (value: Option[]) => void;
    placeholder?: string;
    className?: string;
    hasSelectAll?: boolean;
    closeMenuOnSelect?: boolean;  // Add this line
}

const customStyles = {
    control: (base: any) => ({
        ...base,
        minHeight: '32px', // Reduced from 36px
        height: '32px',    // Added fixed height
        maxHeight: '32px', // Reduced from 80px
        overflow: 'hidden',
        borderRadius: '0.5rem',
        borderColor: '#e5e7eb',
        // '&:hover': {
        //     borderColor: '#003C34'
        // }
    }),
    valueContainer: (base: any) => ({
        ...base,
        padding: '0 8px',  // Reduced padding
        gap: '2px',
        flexWrap: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        height: '30px'     // Added fixed height
    }),
    multiValue: (base: any) => ({
        ...base,
        backgroundColor: '#e8f0fe',
        borderRadius: '0.375rem',
        margin: '1px',
    }),
    multiValueLabel: (base: any) => ({
        ...base,
        color: '#003C34',
        fontSize: '11px',
        padding: '1px 4px',
        whiteSpace: 'normal',
        lineHeight: '14px',
    }),
    multiValueRemove: (base: any) => ({
        ...base,
        padding: '0 2px',
        '&:hover': {
            backgroundColor: '#003C34',
            color: 'white',
        },
    }),
    input: (base: any) => ({
        ...base,
        margin: 0,
        padding: 0,
    }),
    placeholder: (base: any) => ({
        ...base,
        fontSize: '12px',
        marginLeft: '5px',
    }),
    option: (base: any, state: any) => ({
        ...base,
        fontSize: '12px',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: state.isSelected ? '#e8f0fe' : state.isFocused ? '#f3f4f6' : 'white',
        color: state.isSelected ? '#003C34' : '#000000',
        '&:after': state.isSelected ? {
            content: '"✓"',
            marginLeft: '8px',
            color: '#003C34',
        } : '',
        ':hover': {
            backgroundColor: '#f3f4f6',
        }
    }),
    menu: (base: any) => ({
        ...base,
        zIndex: 999,
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        padding: 4,
    }),
    clearIndicator: (base: any) => ({
        ...base,
        padding: 4,
    }),
    singleValue: (base: any) => ({
        ...base,
        backgroundColor: '#e8f0fe',
        color: '#003C34',
        fontSize: '11px',
        padding: '2px 8px',
        borderRadius: '0.375rem',
    }),
};

const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value,
    onChange,
    placeholder,
    className,
    hasSelectAll = true,
    closeMenuOnSelect = true  // Add this line with default value
}) => {
    const handleChange = (selected: any) => {
        if (hasSelectAll && selected?.some((v: Option) => v.value === 'all')) {
            const allExceptSelectAll = options.filter(option => option.value !== 'all');
            if (value.length === options.length - 1) {
                onChange([]);
            } else {
                onChange(allExceptSelectAll);
            }
        } else {
            onChange(selected || []);
        }
    };

    const allOptions = hasSelectAll 
        ? [{ value: 'all', label: `Select All ${placeholder}` }, ...options]
        : options;

    const formatValueDisplay = (selected: Option[]) => {
        if (selected.length === 0) return null;
        return `${selected.length} selected`;
    };

    return (
        <Select
            isMulti
            options={allOptions}
            value={value}
            onChange={handleChange}
            styles={customStyles}
            placeholder={placeholder}
            className={`react-select-container ${className}`}
            classNamePrefix="react-select"
            maxMenuHeight={200}
            menuPlacement="auto"
            isSearchable
            isClearable={false}
            closeMenuOnSelect={closeMenuOnSelect}  // Add this line
            hideSelectedOptions={false}  // Add this line
            components={{
                ValueContainer: ({ children, ...props }) => {
                    const { getValue } = props;
                    const values = getValue();
                    return (
                        <div className="react-select__value-container" style={{ display: 'flex', alignItems: 'center' }}>
                            {values.length > 0 ? (
                                <div className="react-select__single-value" style={{
                                    backgroundColor: '#e8f0fe',
                                    color: '#003C34',
                                    fontSize: '11px',
                                    padding: '2px 8px',
                                    borderRadius: '0.375rem',
                                }}>
                                    {`${values.length} selected`}
                                </div>
                            ) : children}
                        </div>
                    );
                }
            }}
        />
    );
};

export default MultiSelect;
