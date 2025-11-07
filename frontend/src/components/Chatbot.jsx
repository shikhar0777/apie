import { useState } from 'react';
import { useImmer } from 'use-immer';
import api from '@/api';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import useSpeechSynthesis from '@/hooks/useSpeechSynthesis';

function Chatbot() {
  const [messages, setMessages] = useImmer([]);
  const [newMessage, setNewMessage] = useState('');
  const [autoRead, setAutoRead] = useState(false);
  const { supported: ttsSupported, speaking, speak, cancel } = useSpeechSynthesis();

  const isLoading = messages.length && messages[messages.length - 1].loading;

  async function submitNewMessage() {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || isLoading) return;

    setMessages(draft => [...draft,
      { role: 'user', content: trimmedMessage },
      { role: 'assistant', content: '', loading: true }
    ]);
    setNewMessage('');

    try {
      const { reply } = await api.sendMessage(trimmedMessage);
      setMessages(draft => {
        draft[draft.length - 1].content = reply || '';
        draft[draft.length - 1].loading = false;
      });
      if (autoRead && ttsSupported && reply) {
        try { if (speaking) cancel(); speak(reply); } catch (_) {}
      }
    } catch (err) {
      console.log(err);
      const detail = err?.data?.detail || err?.data?.message || err?.message || null;
      setMessages(draft => {
        draft[draft.length - 1].loading = false;
        draft[draft.length - 1].error = detail || 'Error generating the response';
      });
    }
  }

  return (
    <div className='relative grow flex flex-col gap-6 pt-6'>
      <div className='flex items-center gap-3 text-sm text-primary-blue/80'>
        {ttsSupported && (
          <button
            className={`px-3 py-1 rounded-md ring-1 ring-primary-blue ${autoRead ? 'bg-primary-blue/15' : 'bg-transparent'} hover:bg-primary-blue/10`}
            onClick={() => {
              if (speaking) cancel();
              setAutoRead(v => !v);
            }}
            title='Automatically read assistant replies'
          >
            {autoRead ? 'Auto-read: On' : 'Auto-read: Off'}
          </button>
        )}
      </div>
      {messages.length === 0 && (
        <div className='mt-3 font-urbanist text-primary-blue text-xl font-light space-y-2'>
          <p>👋 Welcome!</p>
          <p>I’m HopeAI — a virtual assistant focused on drug usage and prevention.</p>
          <p>Ask about substance use risks, prevention strategies, resources, or getting help.</p>
        </div>
      )}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
      />
      <ChatInput
        newMessage={newMessage}
        isLoading={isLoading}
        setNewMessage={setNewMessage}
        submitNewMessage={submitNewMessage}
      />
    </div>
  );
}

export default Chatbot;
