
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { profileFreelancerSchema, profileClientSchema } from '@/lib/schema';
import { updateProfile } from '@/app/actions';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';

type FreelancerFormValues = z.infer<typeof profileFreelancerSchema>;
type ClientFormValues = z.infer<typeof profileClientSchema>;

function FreelancerProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FreelancerFormValues>({
    resolver: zodResolver(profileFreelancerSchema),
    defaultValues: {
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      location: user.profile?.city || '',
      specialization: user.freelancerProfile?.specialization || '',
      hourlyRate: user.freelancerProfile?.hourlyRate,
      skills: (user.freelancerProfile?.skills || []).join(', '),
      experience: user.freelancerProfile?.experience || '1-3-years',
      availability: user.freelancerProfile?.isAvailable ? 'full-time' : 'project-based',
      about: user.freelancerProfile?.description || '',
      languages: (user.profile?.languages || []).join(', '),
    },
  });
  
  const onSubmit = (data: FreelancerFormValues) => {
    startTransition(async () => {
      const result = await updateProfile(user.uid, 'freelancer', data);
      if (result.success) {
        toast({ title: "Успешно", description: result.message });
      } else {
        toast({ variant: "destructive", title: "Ошибка", description: result.message });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
            <CardDescription>Ваши личные данные, которые будут видны другим пользователям.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profile?.avatar} />
                <AvatarFallback>{user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Загрузить фото
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="firstName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="lastName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фамилия</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField name="location" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Местоположение</FormLabel>
                    <FormControl><Input placeholder="Ташкент, Узбекистан" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Профессиональная информация</CardTitle>
            <CardDescription>Расскажите о своей экспертизе, чтобы заказчики могли вас найти.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField control={form.control} name="specialization" render={({ field }) => (
                <FormItem>
                  <FormLabel>Специализация</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Выберите специализацию" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="web-development">Веб-разработка</SelectItem>
                        <SelectItem value="mobile-development">Мобильная разработка</SelectItem>
                        <SelectItem value="design">Дизайн (UI/UX)</SelectItem>
                        <SelectItem value="graphic-design">Графический дизайн</SelectItem>
                        <SelectItem value="copywriting">Копирайтинг и контент</SelectItem>
                        <SelectItem value="smm">SMM и маркетинг</SelectItem>
                        <SelectItem value="seo">SEO-оптимизация</SelectItem>
                        <SelectItem value="translation">Переводы</SelectItem>
                        <SelectItem value="video-editing">Видеомонтаж и анимация</SelectItem>
                        <SelectItem value="other">Другое</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
                )} />
                <FormField control={form.control} name="hourlyRate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Часовая ставка (UZS)</FormLabel>
                    <FormControl><Input type="number" placeholder="100000" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
             </div>
             <FormField control={form.control} name="skills" render={({ field }) => (
                <FormItem>
                  <FormLabel>Навыки (теги)</FormLabel>
                  <FormControl><Input placeholder="Например: React, Node.js, Figma" {...field} /></FormControl>
                   <FormDescription>Перечислите навыки через запятую.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Опыт работы</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Выберите опыт" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="less-than-1">Менее 1 года</SelectItem>
                            <SelectItem value="1-3-years">1-3 года</SelectItem>
                            <SelectItem value="more-than-3">Более 3 лет</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="availability" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Доступность</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Выберите доступность" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="full-time">Полная занятость</SelectItem>
                            <SelectItem value="part-time">Частичная</SelectItem>
                            <SelectItem value="project-based">По проектам</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>
            <FormField control={form.control} name="about" render={({ field }) => (
                <FormItem>
                    <FormLabel>О себе</FormLabel>
                    <FormControl><Textarea placeholder="Расскажите о своих достижениях..." rows={5} {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="languages" render={({ field }) => (
                <FormItem>
                    <FormLabel>Языки</FormLabel>
                    <FormControl><Input placeholder="Узбекский, Русский, Английский" {...field} /></FormControl>
                    <FormDescription>Перечислите языки через запятую.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>{isPending ? 'Сохранение...' : 'Сохранить изменения'}</Button>
        </div>
      </form>
    </Form>
  );
}

function ClientProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(profileClientSchema),
    defaultValues: {
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      companyName: user.clientProfile?.companyName || '',
      companySize: user.clientProfile?.companySize || '2-10',
      industry: user.clientProfile?.industry || '',
      website: user.clientProfile?.website || '',
    },
  });

  const onSubmit = (data: ClientFormValues) => {
    startTransition(async () => {
      const result = await updateProfile(user.uid, 'client', data);
      if (result.success) {
        toast({ title: "Успешно", description: result.message });
      } else {
        toast({ variant: "destructive", title: "Ошибка", description: result.message });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Личная информация</CardTitle>
            <CardDescription>Ваши контактные данные.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profile?.avatar} />
                <AvatarFallback>{user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Загрузить фото
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="firstName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="lastName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фамилия</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Информация о компании</CardTitle>
            <CardDescription>Эти данные помогут фрилансерам лучше понять ваш бизнес.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="companyName" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Название</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="companySize" control={form.control} render={({ field }) => (
                <FormItem>
                    <FormLabel>Размер компании</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="1">1 сотрудник</SelectItem>
                            <SelectItem value="2-10">2-10 сотрудников</SelectItem>
                            <SelectItem value="11-50">11-50 сотрудников</SelectItem>
                            <SelectItem value="51+">51+ сотрудников</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
              )} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField name="industry" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Сфера деятельности</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
               <FormField name="website" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Сайт</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Рейтинг и статистика</CardTitle>
            <CardDescription>Ваша история на платформе.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Проектов создано</p>
                  <p className="text-2xl font-bold">{user.clientProfile?.projectsPosted || 0}</p>
              </div>
              <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Потрачено</p>
                  <p className="text-2xl font-bold">{user.clientProfile?.moneySpent || 0} UZS</p>
              </div>
               <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Средний рейтинг</p>
                  <p className="text-2xl font-bold">{user.clientProfile?.rating || 'N/A'}</p>
              </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>{isPending ? 'Сохранение...' : 'Сохранить изменения'}</Button>
        </div>
      </form>
    </Form>
  );
}

export function ProfileForm({ user }: { user: any }) {
  if (user.userType === 'freelancer') {
    return <FreelancerProfileForm user={user} />;
  }
  
  if (user.userType === 'client') {
    return <ClientProfileForm user={user} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ошибка</CardTitle>
        <CardDescription>Не удалось определить тип вашего профиля. Обратитесь в поддержку.</CardDescription>
      </CardHeader>
    </Card>
  );
}

    