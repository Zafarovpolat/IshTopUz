
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useState, useTransition, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { portfolioItemSchema } from '@/lib/schema';
import { addPortfolioItem } from '@/app/actions';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, UploadCloud, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

type PortfolioFormValues = z.infer<typeof portfolioItemSchema>;

export function PortfolioForm({ userId, onFormSubmit }: { userId: string, onFormSubmit: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      projectUrl: '',
      tags: '',
    },
  });
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Пожалуйста, выберите изображение.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Размер файла не должен превышать 5MB.' });
      return;
    }

    setIsUploading(true);
    toast({ title: 'Загрузка изображения...', description: 'Пожалуйста, подождите.' });

    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `portfolio/${userId}/${fileName}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setImageUrl(downloadURL);
      form.setValue('imageUrl', downloadURL, { shouldValidate: true });
      toast({ title: 'Успешно', description: 'Изображение загружено!' });
    } catch (error: any) {
      console.error('Upload failed', error);
      toast({ variant: 'destructive', title: 'Ошибка загрузки', description: error.message });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };


  const onSubmit = (data: PortfolioFormValues) => {
    startTransition(async () => {
      const result = await addPortfolioItem(userId, data);
      if (result.success) {
        toast({ title: 'Успешно!', description: result.message });
        form.reset();
        setImageUrl(null);
        onFormSubmit();
      } else {
        toast({ variant: 'destructive', title: 'Ошибка', description: result.message });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Изображение проекта</FormLabel>
              <FormControl>
                <div 
                    className="relative flex justify-center items-center h-48 w-full border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg"
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2 text-sm text-muted-foreground">Загрузка...</p>
                    </div>
                  )}
                  {imageUrl ? (
                    <>
                      <Image
                        src={imageUrl}
                        alt="Предпросмотр"
                        fill
                        className="object-cover rounded-lg"
                      />
                       <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 h-7 w-7 z-20"
                            onClick={(e) => {
                                e.stopPropagation();
                                setImageUrl(null);
                                form.setValue('imageUrl', '');
                            }}
                       >
                           <X className="h-4 w-4"/>
                       </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Нажмите, чтобы загрузить, или перетащите файл
                      </p>
                      <p className="text-xs text-muted-foreground/80">PNG, JPG, до 5MB</p>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заголовок проекта</FormLabel>
              <FormControl><Input placeholder="Дизайн мобильного приложения для финтеха" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl><Textarea placeholder="Опишите задачу, процесс и результат работы..." rows={4} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ссылка на проект (необязательно)</FormLabel>
              <FormControl><Input placeholder="https://behance.net/..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Технологии и теги</FormLabel>
              <FormControl><Input placeholder="Figma, UI/UX, Prototyping" {...field} /></FormControl>
              <FormDescription>Перечислите ключевые технологии через запятую.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending || isUploading}>
          {isPending ? 'Добавление...' : 'Добавить работу'}
        </Button>
      </form>
    </Form>
  );
}
