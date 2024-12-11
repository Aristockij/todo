import AddTaskForm from "@/components/AddTaskForm";
import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <main className='bg-gray-200 h-screen pt-10'>
      <section className='max-w-3xl mx-auto bg-white rounded-xl shadow-lg gap-x-4" p-10'>
        <div className='flex justify-center text-xl mb-3'>
          <h1 className='uppercase'>todos</h1>
        </div>
        <AddTaskForm />
        <TaskList />
      </section>
    </main>
  );
}
