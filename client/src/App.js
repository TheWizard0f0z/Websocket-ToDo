import React from 'react';
import io from 'socket.io-client';
import uuidv4 from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      taskName: {}
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
    this.addTask(this.state.taskName);
    this.socket.emit('addTask', this.state.taskName);
  }

  addTask(newTask) {
    const updatedTasks = [...this.state.tasks]; // make a separate copy of the array

    updatedTasks.push(newTask);
    this.setState({ tasks: updatedTasks });
  }

  // add task second way - for learning
  /*
  addTask(newTask) {
    if (!this.state.tasks.find(task => task.id === newTask.id)) {
      this.state.tasks.push(newTask);
      this.setState(this.state.tasks);
    }
  }
  */

  // remove task first way
  removeTask(id, emitted) {
    const updatedTasks = [...this.state.tasks]; // make a separate copy of the array

    updatedTasks.forEach((task, index) => {
      if (task.id === id) {
        updatedTasks.splice(index, 1);
      }
    });
    this.setState({ tasks: updatedTasks });
    if (!emitted) this.socket.emit('removeTask', id);
  }

  // remove task second way - for learning
  /*
  removeTask(id) {
    const updatedTasks = this.state.tasks.filter(task => task.id !== id);
    this.setState({ tasks: updatedTasks });

    this.socket.emit('removeTask', id);
  }
  */

  // remove task third way - for learning
  /* 
  removeTask(event, task) {
    const index = this.state.tasks.indexOf(task);

    if (this.state.tasks.find(deleteTask => deleteTask.id === task.id)) {
      this.setState(this.state.tasks.splice(index, 1));
      this.socket.emit('removeTask', index, task);
    }
  }
  */

  async changeValue(event) {
    await this.setState({
      taskName: {
        id: uuidv4(),
        name: event.target.value
      }
    });
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
                <button
                  onClick={() => this.removeTask(task.id)}
                  className='btn btn--red'>
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
              value={this.state.taskName.name}
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
