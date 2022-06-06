import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
// import uniqid from 'uniqid';

const App = () => {
  let socket = useRef(null);

  useEffect(() => {
    console.log('RERENDER component');
    socket.current = io('http://localhost:8000');
    socket.current.on('updateData', payload => updateTasks(payload));
    socket.current.on('addTask', task => addTask(task));
    socket.current.on('removeTask', index => removeTask(index, 'server'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  const updateTasks = payload => {
    console.log('wywolanie updateTasks');
    setTasks(payload);
  };

  const submitForm = e => {
    e.preventDefault();
    addTask(taskName);
    socket.current.emit('addTask', taskName);
    setTaskName('');
  };

  const addTask = task => {
    console.log('wywolanie dodania: ' + task);
    setTasks(prevState => [...prevState, task]);
  };

  const removeTask = (index, source) => {
    console.log('wywolanie usuniecia', index);
    setTasks(prevState => {
      let newValue = [...prevState];
      newValue.splice(index, 1);
      return newValue;
    });

    // setTasks(prevState => {
    //   return prevState.filter((value, i) => i !== index);
    // });

    if (source === 'client') {
      socket.current.emit('removeTask', index);
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
          {tasks.map((task, index) => {
            return (
              <li className="task" key={index}>
                {task}
                <button className="btn btn--red" onClick={() => removeTask(index, 'client')}>
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
