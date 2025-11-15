// client/services/journalService.js
import API from "./api";

export const addJournal = async (text) => {
  const { data } = await API.post("/journal/add", { text });
  return data; // e.g. { emotion: "Happy", score: 0.8 }
};

export const getJournals = async () => {
  const { data } = await API.get("/journal");
  return data; // Array of journals
};

export const deleteJournal = async (id) => {
  const { data } = await API.delete(`/journal/${id}`);
  return data;
};

