'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Search, Send, Loader2 } from 'lucide-react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { sendMessage, markConversationRead } from './actions';

interface Conversation {
  id: string;
  participants: string[];
  participantsInfo: Record<string, { name: string; avatar: string }>;
  lastMessage?: string;
  lastMessageAt?: { toDate?: () => Date } | null;
  lastSenderId?: string;
  unreadCount?: Record<string, number>;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: { toDate?: () => Date } | null;
}

function formatTime(ts: Message['createdAt'] | Conversation['lastMessageAt']) {
  if (!ts) return '';
  try {
    const d = ts.toDate?.() ?? null;
    if (!d) return '';
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function MessagesPage() {
  const { user } = useAuth();
  const userId = user?.uid;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Подписка на conversations.
  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Conversation[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Conversation, 'id'>),
        }));
        list.sort((a, b) => {
          const ta = a.lastMessageAt?.toDate?.()?.getTime?.() ?? 0;
          const tb = b.lastMessageAt?.toDate?.()?.getTime?.() ?? 0;
          return tb - ta;
        });
        setConversations(list);
        setLoadingConvs(false);
        if (!selectedId && list.length) setSelectedId(list[0].id);
      },
      (err) => {
        console.error('[conversations onSnapshot]', err);
        setLoadingConvs(false);
      }
    );
    return () => unsub();
  }, [userId, selectedId]);

  // Подписка на сообщения выбранного чата.
  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    const q = query(
      collection(db, 'conversations', selectedId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(200)
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, 'id'>) }))
      );
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      });
    });
    // Отметить как прочитанное.
    markConversationRead(selectedId).catch(() => {});
    return () => unsub();
  }, [selectedId]);

  const selectedConv = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [conversations, selectedId]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const s = search.toLowerCase();
    return conversations.filter((c) => {
      const other = c.participants.find((p) => p !== userId);
      const name = other ? c.participantsInfo?.[other]?.name ?? '' : '';
      return name.toLowerCase().includes(s) || (c.lastMessage ?? '').toLowerCase().includes(s);
    });
  }, [conversations, search, userId]);

  async function onSend() {
    if (!text.trim() || !selectedId || sending) return;
    setSending(true);
    const res = await sendMessage(selectedId, text.trim());
    if (res.success) setText('');
    setSending(false);
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
        Войдите, чтобы открыть чаты.
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.24))]">
      {/* Sidebar */}
      <div className="w-full md:w-[350px] flex-shrink-0 flex flex-col border-r">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Сообщения</h1>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по чатам..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="flex justify-center p-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center p-6">
              Пока нет чатов.
            </p>
          ) : (
            <div className="flex flex-col">
              {filtered.map((c) => {
                const otherId = c.participants.find((p) => p !== userId) ?? '';
                const info = c.participantsInfo?.[otherId];
                const unread = c.unreadCount?.[userId] ?? 0;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      'flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left',
                      selectedId === c.id && 'bg-muted'
                    )}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={info?.avatar} alt={info?.name} />
                      <AvatarFallback>{info?.name?.charAt(0) ?? '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{info?.name ?? 'Пользователь'}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {c.lastMessage || 'Нет сообщений'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end text-xs text-muted-foreground gap-1">
                      <span>{formatTime(c.lastMessageAt)}</span>
                      {unread > 0 && (
                        <div className="w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs">
                          {unread}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {!selectedConv ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Выберите чат
          </div>
        ) : (
          <>
            <header className="flex items-center gap-4 p-4 border-b">
              {(() => {
                const otherId = selectedConv.participants.find((p) => p !== userId) ?? '';
                const info = selectedConv.participantsInfo?.[otherId];
                return (
                  <>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={info?.avatar} alt={info?.name} />
                      <AvatarFallback>{info?.name?.charAt(0) ?? '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{info?.name ?? 'Пользователь'}</p>
                    </div>
                  </>
                );
              })()}
            </header>

            <ScrollArea className="flex-1 p-4 bg-muted/20">
              <div ref={scrollRef} className="flex flex-col gap-4">
                {messages.map((m) => {
                  const self = m.senderId === userId;
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        'flex items-end gap-2 max-w-[75%]',
                        self ? 'self-end flex-row-reverse' : 'self-start'
                      )}
                    >
                      <div
                        className={cn(
                          'rounded-lg px-4 py-2 text-sm',
                          self
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-background border rounded-bl-none'
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">{m.text}</p>
                        <p
                          className={cn(
                            'text-xs mt-1',
                            self ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          )}
                        >
                          {formatTime(m.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <footer className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSend();
                }}
                className="relative"
              >
                <Input
                  placeholder="Напишите сообщение..."
                  className="pr-12"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={sending}
                  maxLength={2000}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button type="submit" variant="ghost" size="icon" disabled={sending || !text.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
