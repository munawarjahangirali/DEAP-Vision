import React, { useState } from 'react';

interface ImageRendererProps {
    src: string;
    style?: React.CSSProperties;
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ src, style }) => {
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
            <>
                {isLoading && <div className="skeleton" style={{ ...style }}></div>}
                <img
                    src={src}
                    alt="media"
                    style={{ ...style, display: isLoading ? 'none' : 'block' }}
                    onError={handleError}
                    onLoad={handleLoad}
                />
            </>
        ) : (
            <span>-</span>
        )
    );
};

export default ImageRenderer;
