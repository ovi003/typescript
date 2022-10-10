type Task = {
  id: string,
  name: string,
  completed: Boolean
}

const form = document.querySelector('.task-form') as HTMLFormElement;
const input = document.querySelector('.task-name') as HTMLInputElement;
const btn = document.querySelector('.btn-add-task') as HTMLButtonElement;
const container = document.querySelector('.container') as HTMLDivElement;

const defaultTasks = localStorage.getItem('todoitems');
let tasks: Task[] = defaultTasks ? JSON.parse(defaultTasks) : [];

const renderSingleTask = (task: Task) =>  {
  const wrapper = document.createElement('div');
  const item = document.createElement('div');
  const btnDelete = document.createElement('button');
  const p = document.createElement('p');

  wrapper.classList.add('item-wrapper');
  
  item.classList.add('todo-item');
  if(task.completed) item.classList.add('task-completed');
  wrapper.dataset.id = task.id; 
  p.innerText = task.name;

  btnDelete.innerText = 'X';
  btnDelete.classList.add('btn-remove');
  btnDelete.classList.add('btn');


  item.append(p);
  wrapper.append(btnDelete);
  wrapper.append(item);
  container.append(wrapper);
}

const renderTasks = () => {
  tasks.forEach(task => {
    renderSingleTask(task);
  });
}

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem('todoitems', JSON.stringify(tasks));
}

const deleteSingleTask = (id: string) => {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks(tasks);
}

const taskToggle = (id: string) => {
  tasks = tasks.map(task => {
    if(task.id === id){
      return {
        ...task,
        completed: !task.completed
      }
    }
    return task;
  });
  saveTasks(tasks);
}

renderTasks();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if(!input.value) return;

  const task: Task = {
    id: Date.now().toString(),
    name: input.value,
    completed: false,
  }
  input.value = '';
  renderSingleTask(task)
  tasks.push(task);
  
  saveTasks(tasks);
});

document.addEventListener('click', (e) => {

  const el = e.target;
  if(!(el instanceof Element)) return;

  const isBtnRemove = el.classList.contains('btn-remove');
  const isItem = el.classList.contains('todo-item');

  if(isBtnRemove){
    const item = el.closest('.item-wrapper');
    const id = item?.getAttribute('data-id')!;
    item?.remove();
    deleteSingleTask(id);
  }

  if(isItem) {
    const item = el.closest('.item-wrapper');
    const id = item?.getAttribute('data-id')!;

    if(el.classList.contains('task-completed')){
      el.classList.remove('task-completed');
    }else{
      el.classList.add('task-completed');
    }
    taskToggle(id);
  }

})