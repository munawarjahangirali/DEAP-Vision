// import { useState } from 'react';
// import { Send } from 'lucide-react';
// import axiosInstance from '@/services/axios';
// import toast from 'react-hot-toast';
// import Button from '../common/Button';

// interface ChatInputProps {
//   onSend: (message: string, botResponse: any) => void;
//   loading?: boolean;
//   setLoading: (loading: boolean) => void;
//   userId?: number | string;
// }

// export const ChatInput = ({ onSend, setLoading, userId,loading }: ChatInputProps) => {
//   const [inputValue, setInputValue] = useState('');

//   const handleSend = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (inputValue.trim() === '') return;

//     setLoading(true);

//     try {
//       const response = await axiosInstance.get('/chatbot', {
//         params: {
//           query: inputValue,
//           user_id: userId
//         }
//       });

//       if (response.data.status === 200) {
//         onSend(inputValue, response.data.data);
//       }
//     } catch (error) {
//       toast.error('Failed to send message');
//       console.error('Failed to send message:', error);
//     }

//     setLoading(false);
//     setInputValue('');
//   };

//   return (
//     <form onSubmit={handleSend} className="absolute bottom-6 left-6 right-6">
//       <input
//         type="text"
//         placeholder="Type here"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         className="w-full px-4 py-3 pr-24 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       <div className="absolute right-2 top-2 flex space-x-2">
//         <Button
//           variant='primary'
//           isLoading={loading}
//           className="p-2 btn-primary text-white rounded-lg transition-colors"
//           onClick={handleSend}
//         >
//           <Send className="w-5 h-5" />
//         </Button>
//       </div>
//     </form>
//   );
// };
import { useState, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import axiosInstance from '@/services/axios';
import toast from 'react-hot-toast';
import Button from '../common/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  loading?: boolean;
  setLoading: (loading: boolean) => void;
  userId?: number | string;
}

export const ChatInput = ({ onSend, setLoading, userId, loading }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim() === '') return;

    setLoading(true);

    onSend(inputValue);
    // try {
    //   const response = await axiosInstance.get('/chatbot', {
    //     params: {
    //       query: inputValue,
    //       user_id: userId,
    //     },
    //   });

    //   if (response.data.status === 200) {
    //     onSend(inputValue, response.data.data);
    //   }
    // } catch (error) {
    //   toast.error('Failed to send message');
    //   console.error('Failed to send message:', error);
    // }

    setLoading(false);
    setInputValue('');
  };

  const handleSpeechToggle = () => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser.');
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => prev + transcript);
        toast.success('Voice input captured!');
      };

      recognition.onerror = (event : any) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Speech recognition failed.');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }

    setIsListening(!isListening);
  };

  return (
    <form onSubmit={handleSend} className="absolute bottom-6 left-6 right-6">
      <input
        type="text"
        placeholder="Type here"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full px-4 py-3 pr-36 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="absolute right-2 top-2 flex space-x-2">
        <Button
          variant="primary"
          isLoading={loading}
          className="p-2 btn-primary text-white rounded-lg transition-colors"
          onClick={handleSend}
        >
          <Send className="w-5 h-5" />
        </Button>
        <Button
          variant="secondary"
          type='button'
          className={`p-2 rounded-lg transition-colors ${
            isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={handleSpeechToggle}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
      </div>
    </form>
  );
};
