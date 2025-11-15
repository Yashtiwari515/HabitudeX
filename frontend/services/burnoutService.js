// client/services/burnoutService.js
import API from "./api";

export const getBurnout = async () => {
  // expects backend to return an object with scores, e.g.:
  // { stressScore: 40, workloadScore: 55, emotionalScore: 30, burnoutRisk: 45 }
  const { data } = await API.get("/burnout");
  return data;
};
