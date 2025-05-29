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
                    controls={false}
                    onError={(e) => console.error('Video load error:', e)}
                />
            </div>
        );
    }

    return <span>-</span>;
};

export default MediaRenderer;
