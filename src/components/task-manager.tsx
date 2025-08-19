'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Task } from '@/types';
import AddTaskForm from '@/components/add-task-form';
import TaskList from '@/components/task-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { ListTodo, Search, Palette, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeSwitcher } from '@/components/theme-switcher';


const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [newTaskIds, setNewTaskIds] = useState(new Set<string>());
  const [notifiedTaskIds, setNotifiedTaskIds] = useState(new Set<string>());


  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load your tasks. Please refresh the page.",
      });
    }
    setIsLoaded(true);
  }, [toast]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not save your tasks. Your changes might be lost.",
        });
      }
    }
  }, [tasks, isLoaded, toast]);
  
  useEffect(() => {
    if (newTaskIds.size > 0) {
      const timer = setTimeout(() => {
        setNewTaskIds(new Set());
      }, 1000); // Corresponds to animation duration
      return () => clearTimeout(timer);
    }
  }, [newTaskIds]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      if (Notification.permission !== "granted") return;

      const now = new Date();
      tasks.forEach(task => {
        if (!task.completed && task.reminder && !notifiedTaskIds.has(task.id)) {
          const reminderDate = new Date(task.reminder);
          if (reminderDate <= now) {
            new Notification("Task Reminder", {
              body: `Your task "${task.title}" is pending. Complete it ASAP!`,
              icon: '/favicon.ico', // Optional: add an icon
            });
            setNotifiedTaskIds(prev => new Set(prev).add(task.id));
          }
        }
      });
    };

    const intervalId = setInterval(checkReminders, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [tasks, notifiedTaskIds]);

  const handleAddTask = useCallback((title: string, description: string, reminder?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      reminder,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setNewTaskIds(prev => new Set(prev).add(newTask.id));
    toast({
      title: "Task Added",
      description: `"${title}" has been added to your list.`,
    });
  }, [toast]);

  const handleUpdateTask = useCallback((id: string, title: string, description: string, reminder?: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, title, description, reminder } : task
      )
    );
     // Reset notification status if reminder changes
     if (reminder) {
        setNotifiedTaskIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    }
    toast({
      title: "Task Updated",
      description: "Your task has been successfully updated.",
    });
  }, [toast]);

  const handleToggleTask = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const handleDeleteCompleted = useCallback(() => {
    const completedCount = tasks.filter(task => task.completed).length;
    if (completedCount > 0) {
      setTasks(prevTasks => prevTasks.filter(task => !task.completed));
      toast({
        title: "Completed Tasks Cleared",
        description: `Successfully deleted ${completedCount} completed task(s).`,
      });
    }
  }, [tasks, toast]);
  
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filteredTasks]);

  const pendingTasks = useMemo(() => sortedTasks.filter(task => !task.completed), [sortedTasks]);
  const completedTasks = useMemo(() => sortedTasks.filter(task => task.completed), [sortedTasks]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-4">
      <Sidebar side="left" collapsible="icon">
          <SidebarHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3 whitespace-nowrap">
                  <ListTodo className="h-8 w-8 text-primary" />
                  <span className="group-data-[collapsible=icon]:hidden">Momentum</span>
              </CardTitle>
          </SidebarHeader>
          <SidebarContent>
              <div className="p-2">
                 <AddTaskForm onAddTask={handleAddTask} />
              </div>
          </SidebarContent>
          <SidebarFooter className="group-data-[collapsible=icon]:hidden p-2">
              <Card className="bg-card/70 backdrop-blur-sm border-secondary shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary"/>
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize the look and feel.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemeSwitcher/>
                </CardContent>
              </Card>
          </SidebarFooter>
      </Sidebar>
      <div className="flex-1">
          <Card className="bg-card/50 backdrop-blur-sm border-secondary shadow-2xl shadow-primary/5 min-h-[calc(100vh-2rem)] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <SidebarTrigger className="md:hidden"/>
                      <CardTitle className="text-2xl font-bold">Your Tasks</CardTitle>
                    </div>
                    <CardDescription className="text-right">
                      {pendingTasks.length} pending / {completedTasks.length} completed
                    </CardDescription>
                  </div>
                   <div className="relative mt-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                          placeholder="Search tasks..."
                          className="pl-10 h-12 text-base w-[50%] transition-all duration-300 ease-in-out focus:w-full focus:shadow-lg focus:shadow-primary/20"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
              </CardHeader>
              <CardContent className="p-6">
                  <TaskList
                    pendingTasks={pendingTasks}
                    completedTasks={completedTasks}
                    onToggleTask={handleToggleTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteCompleted={handleDeleteCompleted}
                    newTaskIds={newTaskIds}
                  />
              </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default TaskManager;
