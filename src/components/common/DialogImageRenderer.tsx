import React, { useState } from 'react';

interface DialogImageRendererProps {
    src: string;
    style?: React.CSSProperties;
}

const DialogImageRenderer: React.FC<DialogImageRendererProps> = ({ src, style }) => {
    const [isValidImage, setIsValidImage] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        setIsValidImage(false);
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        isValidImage && src ? (
            <div className={`flex flex-col border-b border-gray-200 py-2 ${isLoading?'hidden':''}`}>
                <div className={`text-primary text-sm pb-2 ${isLoading?'hidden':''}`}>Image</div>
                <img
                    src={src}
                    alt="media"
                    style={{ ...style, display: isLoading ? 'none' : 'block' }}
                    onError={handleError}
                    onLoad={handleLoad}
                />
            </div>
        ) : null
    );
};

export default DialogImageRenderer;
