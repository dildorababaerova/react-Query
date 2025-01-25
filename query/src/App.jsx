import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotes, createNote, updateNote } from './requests';

const App = () => {
  const queryClient = useQueryClient();

  // mutation for creating a new note
  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes']);
      queryClient.setQueryData(['notes'], [...notes, newNote]);
    },
  });

  // mutation for updating a note
  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
  });

  // function to add a new note
  const addNote = (event) => {
    event.preventDefault();
    const content = event.target.note.value;
    event.target.note.value = '';
    newNoteMutation.mutate({ content, important: false });
  };

  // function to toggle importance of a note
  const toggleImportance = (note) => {
    updateNoteMutation.mutate(
      { ...note, important: !note.important },
      {
        onSuccess: () => {
          const notes = queryClient.getQueryData(['notes']);
          queryClient.setQueryData(
            ['notes'],
            notes.map((n) =>
              n.id === note.id ? { ...n, important: !n.important } : n
            )
          );
        },
      }
    );
  };

  // request to get notes
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false,
  });

  if (result.isLoading) {
    return <div>Loading...</div>;
  }

  if (result.isError) {
    return <div>Error loading notes: {result.error.message}</div>;
  }

  const notes = result.data;

  return (
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {notes.map((note) => (
          <li key={note.id} onClick={() => toggleImportance(note)}>
            {note.content}{' '}
            <strong>{note.important ? 'important' : ''}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
