'use client';
import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '../../../../config/api';

export default function TeacherMessagesPage() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const pollingRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!activeConv) return;
    fetchMessages(activeConv.conversationId).catch(e => console.warn('[messages] fetchMessages uncaught:', e));

    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => fetchMessages(activeConv.conversationId).catch(e => console.warn('[messages] poll fetchMessages uncaught:', e)), 2500);
    return () => clearInterval(pollingRef.current);
  }, [activeConv]);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages/conversations/${user._id}`);
      const data = await res.json();
      if (data.success) setConversations(data.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(`${API_URL}/api/messages/${conversationId}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) {
        console.warn('[messages] fetchMessages (teacher) non-OK', res.status);
        setMessages([]);
        return;
      }

      const data = await res.json().catch(() => null);
      if (!data || data.success === false) {
        console.warn('[messages] fetchMessages (teacher) invalid response', data);
        setMessages([]);
        return;
      }

      setMessages(data.data || []);

      // mark as read (best-effort)
      fetch(`${API_URL}/api/messages/${conversationId}/read`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user._id })
      }).catch(e => console.warn('[messages] markAsRead failed', e));

      fetchConversations().catch(e => console.warn('[messages] fetchConversations failed', e));
    } catch (err) {
      if (err.name === 'AbortError') console.warn('[messages] fetchMessages (teacher) aborted');
      else console.warn('[messages] fetchMessages (teacher) error', err);
      setMessages([]);
    } finally {
      clearTimeout(timeout);
    }
  };

  const sendReply = async () => {
    if (!text.trim() || !activeConv) return;
    const messageText = text.trim();
    const tempId = `temp-${Date.now()}`;
    const tempMessage = { _id: tempId, senderId: user._id, text: messageText, createdAt: new Date().toISOString(), read: false };

    // optimistic
    setMessages(prev => [...prev, tempMessage]);
    setText('');
    setSending(true);

    const payload = {
      fromId: user._id,
      fromRole: 'teacher',
      toId: activeConv.other.userId,
      toRole: 'student',
      text: messageText
    };

    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.success === false) {
        setMessages(prev => prev.filter(m => m._id !== tempId));
        const msg = data?.message || `Server error ${res.status}`;
        console.warn('[messages] reply server error:', res.status, data);
        if (msg === 'Route not found') {
          window.alert('Messaging service unavailable. If you are testing locally, start the backend (server). If you are on the live site, redeploy the API.');
        } else {
          window.alert(msg);
        }
      } else {
        const convId = data?.data?.conversationId || activeConv?.conversationId;
        if (convId) {
          await fetchMessages(convId);
        }
        fetchConversations();
      }
    } catch (err) {
      console.error('[messages] initial reply failed, will retry once:', err);

      // keep optimistic message, attempt single retry
      try {
        const retryRes = await fetch(`${API_URL}/api/messages`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });

        const retryData = await retryRes.json().catch(() => null);

        if (!retryRes.ok || retryData?.success === false) {
          setMessages(prev => prev.filter(m => m._id !== tempId));
          const msg = retryData?.message || `Server error ${retryRes.status}`;
          console.warn('[messages] reply retry failed:', retryRes.status, retryData);
          if (msg === 'Route not found') {
            window.alert('Messaging service unavailable. If you are testing locally, start the backend (server). If you are on the live site, redeploy the API.');
          } else {
            window.alert(msg);
          }
        } else {
          await fetchMessages(retryData.data.conversationId);
          fetchConversations();
        }
      } catch (retryErr) {
        console.error('[messages] reply retry failed:', retryErr);
        setMessages(prev => prev.filter(m => m._id !== tempId));
        try {
          const ping = await fetch(`${API_URL}/`, { cache: 'no-store' });
          if (!ping.ok) {
            window.alert(`Messaging server reachable but returned ${ping.status}. If you are testing locally start the backend; if on production redeploy the API.`);
          } else {
            window.alert(`Failed to send reply — server returned an unexpected error. Check console for details: ${retryErr.message || retryErr}`);
          }
        } catch (pingErr) {
          console.warn('[messages] ping failed:', pingErr);
          window.alert('Unable to reach messaging server. Please start the backend or check your network connection.');
        }
      }
    } finally {
      setSending(false);
    }
  };

  if (!user) return (
    <div className="p-6">Please login as a teacher to view messages.</div>
  );

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white border border-gray-200 rounded-lg p-4 h-[70vh] overflow-y-auto">
        <h3 className="font-semibold mb-3">Inbox</h3>
        {conversations.length === 0 && <p className="text-sm text-gray-500">No conversations yet</p>}
        <ul className="space-y-2">
          {conversations.map(c => (
            <li key={c.conversationId} onClick={() => setActiveConv(c)} className={`p-2 rounded hover:bg-gray-50 cursor-pointer flex items-center justify-between ${activeConv?.conversationId === c.conversationId ? 'bg-blue-50' : ''}`}>
              <div>
                <div className="font-medium text-sm">{c.other?.name || 'Student'}</div>
                <div className="text-xs text-gray-500">{c.lastMessage?.text?.slice(0, 60) || 'No messages'}</div>
              </div>
              <div className="text-xs text-gray-400">{c.unreadCount > 0 && (<span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{c.unreadCount}</span>)}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-4 h-[70vh] flex flex-col">
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation to read and reply</div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold">{(activeConv.other.name || '?').charAt(0)}</div>
              <div>
                <div className="font-semibold">{activeConv.other.name}</div>
                <div className="text-xs text-gray-500">{activeConv.other.role}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 border border-gray-100 rounded-lg bg-gray-50">
              {messages.length === 0 && <div className="text-sm text-gray-500">No messages</div>}
              {messages.map(m => (
                <div key={m._id} className={`mb-3 flex ${String(m.senderId) === String(user._id) ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${String(m.senderId) === String(user._id) ? 'bg-blue-900 text-white' : 'bg-white text-gray-800 border'} max-w-[75%] p-3 rounded-lg`}>{m.text}</div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="mt-4">
              <div className="flex gap-2">
                <input value={text} onChange={e => setText(e.target.value)} className="flex-1 border border-gray-200 rounded px-3 py-2" placeholder="Write a reply..." />
                <button onClick={sendReply} disabled={sending} className={`px-4 py-2 rounded text-white ${sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900'}`}>
                  {sending ? 'Sending...' : 'Reply'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
