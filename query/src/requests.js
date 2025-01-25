import axios from "axios";

const baseUrl="http://localhost:3001/notes";

export const getNotes = () => 
  axios.get(baseUrl).then((response) => response.data);

export const createNote = newNote =>
    axios.post(baseUrl, newNote).then((response) => response.data);

export const updateNote = updateNote =>
    axios.put(`${baseUrl}/${updateNote.id}`, updateNote).then((response) => response.data);

