"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface Task {
  id: string;
  description: string;
  completed: boolean;
  due_date: string | null;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: channels } = await supabase
        .from('channels')
        .select('*')
        .eq('user_id', user.id);
      const channel = channels?.[0];
      if (!channel) return;
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('channel_id', channel.id)
        .order('created_at', { ascending: false });
      setTasks((data ?? []) as unknown as Task[]);
    };
    fetchTasks();
  }, []);

  async function toggleComplete(id: string, completed: boolean) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', id);
    if (!error) {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      {tasks.length > 0 ? (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
              <div>
                <p className={task.completed ? 'line-through text-gray-500' : ''}>{task.description}</p>
                {task.due_date && (
                  <p className="text-xs text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                )}
              </div>
              <button
                className={`px-3 py-1 rounded ${task.completed ? 'bg-gray-400' : 'bg-blue-600'} text-white`}
                onClick={() => toggleComplete(task.id, task.completed)}
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no tasks assigned yet.</p>
      )}
    </div>
  );
}
