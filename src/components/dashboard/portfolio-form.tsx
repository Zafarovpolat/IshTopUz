
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
import { Loader2, UploadCloud, X, Image as ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PortfolioFormValues = z.infer<typeof portfolioItemSchema>;

const uploadFile = async (file: File, path: string): Promise<string> => {
    if (!file.type.startsWith('image/')) throw new Error('Пожалуйста, выберите изображение.');
    if (file.size > 5 * 1024 * 1024) throw new Error('Размер файла не должен превышать 5MB.');

    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
};

export function PortfolioForm({ userId, onFormSubmit }: { userId: string, onFormSubmit: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: {
      title: '',
      description: '',
      mainImageUrl: '',
      projectUrl: '',
      technologies: '',
      category: undefined,
      galleryImageUrls: [],
    },
  });
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'mainImageUrl' | 'galleryImageUrls') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    toast({ title: 'Загрузка изображений...', description: 'Пожалуйста, подождите.' });

    try {
        if (fieldName === 'mainImageUrl') {
            const url = await uploadFile(files[0], `portfolio/${userId}`);
            form.setValue('mainImageUrl', url, { shouldValidate: true });
        } else {
            const currentGallery = form.getValues('galleryImageUrls') || [];
            if (currentGallery.length + files.length > 4) {
                 toast({ variant: 'destructive', title: 'Ошибка', description: 'Можно загрузить не более 4 изображений в галерею.' });
                 setIsUploading(false);
                 return;
            }
            const urls = await Promise.all(
                Array.from(files).map(file => uploadFile(file, `portfolio-gallery/${userId}`))
            );
            form.setValue('galleryImageUrls', [...currentGallery, ...urls], { shouldValidate: true });
        }
        toast({ title: 'Успешно', description: 'Изображения загружены!' });
    } catch (error: any) {
        console.error('Upload failed', error);
        toast({ variant: 'destructive', title: 'Ошибка загрузки', description: error.message });
    } finally {
        setIsUploading(false);
        e.target.value = ''; // Reset file input
    }
  };
  
  const removeGalleryImage = (index: number) => {
    const currentImages = form.getValues('galleryImageUrls') || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue('galleryImageUrls', newImages);
  }

  const onSubmit = (data: PortfolioFormValues) => {
    startTransition(async () => {
      const result = await addPortfolioItem(userId, data);
      if (result.success) {
        toast({ title: 'Успешно!', description: result.message });
        form.reset();
        onFormSubmit();
      } else {
        toast({ variant: 'destructive', title: 'Ошибка', description: result.message });
      }
    });
  };
  
  const mainImageUrl = form.watch('mainImageUrl');
  const galleryImageUrls = form.watch('galleryImageUrls') || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="mainImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Основное изображение (обложка)</FormLabel>
              <FormControl>
                 <ImageUpload
                    imageUrl={mainImageUrl}
                    onImageChange={(e) => handleImageUpload(e, 'mainImageUrl')}
                    onImageRemove={() => form.setValue('mainImageUrl', '')}
                    isUploading={isUploading}
                 />
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                      <SelectTrigger><SelectValue placeholder="Выберите категорию" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                      <SelectItem value="Веб-разработка">Веб-разработка</SelectItem>
                      <SelectItem value="Дизайн">Дизайн</SelectItem>
                      <SelectItem value="Копирайтинг">Копирайтинг</SelectItem>
                      <SelectItem value="SMM">SMM</SelectItem>
                      <SelectItem value="Другое">Другое</SelectItem>
                  </SelectContent>
              </Select>
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
          name="galleryImageUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Галерея (до 4 изображений)</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {galleryImageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image src={url} alt={`Gallery image ${index + 1}`} fill className="object-cover rounded-md" />
                      <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 z-10" onClick={() => removeGalleryImage(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {galleryImageUrls.length < 4 && (
                    <ImageUpload
                      onImageChange={(e) => handleImageUpload(e, 'galleryImageUrls')}
                      isUploading={isUploading}
                      isMultiple
                    />
                  )}
                </div>
              </FormControl>
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
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Технологии</FormLabel>
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

function ImageUpload({ imageUrl, isUploading, onImageChange, onImageRemove, isMultiple }: {
    imageUrl?: string | null;
    isUploading: boolean;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImageRemove?: () => void;
    isMultiple?: boolean;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div 
            className="relative flex justify-center items-center aspect-square w-full border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImageChange}
            className="hidden"
            accept="image/png,image/jpeg,image/jpg"
            disabled={isUploading}
            multiple={isMultiple}
          />
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {imageUrl ? (
            <>
              <Image src={imageUrl} alt="Предпросмотр" fill className="object-cover rounded-lg" />
              {onImageRemove && 
                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 z-20"
                    onClick={(e) => { e.stopPropagation(); onImageRemove(); }}>
                   <X className="h-4 w-4"/>
               </Button>
              }
            </>
          ) : (
            <div className="text-center p-2">
              {isMultiple ? <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" /> : <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />}
              <p className="mt-2 text-xs text-muted-foreground">
                {isMultiple ? 'Добавить' : 'Загрузить обложку'}
              </p>
            </div>
          )}
        </div>
    );
}

