// import React, { useState, useEffect } from 'react';

// interface TypewriterMessageProps {
//     content: any;
//     onComplete?: () => void;
//     isNew?: boolean;
// }

// export const TypewriterMessage = ({ content, onComplete, isNew }: TypewriterMessageProps) => {
//     const [displayContent, setDisplayContent] = useState<any>([]);
//     const [isTyping, setIsTyping] = useState(false);
//     const [currentCharIndex, setCurrentCharIndex] = useState(0);

//     useEffect(() => {
//         if (!isNew) {
//             setDisplayContent(content);
//             return;
//         }

//         setIsTyping(true);

//         const text = Array.isArray(content) && content.length > 0
//             ? content.map(item => `${item.activityName}: Hazards - ${item.hazardDescription}, Recommendations - ${item.controlMeasure}`).join(' ')
//             : content.toString() || "No Response";

//         const typewriterInterval = setInterval(() => {
//             setCurrentCharIndex((prev) => {
//                 if (prev >= text.length - 1) {
//                     clearInterval(typewriterInterval);
//                     setIsTyping(false);
//                     onComplete?.();
//                     return prev;
//                 }
//                 return prev + 1;
//             });
//         }, 30);

//         return () => clearInterval(typewriterInterval);
//     }, [content, isNew]);

//     const displayText = Array.isArray(content) && content.length > 0
//         ? content.map(item => `${item.activityName}: Hazards - ${item.hazardDescription}, Recommendations - ${item.controlMeasure}`).join(' ')
//         : content?.toString() || "No Response";

//     return (
//         <p>
//             {isNew ? displayText.slice(0, currentCharIndex) : displayText}
//             {isNew && isTyping && <span className="animate-pulse">▋</span>}
//         </p>
//     );
// };
// import React, { useState, useEffect } from 'react';
// import ReactMarkdown from 'react-markdown';

// interface TypewriterMessageProps {
//     content: any;
//     onComplete?: () => void;
//     isNew?: boolean;
// }

// export const TypewriterMessage = ({ content, onComplete, isNew }: TypewriterMessageProps) => {
//     const [displayContent, setDisplayContent] = useState<any>([]);
//     const [isTyping, setIsTyping] = useState(false);
//     const [currentCharIndex, setCurrentCharIndex] = useState(0);

//     useEffect(() => {
//         if (!isNew) {
//             setDisplayContent(content);
//             return;
//         }

//         setIsTyping(true);

//         const text = Array.isArray(content) && content.length > 0
//             ? content.map(item => `${item.activityName}: Hazards - ${item.hazardDescription}, Recommendations - ${item.controlMeasure}`).join(' ')
//             : content.toString() || "No Response";

//         const typewriterInterval = setInterval(() => {
//             setCurrentCharIndex((prev) => {
//                 if (prev >= text.length - 1) {
//                     clearInterval(typewriterInterval);
//                     setIsTyping(false);
//                     onComplete?.();
//                     return prev;
//                 }
//                 return prev + 1;
//             });
//         }, 30);

//         return () => clearInterval(typewriterInterval);
//     }, [content, isNew]);

//     const displayText = Array.isArray(content) && content.length > 0
//         ? content.map(item => `${item.activityName}: Hazards - ${item.hazardDescription}, Recommendations - ${item.controlMeasure}`).join(' ')
//         : content?.toString() || "No Response";

//     return (
//         <div className="space-y-2"> {/* Adds vertical space between lines */}
//             <p className="whitespace-pre-line"> {/* Ensures proper line breaks and spacing */}
//                 {isNew ? (
//                     <ReactMarkdown children={displayText.slice(0, currentCharIndex)} />
//                 ) : (
//                     <ReactMarkdown children={displayText} />
//                 )}
//                 {isNew && isTyping && <span className="animate-pulse">▋</span>}
//             </p>
//         </div>
//     );
// };

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface TypewriterMessageProps {
  content: any;
  onComplete?: () => void;
  isNew?: boolean;
}

export const TypewriterMessage = ({ content, onComplete, isNew }: TypewriterMessageProps) => {
  const [displayContent, setDisplayContent] = useState<any>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (!isNew) {
      setDisplayContent(content);
      return;
    }

    setIsTyping(true);

    const text =
      Array.isArray(content) && content.length > 0
        ? content.map((item) => `${item.activityName}: Hazards - ${item.hazardDescription}, Recommendations - ${item.controlMeasure}`).join(' ')
        : content.toString() || 'No Response';

    const typewriterInterval = setInterval(() => {
      setCurrentCharIndex((prev) => {
        if (prev >= text.length - 1) {
          clearInterval(typewriterInterval);
          setIsTyping(false);
          onComplete?.();
          return prev;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(typewriterInterval);
  }, [content, isNew]);

  const displayText =
    Array.isArray(content) && content.length > 0
      ? content.map((item) => `${item.activityName}: Hazards - ${item.hazardDescription}, Recommendations - ${item.controlMeasure}`).join(' ')
      : content?.toString() || 'No Response';

  return (
    <div className="space-y-2">
      <p className="whitespace-pre-line">
      {isNew ? (
          <ReactMarkdown>
            {displayText.slice(0, currentCharIndex)}
          </ReactMarkdown>
        ) : (
          <ReactMarkdown>{displayText}</ReactMarkdown> // Pass content between tags
        )}
        {/* {isNew && isTyping && <span className="animate-pulse">▋</span>} */}
      </p>
    </div>
  );
};
