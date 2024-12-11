export interface Task {
  id: number;
  title: string;
  status: string;
}

export interface TypeTaskList {
  tasks: Task[];
}
