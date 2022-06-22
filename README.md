What types do I have?

The fundamental Todo type which is displayed and then subsequently saved

interface Todo {
todo: string;
completed: string | boolean;
id: string;
status?: string | boolean;
created_at?: string;
}
