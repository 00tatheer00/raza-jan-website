import initialProjects from "@/data/projects.json";

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  location: string;
  year: string;
  client: string;
  description: string;
  image: string;
  featured: boolean;
  tags: string[];
  status: "Completed" | "In Progress" | "Concept";
}

export const PROJECT_CATEGORIES = [
  "All",
  "Architecture",
  "Interior",
  "3D Visualization",
  "Master Planning",
  "Residential",
  "Commercial",
] as const;

export const PROJECT_STATUSES = ["Completed", "In Progress", "Concept"] as const;

const STORAGE_KEY = "raza_jan_portfolio_projects_v1";

// Helper to get projects from localStorage (client) or initial JSON (server)
export function getLocalProjects(): Project[] {
  if (typeof window === "undefined") {
    return initialProjects as Project[];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read projects from storage", err);
  }

  return initialProjects as Project[];
}

// Helper to save projects to localStorage (client)
export function saveLocalProjects(projects: Project[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new Event("portfolio_projects_updated"));
  } catch (err) {
    console.error("Failed to save projects to storage", err);
  }
}
