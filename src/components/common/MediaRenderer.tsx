import ImageRenderer from './ImageRenderer';
import ReactPlayer from 'react-player';

interface MediaRendererProps {
    imageFile?: string;
    videoFile?: string;
    style?: React.CSSProperties;
    cdnUrl?: string;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ imageFile, videoFile, style, cdnUrl = '' }) => {
    if (imageFile) {
        return <ImageRenderer src={`${cdnUrl}${imageFile}`} style={style} />;
    }

    if (videoFile) {
        return (
            <div style={{ ...style, position: 'relative' }}>
                <ReactPlayer
                    url={`${cdnUrl}${videoFile}`}
                    width="100%"
                    height="100%"
                    light={true}
                    playIcon={
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    }
                    autoPlay={false}
                    controls={false}
                    config={{
                        file: {
                            attributes: {
                                crossOrigin: 'anonymous',
                            },
                        },
                    }}
                    style={{ borderRadius: '8px', overflow: 'hidden' }}
                    onError={(e) => console.error('Video load error:', e)}
                />
            </div>
        );
    }

    return <span>-</span>;
};

export default MediaRenderer;
