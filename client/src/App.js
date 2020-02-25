import React from 'react';
import io from 'socket.io-client';
import uuidv4 from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      taskName: ''
    };

    this.submitForm = this.submitForm.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }

  componentDidMount() {
    this.socket = io('http://localhost:8000');
    this.socket.on('updateData', tasks => {
      this.updateTask(tasks);
    });
    this.socket.on('addTask', newTask => {
      this.addTask(newTask);
    });
    this.socket.on('removeTask', (task, emitted) => {
      this.removeTask(task, emitted);
    });
  }

  updateTask(tasks) {
    this.setState({ tasks: tasks });
  }

  submitForm(event) {
    event.preventDefault();

    const newTask = { id: uuidv4(), name: this.state.taskName };

    this.addTask(newTask);
    this.socket.emit('addTask', newTask);
  }

  addTask(newTask) {
    const updatedTasks = [...this.state.tasks, newTask]; // make a separate copy of the array

    //updatedTasks.push(newTask);
    this.setState({ tasks: updatedTasks });
  }

  removeTask(id, emitted) {
    const updatedTasks = this.state.tasks.filter(task => {
      return task.id !== id;
    });
    this.setState({ tasks: updatedTasks });
    if (!emitted) this.socket.emit('removeTask', id);
  }

  changeValue(event) {
    this.setState({ taskName: event.target.value });
  }

  render() {
    return (
      <div className='App'>
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className='tasks-section' id='tasks-section'>
          <h2>Tasks</h2>

          <ul className='tasks-section__list' id='tasks-list'>
            {this.state.tasks.map(task => (
              <li key={task.id} className='task'>
                {task.name}
                <button onClick={() => this.removeTask(task.id)} className='btn btn--red'>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id='add-task-form' onSubmit={this.submitForm}>
            <input
              className='text-input'
              autoComplete='off'
              type='text'
              placeholder='Type your description'
              id='task-name'
              value={this.state.taskName}
              onChange={this.changeValue}
            />
            <button className='btn' type='submit'>
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;
