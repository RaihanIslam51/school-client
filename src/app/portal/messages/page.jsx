'use client';
import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '../../../../config/api';

export default function MessagesPage() {
  const [user, setUser] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const pollingRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const fetchTeachers = React.useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/teachers`);
      const data = await res.json();
      if (data.success !== false) setTeachers(data.data || data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchConversations = React.useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`${API_URL}/api/messages/conversations/${user._id}`);
      const data = await res.json();
      if (data.success) setConversations(data.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [user?._id]);

  const fetchMessages = React.useCallback(async (conversationId) => {
    if (!conversationId) {
      console.warn('[messages] fetchMessages called without conversationId');
      return;
    }

    if (!API_URL) {
      console.warn('[messages] API_URL not configured');
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      const res = await fetch(`${API_URL}/api/messages/${conversationId}`, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        console.warn('[messages] fetchMessages non-OK status', res.status);
        setMessages([]);
        return;
      }

      const data = await res.json().catch(() => null);
      if (!data || data.success === false) {
        console.warn('[messages] fetchMessages invalid JSON/response', data);
        setMessages([]);
        return;
      }

      setMessages(data.data || []);

      // mark as read (best-effort)
      if (user?._id) {
        fetch(`${API_URL}/api/messages/${conversationId}/read`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id })
        }).catch(e => console.warn('[messages] markAsRead failed', e));
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn('[messages] fetchMessages aborted (timeout) for', conversationId);
      } else {
        console.warn('[messages] fetchMessages network/error:', err);
      }
      // show empty state rather than throwing
      setMessages([]);
    } finally {
      clearTimeout(timeout);
    }
  }, [user?._id]);

  const filteredTeachers = React.useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    return (teachers || [])
      .slice()
      .sort((a, b) => (a?.name || a?.email || '').localeCompare(b?.name || b?.email || '', undefined, { sensitivity: 'base' }))
      .filter(t => {
        if (!q) return true;
        const hay = `${t?.name || ''} ${t?.email || ''} ${t?.subject || ''}`.toLowerCase();
        return hay.includes(q);
      });
  }, [teachers, query]);

  React.useEffect(() => {
    // reset highlighted index when the list or query changes
    setHighlightedIndex(-1);
  }, [query, filteredTeachers.length]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, filteredTeachers.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const t = filteredTeachers[highlightedIndex >= 0 ? highlightedIndex : 0];
      if (t) {
        openChatWith(t);
        setQuery('');
        setHighlightedIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setQuery('');
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchTeachers();
    fetchConversations();
  }, [user, fetchTeachers, fetchConversations]);

  useEffect(() => {
    if (!activeConv) return;

    // call and guard against unhandled promise rejections
    fetchMessages(activeConv.conversationId).catch(e => console.warn('[messages] fetchMessages uncaught:', e));

    // start polling (wrap calls to avoid unhandled rejects)
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => {
      fetchMessages(activeConv.conversationId).catch(e => console.warn('[messages] poll fetchMessages uncaught:', e));
      fetchConversations().catch ? fetchConversations().catch(e => console.warn('[messages] poll fetchConversations uncaught:', e)) : null;
    }, 2500);

    return () => clearInterval(pollingRef.current);
  }, [activeConv, fetchMessages, fetchConversations]);

  useEffect(() => {
    // scroll to bottom on messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openChatWith = async (teacher) => {
    // find existing conversation
    const conv = conversations.find(c => c.other?.userId === teacher._id);
    if (conv) {
      setActiveConv(conv);
      return;
    }

    // create empty conversation by sending an initial system message (or wait until student sends first message)
    setActiveConv({ conversationId: [user._id, teacher._id].sort().join('_'), other: { userId: teacher._id, name: teacher.name, role: 'teacher' } });
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!text.trim() || !activeConv) return;

    const messageText = text.trim();
    const tempId = `temp-${Date.now()}`;
    const tempMessage = { _id: tempId, senderId: user._id, text: messageText, createdAt: new Date().toISOString(), read: false };

    // Optimistic UI update
    setMessages(prev => [...prev, tempMessage]);
    setText('');
    setSending(true);

    const payload = {
      fromId: user._id,
      fromRole: 'student',
      toId: activeConv.other.userId,
      toRole: 'teacher',
      text: messageText
    };

    console.log('[messages] sending (student):', payload);

    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // always attempt to parse JSON response from server
      const data = await res.json().catch(() => null);

      if (!res.ok || data?.success === false) {
        // rollback optimistic message and show server message when available
        setMessages(prev => prev.filter(m => m._id !== tempId));
        const msg = data?.message || `Server error ${res.status}`;
        console.warn('[messages] server error:', res.status, data);
        if (msg === 'Route not found') {
          window.alert('Messaging service unavailable. If you are testing locally, start the backend (server). If you are on the live site, redeploy the API.');
        } else {
          window.alert(msg);
        }
      } else {
        const conv = data?.data;
        const convId = conv?.conversationId || activeConv?.conversationId || [user._id, activeConv?.other?.userId].sort().join('_');
        setActiveConv({ conversationId: convId, other: { userId: activeConv.other.userId, name: activeConv.other.name, role: 'teacher' } });
        // refresh from server (replaces optimistic message with canonical data)
        await fetchMessages(convId);
        await fetchConversations();
      }
    } catch (err) {
      console.error('[messages] initial send failed, will retry once:', err);

      // Do NOT remove optimistic message yet — attempt single retry
      try {
        const retryRes = await fetch(`${API_URL}/api/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const retryData = await retryRes.json().catch(() => null);

        if (!retryRes.ok || retryData?.success === false) {
          // rollback optimistic message after retry failed
          setMessages(prev => prev.filter(m => m._id !== tempId));
          const msg = retryData?.message || `Server error ${retryRes.status}`;
          console.warn('[messages] retry failed:', retryRes.status, retryData);
          if (msg === 'Route not found') {
            window.alert('Messaging service unavailable. If you are testing locally, start the backend (server). If you are on the live site, redeploy the API.');
          } else {
            window.alert(msg);
          }
        } else {
          // retry succeeded — sync state
          const conv = retryData.data;
          setActiveConv({ conversationId: conv.conversationId, other: { userId: activeConv.other.userId, name: activeConv.other.name, role: 'teacher' } });
          await fetchMessages(conv.conversationId);
          await fetchConversations();
        }
      } catch (retryErr) {
        console.error('[messages] retry attempt failed:', retryErr);
        // rollback optimistic message after retry failure
        setMessages(prev => prev.filter(m => m._id !== tempId));

        // ping server to determine reachability
        try {
          const ping = await fetch(`${API_URL}/`, { cache: 'no-store' });
          if (!ping.ok) {
            window.alert(`Messaging server reachable but returned ${ping.status}. If you are testing locally start the backend; if on production redeploy the API.`);
          } else {
            window.alert(`Failed to send message — server returned an unexpected error. Check console for details: ${retryErr.message || retryErr}`);
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

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Messages</h2>
        <p className="mt-4 text-sm text-gray-600">Please login (student) to use messaging.</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: teacher list with search/suggestions */}
      <div className="md:col-span-1 bg-white border border-gray-200 rounded-lg p-4 h-[70vh] overflow-y-auto">
        <h3 className="font-semibold mb-3">Teachers</h3>

        <div className="mb-3">
          <input
            ref={searchInputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search teachers (name, subject, email)..."
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            aria-label="Search teachers"
          />
          <div className="mt-2 text-xs text-gray-500">Suggestions (alphabetical)</div>
        </div>

        {filteredTeachers.length === 0 && <p className="text-sm text-gray-500">{teachers.length === 0 ? 'No teachers found' : 'No teachers match your search'}</p>}

        <ul className="space-y-2" role="listbox" aria-label="Teacher suggestions">
          {filteredTeachers.map((t, idx) => (
            <li
              key={t._id}
              role="option"
              aria-selected={activeConv?.other?.userId === t._id}
              onMouseEnter={() => setHighlightedIndex(idx)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              onClick={() => { openChatWith(t); setQuery(''); }}
              className={`p-2 rounded hover:bg-gray-50 cursor-pointer flex items-center justify-between ${activeConv?.other?.userId === t._id ? 'bg-blue-50 border-blue-100' : (highlightedIndex === idx ? 'bg-gray-100' : '')}`}
            >
              <div>
                <div className="font-medium text-sm">{t.name}</div>
                <div className="text-xs text-gray-500">{t.subject || t.email}</div>
              </div>
              <div className="text-xs text-gray-400">▶</div>
            </li>
          ))}
        </ul>

        <hr className="my-4" />
        <h4 className="font-semibold mb-2">Your Conversations</h4>
        {conversations.length === 0 && <p className="text-sm text-gray-500">No conversations yet</p>}
        <ul className="space-y-2">
          {conversations.map(conv => (
            <li key={conv.conversationId} onClick={() => setActiveConv(conv)} className={`p-2 rounded hover:bg-gray-50 cursor-pointer flex items-center justify-between ${activeConv?.conversationId === conv.conversationId ? 'bg-blue-50' : ''}`}>
              <div>
                <div className="font-medium text-sm">{conv.other?.name || 'Unknown'}</div>
                <div className="text-xs text-gray-500">{conv.lastMessage?.text?.slice(0, 60) || 'No messages yet'}</div>
              </div>
              <div className="text-xs text-gray-400">{conv.unreadCount > 0 && (<span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{conv.unreadCount}</span>)}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: chat area (spans 2 cols) */}
      <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-4 h-[70vh] flex flex-col">
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">Select a teacher or conversation to start messaging</div>
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
              {messages.length === 0 && <div className="text-sm text-gray-500">No messages yet — send the first message.</div>}
              {messages.map(m => {
                const mine = m.senderId === user._id || m.senderId === user._id;
                return (
                  <div key={m._id} className={`mb-3 flex ${String(m.senderId) === String(user._id) ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${String(m.senderId) === String(user._id) ? 'bg-blue-900 text-white' : 'bg-white text-gray-800 border'} max-w-[75%] p-3 rounded-lg shadow-sm`}>{m.text}</div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-4">
              <div className="flex gap-2">
                <input value={text} onChange={e => setText(e.target.value)} className="flex-1 border border-gray-200 rounded px-3 py-2" placeholder="Type a message..." />
                <button onClick={sendMessage} disabled={sending} className={`px-4 py-2 rounded text-white ${sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900'}`}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
