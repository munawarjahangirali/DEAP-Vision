import React, { useState } from 'react';
import ReactPlayer from 'react-player';

interface DialogVideoRendererProps {
    src: string;
    style?: React.CSSProperties;
}

const DialogVideoRenderer: React.FC<DialogVideoRendererProps> = ({ src, style }) => {
    const [isValidVideo, setIsValidVideo] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        setIsValidVideo(false);
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        isValidVideo && src ? (
            <div className={`flex flex-col border-b border-gray-200 py-2 ${isLoading ? 'hidden' : ''}`}>
                <div className={`text-primary text-sm pb-2 ${isLoading ? 'hidden' : ''}`}>Videos</div>
                <div className="aspect-video">
                    <ReactPlayer
                        url={src}
                        width="100%"
                        height="100%"
                        controls={true}
                        playing={true}
                        loop={true}
                        onError={handleError}
                        onReady={handleLoad}
                    />
                </div>
            </div>
        ) : null
    );
};

export default DialogVideoRenderer;
