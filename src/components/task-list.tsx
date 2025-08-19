'use client';

import React, { useState, useEffect } from 'react';
import type { Task } from '@/types';
import TaskItem from '@/components/task-item';
import AllTasksCompleted from '@/components/all-tasks-completed';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface TaskListProps {
  pendingTasks: Task[];
  completedTasks: Task[];
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, title: string, description: string, reminder?: string) => void;
  onDeleteCompleted: () => void;
  newTaskIds: Set<string>;
}

const TaskList: React.FC<TaskListProps> = ({ pendingTasks, completedTasks, onToggleTask, onUpdateTask, onDeleteCompleted, newTaskIds }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [prevPendingCount, setPrevPendingCount] = useState(pendingTasks.length);

  useEffect(() => {
    if (prevPendingCount > 0 && pendingTasks.length === 0) {
      setShowConfetti(true);
    }
    setPrevPendingCount(pendingTasks.length);
  }, [pendingTasks.length, prevPendingCount]);

  return (
    <div className="space-y-6">
       <ScrollArea className="h-[calc(100vh-22rem)] pr-4">
        <div className="space-y-3">
          {pendingTasks.length > 0 ? (
            pendingTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggleTask} onUpdate={onUpdateTask} isNew={newTaskIds.has(task.id)} />
            ))
          ) : (
             <AllTasksCompleted showConfetti={showConfetti} onAnimationComplete={() => setShowConfetti(false)} />
          )}
        </div>
      </ScrollArea>

      {completedTasks.length > 0 && (
         <Accordion type="single" collapsible className="w-full" defaultValue="completed-tasks">
            <AccordionItem value="completed-tasks">
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Completed ({completedTasks.length})
                    </h2>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-4">
                  <ScrollArea className="h-[25vh] pr-4">
                    <div className="space-y-3">
                      {completedTasks.map(task => (
                        <TaskItem key={task.id} task={task} onToggle={onToggleTask} onUpdate={onUpdateTask} />
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="pt-4 flex justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Clear Completed
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all {completedTasks.length} completed tasks. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={onDeleteCompleted}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
      )}
    </div>
  );
};

export default TaskList;
