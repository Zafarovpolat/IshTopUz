
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useState, useTransition, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createProject } from '@/app/actions';
import { useAuth } from '@/hooks/use-auth';
import { projectSchema } from '@/lib/schema';
import { Loader2, UploadCloud, X, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type ProjectFormValues = z.infer<typeof projectSchema>;

export function CreateProjectForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      skills: '',
      budgetType: 'fixed',
      budgetAmount: undefined,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files as FileList)]);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }

  const onSubmit = (data: ProjectFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Вы должны быть авторизованы для создания проекта.' });
      return;
    }

    // TODO: Add file upload logic here before submitting.
    // For now, files are ignored.

    startTransition(async () => {
      const result = await createProject(user.uid, data);
      if (result.success) {
        toast({ title: 'Успешно!', description: result.message });
        form.reset();
        setFiles([]);
        onFormSubmit();
      } else {
        toast({ variant: 'destructive', title: 'Ошибка', description: result.message });
        if (result.errors) {
            console.log(result.errors);
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название проекта</FormLabel>
              <FormControl><Input placeholder="Например, 'Разработать логотип для кофейни'" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подробное описание задачи</FormLabel>
              <FormControl><Textarea placeholder="Опишите, что именно нужно сделать, какие цели вы преследуете..." rows={6} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Требуемые навыки</FormLabel>
              <FormControl><Input placeholder="Дизайн логотипа, Adobe Illustrator, Брендинг" {...field} /></FormControl>
              <FormDescription>Перечислите ключевые навыки через запятую.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="budgetType"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel>Тип оплаты</FormLabel>
                <FormControl>
                    <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                    >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="fixed" id="fixed" /></FormControl>
                        <FormLabel className="font-normal" htmlFor="fixed">Фиксированный</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="hourly" id="hourly" /></FormControl>
                        <FormLabel className="font-normal" htmlFor="hourly">Почасовая</FormLabel>
                    </FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="budgetAmount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Бюджет (UZS)</FormLabel>
                    <FormControl><Input type="number" placeholder="500000" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
         <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Срок выполнения</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "d MMMM yyyy", { locale: ru })
                      ) : (
                        <span>Выберите дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
            <FormLabel>Файлы и материалы</FormLabel>
            <div 
                className="mt-2 relative flex justify-center items-center h-32 w-full border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    disabled={isUploading}
                />
                {isUploading ? (
                    <div className="text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2 text-sm text-muted-foreground">Загрузка...</p>
                    </div>
                ) : (
                     <div className="text-center">
                      <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Нажмите или перетащите файлы сюда
                      </p>
                      <p className="text-xs text-muted-foreground/80">До 5 файлов, не более 10MB каждый</p>
                    </div>
                )}
            </div>
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                           <div className="flex items-center gap-2">
                               <FileIcon className="h-5 w-5 text-muted-foreground" />
                               <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                           </div>
                           <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                               <X className="h-4 w-4" />
                           </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <Button type="submit" className="w-full" disabled={isPending || isUploading}>
          {isPending ? 'Публикация...' : 'Опубликовать проект'}
        </Button>
      </form>
    </Form>
  );
}
