// Simple Todo app with localStorage persistence and accessible controls
const STORAGE_KEY = 'todos-v1';
let todos = [];
let filter = 'all';

const newInput = document.getElementById('new-todo');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const counts = document.getElementById('counts');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');
const clearAllBtn = document.getElementById('clear-all');

function uid(){return Date.now().toString(36) + Math.random().toString(36).slice(2,7)}

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    todos = raw? JSON.parse(raw) : [];
  }catch(e){todos=[]}
}

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodo(text){
  const t = text.trim();
  if(!t) return;
  todos.unshift({id:uid(), text:t, completed:false});
  save();
  render();
}

function updateTodo(id, newText){
  const idx = todos.findIndex(t=>t.id===id);
  if(idx>-1){
    todos[idx].text = newText.trim();
    save();
    render();
  }
}

function toggleTodo(id){
  const t = todos.find(x=>x.id===id);
  if(t){t.completed = !t.completed; save(); render();}
}

function deleteTodo(id){
  todos = todos.filter(t=>t.id!==id);
  save();
  render();
}

function clearCompleted(){
  todos = todos.filter(t=>!t.completed);
  save();
  render();
}

function clearAll(){
  if(!confirm('Clear all todos? This cannot be undone.')) return;
  todos = [];
  save();
  render();
}

function exportTodos(){
  try{
    const data = JSON.stringify(todos, null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }catch(e){
    alert('Export failed: ' + e.message);
  }
}

function handleImportFile(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{
      const parsed = JSON.parse(e.target.result);
      if(!Array.isArray(parsed)) throw new Error('Invalid format: expected an array');
      // Basic validation: items with id and text
      const valid = parsed.every(it=>it && typeof it.id === 'string' && typeof it.text === 'string');
      if(!valid) throw new Error('Invalid todo items in file');
      if(confirm('Replace current todos with imported list?')){
        todos = parsed.map(it=>({id:it.id, text:it.text, completed:!!it.completed}));
        save();
        render();
      }
    }catch(err){
      alert('Import failed: ' + (err.message||err));
    }
  };
  reader.readAsText(file);
}

function setFilter(f){
  filter = f;
  document.querySelectorAll('.filter-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.filter===f);
    b.setAttribute('aria-selected', b.dataset.filter===f ? 'true' : 'false');
  });
  render();
}

function visibleTodos(){
  if(filter==='active') return todos.filter(t=>!t.completed);
  if(filter==='completed') return todos.filter(t=>t.completed);
  return todos;
}

function render(){
  todoList.innerHTML = '';
  const list = visibleTodos();
  for(const t of list){
    const li = document.createElement('li');
    li.className = 'todo-item' + (t.completed ? ' completed' : '');
    li.dataset.id = t.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = t.completed;
    checkbox.setAttribute('aria-label','Mark todo completed');
    checkbox.addEventListener('change', ()=> toggleTodo(t.id));

    const title = document.createElement('div');
    title.className = 'title';
    title.tabIndex = 0;
    title.textContent = t.text;
    title.addEventListener('dblclick', ()=> startEdit(t.id, title));
    title.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ startEdit(t.id, title)} });

    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.title = 'Edit';
    editBtn.addEventListener('click', ()=> startEdit(t.id, title));

    const delBtn = document.createElement('button');
    delBtn.innerText = 'Delete';
    delBtn.title = 'Delete';
    delBtn.addEventListener('click', ()=> deleteTodo(t.id));

    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    todoList.appendChild(li);
  }

  const activeCount = todos.filter(t=>!t.completed).length;
  const total = todos.length;
  counts.textContent = `${activeCount} active, ${total} total`;
}

function startEdit(id, titleNode){
  const original = titleNode.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = original;

  function finish(saveEdit){
    if(saveEdit){
      const val = input.value.trim();
      if(val) updateTodo(id, val);
      else deleteTodo(id);
    }else{
      render();
    }
  }

  input.addEventListener('keydown', (e)=>{
    if(e.key==='Enter') finish(true);
    if(e.key==='Escape') finish(false);
  });
  input.addEventListener('blur', ()=> finish(true));

  titleNode.replaceWith(input);
  input.focus();
  // place caret at end
  input.setSelectionRange(input.value.length, input.value.length);
}

// event wiring
addBtn.addEventListener('click', ()=>{ addTodo(newInput.value); newInput.value=''; newInput.focus(); });
newInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ addTodo(newInput.value); newInput.value=''; } });

filterBtns.forEach(b=> b.addEventListener('click', ()=> setFilter(b.dataset.filter)));
clearCompletedBtn.addEventListener('click', ()=> clearCompleted());
exportBtn.addEventListener('click', ()=> exportTodos());
importBtn.addEventListener('click', ()=> importFile.click());
importFile.addEventListener('change', (e)=> { handleImportFile(e.target.files[0]); importFile.value = ''; });
clearAllBtn.addEventListener('click', ()=> clearAll());

// init
load();
setFilter('all');
render();

// expose for manual testing
window.__todos = todos;
