import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import uniqid from 'uniqid';

const App = () => {
  let socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:8000');
    socket.current.on('updateData', payload => updateTasks(payload));
    socket.current.on('addTask', task => addTask(task));
    socket.current.on('removeTask', task => removeTask(task, 'server'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  const updateTasks = payload => {
    setTasks(payload);
  };

  const submitForm = e => {
    e.preventDefault();
    const task = {name: taskName, id: uniqid()};
    addTask(task);
    socket.current.emit('addTask', task);
    setTaskName('');
  };

  const addTask = task => {
    setTasks(prevState => [...prevState, task]);
  };

  const removeTask = (task, source) => {
    setTasks(prevState => {
      return prevState.filter(taskInState => taskInState.id !== task.id);
    });

    if (source === 'client') {
      socket.current.emit('removeTask', task);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(task => {
            return (
              <li className="task" key={task.id}>
                {task.name}
                <button className="btn btn--red" onClick={() => removeTask(task, 'client')}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>

        <form id="add-task-form" onSubmit={e => submitForm(e, taskName)}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={e => {
              setTaskName(e.target.value);
            }}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
