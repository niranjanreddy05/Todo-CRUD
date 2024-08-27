import { useEffect, useState } from "react";
import axios from 'axios';

export default function TaskList({ tasks, setTasks, deleteTask, editTaskUi, cancelTask }) {

  const [formData, setFormData] = useState({});
  useEffect(() => {
    const data = {};
    tasks.forEach(task => {
      data[task._id] = task.task;
    });
    setFormData(data);
  }, [tasks])
  useEffect(() => {
    async function getTasks() {
      const response = await axios.get('http://localhost:3000/tasks');
      setTasks(response.data);
    }
    getTasks();
  }, []);
  const updateForm = (e, taskId) => {
    const newFormData = e.target.value;
    setFormData(prevData => {
      return { ...prevData, [taskId]: newFormData }
    })
  }
  const editTasks = async (e, taskId) => {
    e.preventDefault();
    const data = formData[taskId];
    const obj = {task: data}
    const tasks = await axios.put(`http://localhost:3000/tasks/${taskId}`, obj);
    setTasks(tasks.data.map(task => {
      return {...task, onEdit: false}
    }));
  }
  return (
    <>
      {tasks.map(task => {
        return (
          task.onEdit ?
            <form htmlFor="task" key={task._id}>
              <input value={formData[task._id]} onChange={(e) => { updateForm(e, task._id) }} />
              <button onClick={(e) => editTasks(e, task._id)}>Submit</button>
              <button onClick={cancelTask}>Cancel</button>
            </form> :
            <div key={task._id}>
              {task.task}
              <button onClick={() => deleteTask(task._id)}>Delete</button>
              <button onClick={() => editTaskUi(task._id)}>Edit</button>
            </div>
        )
      })}
    </>
  )
}