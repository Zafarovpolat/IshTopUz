
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

function FreelancerProfile() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
          <CardDescription>Ваши личные данные, которые будут видны другим пользователям.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://i.pravatar.cc/150?u=freelancer" />
              <AvatarFallback>ФП</AvatarFallback>
            </Avatar>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Загрузить фото
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="freelancer-name">ФИО</Label>
              <Input id="freelancer-name" defaultValue="Фрилансер Петрович" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="freelancer-contact">Контакты (Email)</Label>
              <Input id="freelancer-contact" type="email" defaultValue="freelancer@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="freelancer-location">Местоположение</Label>
              <Input id="freelancer-location" defaultValue="Ташкент, Узбекистан" />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="specialization">Специализация</Label>
              <Select defaultValue="web-development">
                <SelectTrigger id="specialization">
                  <SelectValue placeholder="Выберите специализацию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-development">Веб-разработка</SelectItem>
                  <SelectItem value="design">Дизайн</SelectItem>
                  <SelectItem value="copywriting">Копирайтинг</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="hourly-rate">Часовая ставка (UZS)</Label>
                <Input id="hourly-rate" type="number" defaultValue="150000" />
            </div>
          </div>

           <div className="space-y-2">
              <Label htmlFor="skills">Навыки (теги)</Label>
              <Input id="skills" placeholder="Например: React, Node.js, Figma" />
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">Next.js</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
                <Badge variant="secondary">Figma</Badge>
              </div>
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Опыт работы</Label>
              <Select defaultValue="1-3-years">
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Выберите опыт" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less-than-1">Менее 1 года</SelectItem>
                  <SelectItem value="1-3-years">1-3 года</SelectItem>
                  <SelectItem value="more-than-3">Более 3 лет</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Доступность</Label>
              <Select defaultValue="part-time">
                <SelectTrigger id="availability">
                  <SelectValue placeholder="Выберите доступность" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Полная занятость</SelectItem>
                  <SelectItem value="part-time">Частичная</SelectItem>
                  <SelectItem value="project-based">По проектам</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
           <div className="space-y-2">
                <Label htmlFor="about">О себе</Label>
                <Textarea id="about" placeholder="Расскажите о своих достижениях, сильных сторонах и подходе к работе." rows={5} defaultValue="Опытный веб-разработчик, специализируюсь на создании современных и адаптивных сайтов с использованием React и Next.js."/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="languages">Языки</Label>
                <Input id="languages" placeholder="Узбекский (Родной), Русский (Свободно), Английский (B2)" defaultValue="Узбекский (Родной), Русский (Свободно), Английский (B2)" />
            </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button>Сохранить изменения</Button>
      </div>
    </div>
  );
}

function ClientProfile() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Личная информация</CardTitle>
          <CardDescription>Ваши контактные данные.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://i.pravatar.cc/150?u=client" />
              <AvatarFallback>ЗИ</AvatarFallback>
            </Avatar>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Загрузить фото
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">ФИО</Label>
              <Input id="client-name" defaultValue="Заказчик Иванович" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-contact">Контакты (Email)</Label>
              <Input id="client-contact" type="email" defaultValue="client@example.com" />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="company-name">Название</Label>
              <Input id="company-name" defaultValue="ООО 'Мой Бизнес'" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-size">Размер компании</Label>
              <Select defaultValue="2-10">
                <SelectTrigger id="company-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 сотрудник</SelectItem>
                  <SelectItem value="2-10">2-10 сотрудников</SelectItem>
                  <SelectItem value="11-50">11-50 сотрудников</SelectItem>
                  <SelectItem value="51+">51+ сотрудников</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Сфера деятельности</Label>
              <Input id="industry" defaultValue="E-commerce" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Сайт</Label>
              <Input id="website" type="url" defaultValue="https://my-business.uz" />
            </div>
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
                <p className="text-2xl font-bold">12</p>
            </div>
            <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Нанято фрилансеров</p>
                <p className="text-2xl font-bold">8</p>
            </div>
             <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Средний рейтинг</p>
                <p className="text-2xl font-bold">4.8 / 5.0</p>
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Сохранить изменения</Button>
      </div>
    </div>
  );
}


export default function TestProfilePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-4xl gap-2">
        <h1 className="text-3xl font-semibold">Настройки профиля</h1>
      </div>

      <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
        <Tabs defaultValue="freelancer">
          <TabsList>
            <TabsTrigger value="freelancer">Профиль фрилансера</TabsTrigger>
            <TabsTrigger value="client">Профиль заказчика</TabsTrigger>
          </TabsList>
          <TabsContent value="freelancer">
            <FreelancerProfile />
          </TabsContent>
          <TabsContent value="client">
            <ClientProfile />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

    