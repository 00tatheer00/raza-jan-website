export interface Project {
  id: string;
  number?: string;
  title: string;
  category: string;
  location: string;
  year: string;
  client?: string;
  description: string;
  image: string;
  featured: boolean;
  tags: string[];
  status?: "Completed" | "In Progress" | "Concept" | "COMPLETED" | "IN PROGRESS" | string;
}

export const PROJECT_CATEGORIES = [
  "All Categories",
  "Architecture",
  "Interior",
  "3D Visualization",
  "Master Planning",
  "Residential",
  "Commercial",
] as const;

export const PROJECT_STATUSES = ["IN PROGRESS", "COMPLETED", "In Progress", "Completed", "Concept"] as const;

const LOCAL_STORAGE_KEY = "raza_jan_portfolio_projects_v2";

export function getLocalProjects(): Project[] {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require("@/data/projects.json");
    } catch {
      return [];
    }
  }

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to read projects from localStorage", e);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("@/data/projects.json");
  } catch {
    return [];
  }
}

export function saveLocalProjects(projects: Project[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent("portfolio_projects_updated", { detail: projects }));
  } catch (e) {
    console.error("Failed to save projects to localStorage", e);
  }
}
