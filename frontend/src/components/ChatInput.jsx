import useAutosize from '@/hooks/useAutosize';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import sendIcon from '@/assets/images/send.svg';
import micIcon from '@/assets/images/mic.svg';
import stopIcon from '@/assets/images/stop.svg';

function ChatInput({ newMessage, isLoading, setNewMessage, submitNewMessage }) {
  const textareaRef = useAutosize(newMessage);
  const { supported: sttSupported, listening, start, stop } = useSpeechRecognition({
    onResult: (t) => setNewMessage(t)
  });

  function handleKeyDown(e) {
    if(e.keyCode === 13 && !e.shiftKey && !isLoading) {
      e.preventDefault();
      submitNewMessage();
    }
  }
  
  return(
    <div className='sticky bottom-0 shrink-0 bg-white py-4'>
      <div className='p-1.5 bg-primary-blue/35 rounded-3xl z-50 font-mono origin-bottom animate-chat duration-400'>
        <div className='pr-0.5 bg-white relative shrink-0 rounded-3xl overflow-hidden ring-primary-blue ring-1 focus-within:ring-2 transition-all'>
          <textarea
            className='block w-full max-h-[140px] py-2 pl-11 pr-11 px-4 bg-white rounded-3xl resize-none placeholder:text-primary-blue placeholder:leading-4 placeholder:-translate-y-1 sm:placeholder:leading-normal sm:placeholder:translate-y-0 focus:outline-hidden'
            ref={textareaRef}
            rows='1'
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`absolute top-1/2 -translate-y-1/2 left-3 p-1 rounded-md ${listening ? 'bg-primary-blue/20' : 'hover:bg-primary-blue/20'} ${(!sttSupported || isLoading) ? 'opacity-40 cursor-not-allowed' : ''}`}
            onClick={() => listening ? stop() : start()}
            disabled={!sttSupported || isLoading}
            aria-label={listening ? 'Stop voice input' : 'Start voice input'}
            title={sttSupported ? (listening ? 'Stop voice input' : 'Start voice input') : 'Voice input not supported in this browser'}
          >
            <img src={listening ? stopIcon : micIcon} alt={listening ? 'stop' : 'mic'} />
          </button>
          <button
            className='absolute top-1/2 -translate-y-1/2 right-3 p-1 rounded-md hover:bg-primary-blue/20'
            onClick={submitNewMessage}
          >
            <img src={sendIcon} alt='send' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
