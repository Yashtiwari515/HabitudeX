const API_BASE = "http://192.168.29.24:5000/api/habit";

// Get all habits
export const getHabits = async (token) => {
  const res = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

// Add habit
export const addHabit = async (data, token) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Toggle complete
export const toggleComplete = async (id, token) => {
  const res = await fetch(`${API_BASE}/${id}/complete`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

// Edit habit
export const updateHabit = async (id, updates, token) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  return res.json();
};

// Delete habit
export const deleteHabit = async (id, token) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
