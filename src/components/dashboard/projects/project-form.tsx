"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useState, useTransition, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { createProject, updateProject } from "@/app/actions";
import { projectSchema, type Project } from "@/lib/schema";
import {
  Loader2,
  UploadCloud,
  X,
  File as FileIcon,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

type ProjectFormValues = z.infer<typeof projectSchema>;

interface UploadedFile {
  name: string;
  url: string;
  size: number;
}

interface ProjectFormProps {
  project?: Project | null;
  onFormSubmit: () => void;
}

export function ProjectForm({ project, onFormSubmit }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!project?.id;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      skills: "",
      budgetType: "fixed",
      budgetAmount: undefined,
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description,
        skills: Array.isArray(project.skills) ? project.skills.join(", ") : "",
        budgetType: project.budgetType,
        budgetAmount: project.budgetAmount,
        deadline: project.deadline ? new Date(project.deadline) : undefined,
      });
      // Загружаем существующие файлы если есть
      if ((project as any).files) {
        setUploadedFiles((project as any).files);
      }
    } else {
      form.reset({
        title: "",
        description: "",
        skills: "",
        budgetType: "fixed",
        budgetAmount: undefined,
      });
      setUploadedFiles([]);
      setPendingFiles([]);
    }
  }, [project, form]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Проверка лимитов
    const totalFiles =
      uploadedFiles.length + pendingFiles.length + fileArray.length;
    if (totalFiles > 5) {
      toast({
        variant: "destructive",
        title: "Слишком много файлов",
        description: "Максимум 5 файлов на проект.",
      });
      return;
    }

    // Проверка размера
    for (const file of fileArray) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Файл слишком большой",
          description: `${file.name} превышает 10MB.`,
        });
        return;
      }
    }

    setIsUploading(true);
    toast({
      title: "Загрузка файлов...",
      description: "Пожалуйста, подождите.",
    });

    try {
      const uploaded: UploadedFile[] = [];

      for (const file of fileArray) {
        const fileExtension = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const storageRef = ref(storage, `projects/${uuidv4()}/${fileName}`);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        uploaded.push({
          name: file.name,
          url: downloadURL,
          size: file.size,
        });
      }

      setUploadedFiles((prev) => [...prev, ...uploaded]);
      toast({
        title: "Успешно!",
        description: `Загружено ${uploaded.length} файл(ов).`,
      });
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: error.message || "Не удалось загрузить файлы.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const onSubmit = (data: ProjectFormValues) => {
    startTransition(async () => {
      // Добавляем файлы к данным
      const projectData = {
        ...data,
        files: uploadedFiles,
      };

      let result;
      if (isEditMode && project?.id) {
        result = await updateProject(project.id, projectData);
      } else {
        result = await createProject(projectData);
      }

      if (result.success) {
        toast({ title: "Успешно!", description: result.message });
        form.reset();
        setUploadedFiles([]);
        setPendingFiles([]);
        onFormSubmit();
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: result.message,
        });
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
              <FormControl>
                <Input
                  placeholder="Например, 'Разработать логотип для кофейни'"
                  {...field}
                />
              </FormControl>
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
              <FormControl>
                <Textarea
                  placeholder="Опишите, что именно нужно сделать, какие цели вы преследуете..."
                  rows={6}
                  {...field}
                />
              </FormControl>
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
              <FormControl>
                <Input
                  placeholder="Дизайн логотипа, Adobe Illustrator, Брендинг"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Перечислите ключевые навыки через запятую.
              </FormDescription>
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
                      <FormControl>
                        <RadioGroupItem value="fixed" id="fixed" />
                      </FormControl>
                      <FormLabel className="font-normal" htmlFor="fixed">
                        Фиксированный
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="hourly" id="hourly" />
                      </FormControl>
                      <FormLabel className="font-normal" htmlFor="hourly">
                        Почасовая
                      </FormLabel>
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
                <FormControl>
                  <Input
                    type="number"
                    placeholder="500000"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? undefined : +e.target.value,
                      )
                    }
                  />
                </FormControl>
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
                        !field.value && "text-muted-foreground",
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

        {/* Файлы и материалы */}
        <div>
          <FormLabel>Файлы и материалы</FormLabel>
          <div
            className={cn(
              "mt-2 relative flex justify-center items-center h-32 w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors",
              isUploading
                ? "border-primary/50 bg-primary/5"
                : "border-muted-foreground/30 hover:bg-muted/50",
            )}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              disabled={isUploading}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
            />
            {isUploading ? (
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Загрузка файлов...
                </p>
              </div>
            ) : (
              <div className="text-center">
                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Нажмите или перетащите файлы сюда
                </p>
                <p className="text-xs text-muted-foreground/80">
                  До 5 файлов, не более 10MB каждый
                </p>
              </div>
            )}
          </div>

          {/* Список загруженных файлов */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-md border bg-muted/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || isUploading}
        >
          {isPending
            ? isEditMode
              ? "Сохранение..."
              : "Публикация..."
            : isEditMode
              ? "Сохранить изменения"
              : "Опубликовать проект"}
        </Button>
      </form>
    </Form>
  );
}
