import { useEffect, useState } from "react";
import axios from 'axios';

export default function TaskList({ tasks, setTasks, deleteTask, editTaskUi }) {
  const [formData, setFormData] = useState({editTask:""})
  useEffect(() => {
    async function getTasks() {
      const response = await axios.get('http://localhost:3000/tasks');
      setTasks(response.data)
    }
    getTasks();
  }, []);
  const updateFormData = (e) => {
    setFormData(oldData => {
      return { ...oldData, [e.target.name]: e.target.value }
    })
  }
  const initialUpdate = (data) => {
    const updatedData = {...data, editTask: data.task}
    setFormData(updatedData);
    setTasks(tasks.map(task => {
      if(data._id === task._id) {
        console.log(data._id)
        return {...task, onEdit: true}
      } else {
        return {...task, onEdit: false}
      }
    }));
  }
  const editTask = async (idx) => {
    const data = formData.editTask;
    const obj = {task: data}
    const tasks = await axios.put(`http://localhost:3000/tasks/${idx}`, obj);
    setTasks(tasks.data.map(task => {
      return {...task, onEdit: false}
    }));
  }
  return (
    <>
      {tasks.map(task => {
        return (
          task.onEdit ?
            <form htmlFor="task">
              <input value={formData.editTask} onChange={updateFormData} name="editTask"/>
              <button onClick={() => editTask(task._id)}>Submit</button>
            </form> :
            <div key={task._id}>
              {task.task}
              <button onClick={() => deleteTask(task._id)}>Delete</button>
              <button onClick={() => {
                editTaskUi(task._id)
                initialUpdate(task)
              }}>Edit</button>
            </div>
        )
      })}
    </>
  )
}