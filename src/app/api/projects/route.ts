import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import initialProjects from "@/data/projects.json";

const dataFilePath = path.join(process.cwd(), "src", "data", "projects.json");

function readProjectsFromFile() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, "utf-8");
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.error("Error reading projects.json:", err);
  }
  return initialProjects;
}

function writeProjectsToFile(projects: unknown) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(projects, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing projects.json:", err);
    return false;
  }
}

// GET all projects
export async function GET() {
  const projects = readProjectsFromFile();
  return NextResponse.json(projects);
}

// POST: Add a new project OR replace all projects
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentProjects = readProjectsFromFile();

    if (Array.isArray(body)) {
      // Bulk update/replace
      writeProjectsToFile(body);
      return NextResponse.json({ success: true, projects: body });
    }

    // Single new project
    const newProject = {
      id: body.id || `proj-${Date.now()}`,
      number: String(currentProjects.length + 1).padStart(2, "0"),
      title: body.title || "Untitled Project",
      category: body.category || "Architecture",
      location: body.location || "Islamabad, Pakistan",
      year: body.year || new Date().getFullYear().toString(),
      client: body.client || "Client Project",
      description: body.description || "",
      image: body.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      featured: Boolean(body.featured),
      tags: Array.isArray(body.tags) ? body.tags : ["Architecture"],
      status: body.status || "Completed",
    };

    const updated = [newProject, ...currentProjects];
    writeProjectsToFile(updated);

    return NextResponse.json({ success: true, project: newProject, projects: updated });
  } catch (error) {
    console.error("Failed to process POST /api/projects:", error);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}

// PUT: Update an existing project
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const currentProjects = readProjectsFromFile();
    const index = currentProjects.findIndex((p: { id: string }) => p.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    currentProjects[index] = {
      ...currentProjects[index],
      ...body,
    };

    writeProjectsToFile(currentProjects);
    return NextResponse.json({ success: true, project: currentProjects[index], projects: currentProjects });
  } catch (error) {
    console.error("Failed to process PUT /api/projects:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE: Remove a project
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const currentProjects = readProjectsFromFile();
    const filtered = currentProjects.filter((p: { id: string }) => p.id !== id);

    writeProjectsToFile(filtered);
    return NextResponse.json({ success: true, projects: filtered });
  } catch (error) {
    console.error("Failed to process DELETE /api/projects:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
