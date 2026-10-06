'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { API_URL } from '../../../../config/api';

export default function TeacherMessagesPage() {
  const [user, setUser]               = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv]   = useState(null);
  const [messages, setMessages]       = useState([]);
  const [text, setText]               = useState('');
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending]         = useState(false);
  const pollingRef = useRef(null);
  const endRef     = useRef(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res  = await fetch(`${API_URL}/api/messages/conversations/${user._id}`);
      const data = await res.json();
      if (data.success) setConversations(data.data || []);
    } catch (err) { console.error(err); }
  }, [user]);

  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId || !user?._id) return;
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(`${API_URL}/api/messages/${conversationId}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) { setMessages([]); return; }
      const data = await res.json().catch(() => null);
      if (!data || data.success === false) { setMessages([]); return; }
      setMessages(data.data || []);
      fetch(`${API_URL}/api/messages/${conversationId}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id }),
      }).catch(console.warn);
      fetchConversations();
    } catch (err) {
      if (err.name !== 'AbortError') console.warn(err);
      setMessages([]);
    } finally { clearTimeout(timeout); }
  }, [user, fetchConversations]);

  useEffect(() => { if (user) fetchConversations(); }, [user, fetchConversations]);

  useEffect(() => {
    if (!activeConv) return;
    setLoadingMsgs(true);
    fetchMessages(activeConv.conversationId).finally(() => setLoadingMsgs(false));
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => {
      if (document.visibilityState === 'visible')
        fetchMessages(activeConv.conversationId).catch(console.warn);
    }, 3000);
    return () => clearInterval(pollingRef.current);
  }, [activeConv, fetchMessages]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendReply = async () => {
    if (!text.trim() || !activeConv || sending) return;
    const messageText = text.trim();
    const tempId      = `temp-${Date.now()}`;
    setMessages(prev => [...prev, { _id: tempId, senderId: user._id, text: messageText, createdAt: new Date().toISOString() }]);
    setText('');
    setSending(true);
    const payload = { fromId: user._id, fromRole: 'teacher', toId: activeConv.other.userId, toRole: 'student', text: messageText };
    try {
      const res  = await fetch(`${API_URL}/api/messages`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.success === false) {
        setMessages(prev => prev.filter(m => m._id !== tempId));
        const msg = data?.message || `Error ${res.status}`;
        alert(msg === 'Route not found' ? 'Messaging service unavailable.' : msg);
      } else {
        await fetchMessages(data?.data?.conversationId || activeConv.conversationId);
        fetchConversations();
      }
    } catch {
      setMessages(prev => prev.filter(m => m._id !== tempId));
      alert('Failed to send. Check your connection.');
    } finally { setSending(false); }
  };

  const fmt     = (iso) => iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const initial = (name) => (name || '?').charAt(0).toUpperCase();

  if (!user) return (
    <div className="flex items-center justify-center py-20 text-gray-500 text-xs font-bold">
      Please login as a teacher to view messages.
    </div>
  );

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="font-extrabold text-[#0B0F28] text-sm sm:text-base">Messages</h2>
        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
            <span className="text-xs font-bold">No conversations yet</span>
          </div>
        ) : (
          <ul>
            {conversations.map(c => (
              <li key={c.conversationId}>
                <button
                  onClick={() => setActiveConv(c)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-100 hover:bg-gray-50
                    ${activeConv?.conversationId === c.conversationId ? 'bg-[#FF5500]/10 border-l-4 border-l-[#FF5500]' : ''}`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#0B0F28] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {initial(c.other?.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-[#0B0F28] truncate">{c.other?.name || 'Student'}</span>
                      {c.unreadCount > 0 && (
                        <span className="bg-[#FF5500] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5 font-medium">{c.lastMessage?.text || 'No messages'}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const chat = activeConv ? (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white">
        <button
          onClick={() => setActiveConv(null)}
          className="md:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          ←
        </button>
        <div className="w-8 h-8 rounded-full bg-[#0B0F28] text-white flex items-center justify-center font-bold text-xs shrink-0">
          {initial(activeConv.other?.name)}
        </div>
        <div>
          <div className="font-extrabold text-xs text-[#0B0F28]">{activeConv.other?.name}</div>
          <div className="text-[10px] text-gray-400 capitalize font-medium">{activeConv.other?.role}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F4F5F8] space-y-3">
        {loadingMsgs ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-[#FF5500] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs font-medium">No messages yet.</div>
        ) : messages.map(m => {
          const mine = String(m.senderId) === String(user._id);
          return (
            <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col gap-0.5 max-w-[80%] sm:max-w-[65%] ${mine ? 'items-end' : 'items-start'}`}>
                <div className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed wrap-break-word font-medium
                  ${mine ? 'bg-[#FF5500] text-white rounded-br-none' : 'bg-white text-[#0B0F28] border border-gray-200/80 shadow-sm rounded-bl-none'}`}>
                  {m.text}
                </div>
                <span className="text-[10px] text-gray-400 px-1">{fmt(m.createdAt)}</span>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-3.5 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
            rows={1}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs resize-none outline-none font-medium text-[#0B0F28]"
            placeholder="Write a reply... (Enter to send)"
          />
          <button
            onClick={sendReply}
            disabled={sending || !text.trim()}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs transition-colors disabled:opacity-40"
          >
            {sending ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6">
      <p className="text-xs font-bold text-[#0B0F28]">Select a conversation</p>
      <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Choose a student to start messaging</p>
    </div>
  );

  return (
    <div className="animate-fade-in font-sans">
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden flex">
        <div className={`flex-col shrink-0 border-r border-gray-200/80 w-full md:w-72 lg:w-80
          ${activeConv ? 'hidden md:flex' : 'flex'}`}>
          {sidebar}
        </div>
        <div className={`flex-col flex-1 min-w-0
          ${activeConv ? 'flex' : 'hidden md:flex'}`}>
          {chat}
        </div>
      </div>
    </div>
  );
}
