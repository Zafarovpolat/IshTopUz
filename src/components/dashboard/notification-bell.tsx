
'use client';

import { useState, useEffect } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Notification {
    id: string;
    message: string;
    entityId: string;
    isRead: boolean;
    createdAt: any;
}

const formatNotificationDate = (timestamp: any) => {
    if (!timestamp) return 'только что';
    try {
        const date = timestamp.toDate();
        return date.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        console.error('Error formatting date:', e);
        return 'недавно';
    }
};

export function NotificationBell({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        };

        const q = query(
            collection(db, 'notifications'),
            where('recipientId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedNotifications: Notification[] = [];
            let unread = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!data.isRead) {
                    unread++;
                }
                fetchedNotifications.push({ id: doc.id, ...data } as Notification);
            });
            setNotifications(fetchedNotifications);
            setUnreadCount(unread);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching notifications: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
                    )}
                    <span className="sr-only">Уведомления</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="p-4 font-medium border-b">
                    Уведомления
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <Link key={notif.id} href={`/marketplace/jobs/${notif.entityId}`} className="block">
                                <div className={`p-4 hover:bg-muted ${!notif.isRead ? 'bg-primary/10' : ''}`}>
                                    <p className="text-sm">{notif.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatNotificationDate(notif.createdAt)}
                                    </p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center p-4">
                            Новых уведомлений нет.
                        </p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
