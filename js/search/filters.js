
import { loadProfiles } from "./profiles.js";

// =============================
// DEBOUNCE TIMER
// =============================
let timeout = null;


// =============================
// SEARCH USERS (TEXT / INPUT)
// =============================
export function searchUsers() {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    loadProfiles();
  }, 300);
}


// =============================
// GET FILTER VALUES
// =============================
export function getFilters() {
  const age = document.getElementById("searchAge")?.value || null;
  const city = document.getElementById("searchCity")?.value || null;
  const lookingFor = document.getElementById("searchLookingFor")?.value || null;

  return {
    age,
    city,
    lookingFor
  };
}


// =============================
// APPLY FILTERS (GLOBAL STATE)
// =============================
export function applyFilters(query) {
  const { age, city, lookingFor } = getFilters();

  // AGE FILTER (ex: 18-25)
  if (age) {
    const [min, max] = age.split("-");
    query = query.gte("age", min).lte("age", max);
  }

  // CITY FILTER
  if (city && city.trim() !== "") {
    query = query.ilike("ville", `%${city}%`);
  }

  // LOOKING FOR FILTER
  if (lookingFor && lookingFor.trim() !== "") {
    query = query.ilike("lookingfor", `%${lookingFor}%`);
  }

  return query;
}


// =============================
// RESET FILTERS
// =============================
export function resetFilters() {
  const age = document.getElementById("searchAge");
  const city = document.getElementById("searchCity");
  const lookingFor = document.getElementById("searchLookingFor");

  if (age) age.value = "";
  if (city) city.value = "";
  if (lookingFor) lookingFor.value = "";

  loadProfiles();
}