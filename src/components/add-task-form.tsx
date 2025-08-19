'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar as CalendarIcon, Loader2, Plus } from 'lucide-react';
import { useSidebar } from './ui/sidebar';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';

const formSchema = z.object({
  title: z.string().min(1, 'Task title is required.'),
  description: z.string().optional(),
});

type AddTaskFormValues = z.infer<typeof formSchema>;

interface AddTaskFormProps {
  onAddTask: (title: string, description: string, reminder?: string) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [reminder, setReminder] = useState<Date | undefined>();
  const { setOpenMobile, isMobile, state: sidebarState } = useSidebar();

  const form = useForm<AddTaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = (values: AddTaskFormValues) => {
    onAddTask(values.title, values.description || '', reminder?.toISOString());
    form.reset();
    setReminder(undefined);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isCollapsed = sidebarState === 'collapsed';

  return (
    <div className={isCollapsed ? "flex justify-center" : ""}>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", isCollapsed ? "w-auto" : "w-full")}>
        <div className={cn("space-y-4", isCollapsed ? "hidden" : "block")}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task</FormLabel>
              <FormControl>
                <Input placeholder="What do you need to do?" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Add more details..." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !reminder && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {reminder ? format(reminder, "PPP") : <span>Set reminder</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={reminder}
                onSelect={setReminder}
                initialFocus
              />
            </PopoverContent>
        </Popover>
        
        </div>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting} size={isCollapsed ? "icon" : "default"}>
          {form.formState.isSubmitting ? (
            <Loader2 className={cn(isCollapsed ? "" : "mr-2", "h-4 w-4 animate-spin")} />
          ) : (
            <Plus className={cn(isCollapsed ? "" : "mr-2", "h-4 w-4")} />
          )}
          <span className={isCollapsed ? "sr-only" : ""}>Add Task</span>
        </Button>
      </form>
    </Form>
    </div>
  );
};

export default AddTaskForm;
