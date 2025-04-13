import { 
  Note, Task, UsefulLink, Idea, 
  Client, ClientStatus, ClientCategory, 
  FinancialRecord
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to convert string dates to Date objects
const toDate = (dateStr: string | Date): Date => {
  if (dateStr instanceof Date) return dateStr;
  return new Date(dateStr);
};

// Notes functions
export const saveNote = (note: Note): void => {
  const notes = getNotes();
  const existingNoteIndex = notes.findIndex(n => n.id === note.id);
  
  if (existingNoteIndex >= 0) {
    notes[existingNoteIndex] = { ...note, updatedAt: new Date() };
  } else {
    notes.unshift({
      ...note,
      id: note.id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  localStorage.setItem('severino-notes-storage', JSON.stringify({ state: { notes } }));
};

export const getNotes = (): Note[] => {
  try {
    const storedData = localStorage.getItem('severino-notes-storage');
    if (!storedData) return [];
    
    const parsedData = JSON.parse(storedData);
    const notes = parsedData.state?.notes || [];
    
    return notes.map((note: any) => ({
      ...note,
      createdAt: toDate(note.createdAt),
      updatedAt: toDate(note.updatedAt)
    }));
  } catch (error) {
    console.error('Error retrieving notes:', error);
    return [];
  }
};

export const deleteNote = (id: string): void => {
  const notes = getNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  localStorage.setItem('severino-notes-storage', JSON.stringify({ state: { notes: filteredNotes } }));
};

// Tasks functions
export const saveTask = (task: Task): void => {
  const tasks = getTasks();
  const existingTaskIndex = tasks.findIndex(t => t.id === task.id);
  
  if (existingTaskIndex >= 0) {
    tasks[existingTaskIndex] = { ...task };
  } else {
    tasks.unshift({
      ...task,
      id: task.id || uuidv4(),
      createdAt: new Date()
    });
  }
  
  localStorage.setItem('severino-tasks-storage', JSON.stringify({ state: { tasks } }));
};

export const getTasks = (): Task[] => {
  try {
    const storedData = localStorage.getItem('severino-tasks-storage');
    if (!storedData) return [];
    
    const parsedData = JSON.parse(storedData);
    const tasks = parsedData.state?.tasks || [];
    
    return tasks.map((task: any) => ({
      ...task,
      createdAt: toDate(task.createdAt),
      dueDate: toDate(task.dueDate)
    }));
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    return [];
  }
};

export const updateTaskStatus = (id: string, status: Task['status']): void => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task => 
    task.id === id ? { ...task, status } : task
  );
  
  localStorage.setItem('severino-tasks-storage', JSON.stringify({ state: { tasks: updatedTasks } }));
};

export const deleteTask = (id: string): void => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('severino-tasks-storage', JSON.stringify({ state: { tasks: filteredTasks } }));
};

// Links functions
export const saveLink = (link: UsefulLink): void => {
  const links = getLinks();
  const existingLinkIndex = links.findIndex(l => l.id === link.id);
  
  if (existingLinkIndex >= 0) {
    links[existingLinkIndex] = { ...link };
  } else {
    links.unshift({
      ...link,
      id: link.id || uuidv4(),
      createdAt: new Date()
    });
  }
  
  localStorage.setItem('severino-links-storage', JSON.stringify({ state: { links } }));
};

export const getLinks = (): UsefulLink[] => {
  try {
    const storedData = localStorage.getItem('severino-links-storage');
    if (!storedData) return [];
    
    const parsedData = JSON.parse(storedData);
    const links = parsedData.state?.links || [];
    
    return links.map((link: any) => ({
      ...link,
      createdAt: toDate(link.createdAt)
    }));
  } catch (error) {
    console.error('Error retrieving links:', error);
    return [];
  }
};

export const deleteLink = (id: string): void => {
  const links = getLinks();
  const filteredLinks = links.filter(link => link.id !== id);
  localStorage.setItem('severino-links-storage', JSON.stringify({ state: { links: filteredLinks } }));
};

// Ideas functions
export const saveIdea = (idea: Idea): void => {
  const ideas = getIdeas();
  const existingIdeaIndex = ideas.findIndex(i => i.id === idea.id);
  
  if (existingIdeaIndex >= 0) {
    ideas[existingIdeaIndex] = { ...idea };
  } else {
    ideas.unshift({
      ...idea,
      id: idea.id || uuidv4(),
      createdAt: new Date()
    });
  }
  
  localStorage.setItem('severino-ideas-storage', JSON.stringify({ state: { ideas } }));
};

export const getIdeas = (): Idea[] => {
  try {
    const storedData = localStorage.getItem('severino-ideas-storage');
    if (!storedData) return [];
    
    const parsedData = JSON.parse(storedData);
    const ideas = parsedData.state?.ideas || [];
    
    return ideas.map((idea: any) => ({
      ...idea,
      createdAt: toDate(idea.createdAt)
    }));
  } catch (error) {
    console.error('Error retrieving ideas:', error);
    return [];
  }
};

export const deleteIdea = (id: string): void => {
  const ideas = getIdeas();
  const filteredIdeas = ideas.filter(idea => idea.id !== id);
  localStorage.setItem('severino-ideas-storage', JSON.stringify({ state: { ideas: filteredIdeas } }));
};

// Clients functions
export const saveClient = (client: Partial<Client> & { name: string; status: ClientStatus; category: ClientCategory }): void => {
  const clients = getClients();
  const existingClientIndex = clients.findIndex(c => c.id === client.id);
  
  if (existingClientIndex >= 0) {
    clients[existingClientIndex] = { 
      ...clients[existingClientIndex],
      ...client,
      updatedAt: new Date()
    };
  } else {
    clients.unshift({
      ...client,
      id: client.id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: client.userId || 'admin'
    } as Client);
  }
  
  localStorage.setItem('severino-clients-storage', JSON.stringify({ state: { clients } }));
};

export const getClients = (): Client[] => {
  try {
    const storedData = localStorage.getItem('severino-clients-storage');
    if (!storedData) return [];
    
    const parsedData = JSON.parse(storedData);
    const clients = parsedData.state?.clients || [];
    
    return clients.map((client: any) => ({
      ...client,
      createdAt: toDate(client.createdAt),
      updatedAt: toDate(client.updatedAt),
      nextContactDate: client.nextContactDate ? toDate(client.nextContactDate) : undefined,
      lastContactDate: client.lastContactDate ? toDate(client.lastContactDate) : undefined
    }));
  } catch (error) {
    console.error('Error retrieving clients:', error);
    return [];
  }
};

export const deleteClient = (id: string): void => {
  if (!id) {
    console.error('deleteClient called with invalid id');
    return;
  }
  
  const clients = getClients();
  const clientToDelete = clients.find(client => client.id === id);
  
  if (!clientToDelete) {
    console.error('Client not found with id:', id);
    return;
  }
  
  const filteredClients = clients.filter(client => client.id !== id);
  localStorage.setItem('severino-clients-storage', JSON.stringify({ state: { clients: filteredClients } }));
  
  console.log('Deletion successful:', clients.length > filteredClients.length);
};

// Financial records functions
export const saveFinancialRecord = (record: FinancialRecord): void => {
  const records = getFinancialRecords();
  const existingRecordIndex = records.findIndex(r => r.id === record.id);
  
  if (existingRecordIndex >= 0) {
    records[existingRecordIndex] = { 
      ...record,
      updatedAt: new Date()
    };
  } else {
    records.unshift({
      ...record,
      id: record.id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  localStorage.setItem('severino-financial-records-storage', JSON.stringify({ state: { records } }));
};

export const getFinancialRecords = (): FinancialRecord[] => {
  try {
    const storedData = localStorage.getItem('severino-financial-records-storage');
    if (!storedData) return [];
    
    const parsedData = JSON.parse(storedData);
    const records = parsedData.state?.records || [];
    
    return records.map((record: any) => ({
      ...record,
      createdAt: toDate(record.createdAt),
      updatedAt: toDate(record.updatedAt),
      date: toDate(record.date)
    }));
  } catch (error) {
    console.error('Error retrieving financial records:', error);
    return [];
  }
};

export const getFinancialRecordsByClient = (clientId: string): FinancialRecord[] => {
  const records = getFinancialRecords();
  return records.filter(record => record.clientId === clientId);
};

export const deleteFinancialRecord = (id: string): void => {
  const records = getFinancialRecords();
  const filteredRecords = records.filter(record => record.id !== id);
  localStorage.setItem('severino-financial-records-storage', JSON.stringify({ state: { records: filteredRecords } }));
};
