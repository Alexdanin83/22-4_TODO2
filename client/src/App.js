import React from 'react';
import io from 'socket.io-client';
import { v1 as uuidv1 } from 'uuid';


class App extends React.Component {
  constructor() {
  super();
  this.state = {
    tasks: [],
  };
}

componentDidMount () {
  this.socket = io('localhost:8000', {transports: ['websocket', 'polling', 'flashsocket']});
  this.socket.on('updateData', (tasks) => this.updateTasks(tasks));
  this.socket.on('addTask', (task) => this.addTaskTask(task));
  this.socket.on('removeTask', (id) => this.removeTask(id));
}

removeTask(id){
  //console.log(id);
  const newStateTask = this.state.tasks.filter(taskId=>taskId.id!==id);
  this.setState({ tasks: newStateTask });
}

addTaskTask(task){
  this.setState({
  tasks: [...this.state.tasks, task],
});
}

updateTasks(task){
 this.setState({ tasks: task });
}

handleOnSubmit(event, task){
  event.preventDefault();
  if (!task) {
    alert('Wprowadź task!');
  }
  else
 {
  const idTask = uuidv1();
  let newTask = {id: idTask, taskName: task};
  this.addTaskTask(newTask);
  this.socket.emit('addTask', newTask);
  document.getElementById('task-name').value='';}
}

handleRemoveTask(event,id){
  event.preventDefault();
  this.removeTask(id);
  this.socket.emit('removeTask', id);
}

  render() {
    return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
              <ul className="tasks-section__list" id="tasks-list">
          {this.state.tasks.map((itemTask)=>
            <li className="task" key={itemTask.id}>
              {itemTask.taskName}
                <button
                  type="button"
                  className="btn btn--red"
                  onClick={(event) => this.handleRemoveTask(event, itemTask.id)}
                >
                Remove
                </button>
            </li>
          )}
</ul>

        <form id="add-task-form" onSubmit={(event) => this.handleOnSubmit(event, document.getElementById('task-name').value)}>
          <input className="text-input"  type="text" placeholder="Type your description" id="task-name" />
          <button className="btn" type="submit">Add</button>
        </form>
      </section>
    </div>
  );
  };
};

export default App;
