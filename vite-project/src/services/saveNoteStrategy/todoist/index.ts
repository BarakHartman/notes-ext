import { TodoistAPI } from 'todoist-sdk';
const api = new TodoistAPI("d49d687c40037e392f55492004e0aa095f5ffaff"); // Uses env var
// export async function basicTodoistFunctionality() {
//     console.log("--- Connecting to Todoist ---");

//     // 2. Fetch Projects
//     const projects = await api.fetch.getProjects();
//     const inbox = projects.find(p => p.is_inbox_project);
//     console.log(`Found ${projects.length} projects. Inbox ID: ${inbox?.id}`);

//     // 3. Create a Task
//     const newTask = await api.edit.createTask({
//       content: "Buy milk via TypeScript",
//       description: "Organic whole milk",
//       due_string: "tomorrow at 10am",
//       priority: 4 // 4 is highest priority (red flag)
//     });
//     console.log(`Created Task: ${newTask.content} (ID: ${newTask.id})`);

//     // 4. List Tasks in Inbox
//     if (inbox) {
//       const tasks = await api.fetch.getTasks(inbox.id);
//       console.log(`Current Inbox Tasks: ${tasks.map(t => t.content).join(", ")}`);
//     }

//     // 5. Close the task we just created
//     // await api.edit.closeTask(newTask.id);
//     console.log("Task completed!");
// }

export async function getTasks(){
    //todo: add project ID
    return api.fetch.getTasks('projectId');
}

export async function addTask(){
    // Create a Task
    //todo
    //     const newTask = await api.edit.createTask({
    //       content: "Buy milk via TypeScript",
    //       description: "Organic whole milk",
    //       due_string: "tomorrow at 10am",
    //       priority: 4 // 4 is highest priority (red flag)
    //     });
    //     console.log(`Created Task: ${newTask.content} (ID: ${newTask.id})`);
}