'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { Button } from './ui/button';
import { Bell, Calendar as CalendarIcon, Pencil, Save, X } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, title: string, description: string, reminder?: string) => void;
  isNew?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onUpdate, isNew }) => {
  const timeAgo = formatDistanceToNow(new Date(task.createdAt), { addSuffix: true });
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [reminder, setReminder] = useState<Date | undefined>(task.reminder ? new Date(task.reminder) : undefined);
  const [isCompleting, setIsCompleting] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditedTitle(task.title);
      setEditedDescription(task.description);
      setReminder(task.reminder ? new Date(task.reminder) : undefined);
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isEditing, task.title, task.description, task.reminder]);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onUpdate(task.id, editedTitle.trim(), editedDescription, reminder?.toISOString());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setReminder(task.reminder ? new Date(task.reminder) : undefined);
  };
  
  const isReminderPast = task.reminder && isPast(new Date(task.reminder));

  const handleToggle = () => {
    if (task.completed) {
      onToggle(task.id);
    } else {
      setIsCompleting(true);
      setTimeout(() => {
        onToggle(task.id);
        // The component will re-render in the completed list, so we don't need to setIsCompleting(false)
      }, 500); // Duration of the animation
    }
  }

  return (
    <div 
      className={cn(
        "flex items-start gap-4 p-4 bg-gradient-to-br from-card/60 to-card/80 rounded-xl border border-transparent transition-all duration-300 group hover:border-primary/50 hover:bg-gradient-to-br hover:from-card/80 hover:to-card/90 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1",
        isNew && 'animate-fade-in-down',
        isCompleting && 'animate-task-pop-off',
        task.completed && 'bg-secondary/10 opacity-60'
      )}>
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={handleToggle}
        className="mt-1 transition-transform duration-300 ease-in-out group-hover:scale-110"
        aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        disabled={isEditing}
      />
      {isEditing ? (
        <div className="grid gap-2 flex-1">
          <Input 
            ref={titleInputRef}
            value={editedTitle} 
            onChange={(e) => setEditedTitle(e.target.value)}
            className="font-medium bg-background/70"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          <Textarea 
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="text-sm text-muted-foreground resize-none bg-background/70"
            rows={3}
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
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-1.5 flex-1">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              'font-medium cursor-pointer transition-colors',
              task.completed && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </label>
          {task.description && (
            <p className={cn(
              'text-sm text-muted-foreground whitespace-pre-wrap transition-colors',
              task.completed && 'line-through'
            )}>
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground/80 pt-1">
            <span>{timeAgo}</span>
            {task.reminder && !task.completed && (
                 <span className={cn(
                    "flex items-center gap-1",
                    isReminderPast && "text-destructive font-semibold"
                 )}>
                    <Bell className="h-3 w-3"/>
                    {format(new Date(task.reminder), "MMM d")}
                 </span>
            )}
          </div>
        </div>
      )}
       {!isEditing && !task.completed && (
         <Button 
          variant="ghost" 
          size="icon" 
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}>
          <Pencil className="h-4 w-4" />
         </Button>
       )}
    </div>
  );
};

export default TaskItem;
