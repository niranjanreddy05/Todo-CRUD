import { useState } from "react"
import TaskList from "./TaskList";
import axios from 'axios';

export default function Form() {
  const [formData, setFormData] = useState({ task: "" });
  const [tasks, setTasks] = useState([]);
  const updateForm = (e) => {
    setFormData(oldData => {
      return { ...oldData, [e.target.name]: e.target.value }
    })
  }
  const insertTask = async (e) => {
    e.preventDefault();
    const data = formData;
    const tasks = await axios.post('http://localhost:3000/tasks', data);
    setTasks(tasks.data.map(task => {
      return {...task, onEdit: false}
    }));
  }
  const cancelTask = async () => {
    const tasks = await axios.get('http://localhost:3000/tasks');
    setTasks(tasks.data.map(task => {
      return {...task, onEdit: false}
    }));
  }
  const deleteTask = async (idx) => {
    const tasks = await axios.delete(`http://localhost:3000/tasks/${idx}`);
    setTasks(tasks.data.map(task => {
      return {...task, onEdit: false}
    }));
  }
  const editTaskUi = (idx) => {
    const updatedTaskList = tasks.map(task => {
      if(task._id === idx){
        return {...task, onEdit: true}
      } else {
        return {...task}
      }
    })
    setTasks(updatedTaskList);
  }
  return (
    <>
      <form htmlFor="task">
        <input id="task" name="task" value={formData.task} onChange={updateForm} />
        <button onClick={insertTask}>Submit</button>
      </form>
      <TaskList tasks={tasks} setTasks={setTasks} deleteTask={deleteTask} editTaskUi={editTaskUi} cancelTask={cancelTask}/>
    </>
  )
}