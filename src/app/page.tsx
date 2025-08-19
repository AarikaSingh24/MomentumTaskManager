import TaskManager from '@/components/task-manager';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <SidebarProvider>
      <main className="min-h-screen w-full p-4 sm:p-6 md:p-8">
        <TaskManager />
      </main>
    </SidebarProvider>
  );
}
