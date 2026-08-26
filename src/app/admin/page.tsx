"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Project,
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  getLocalProjects,
  saveLocalProjects,
} from "@/lib/projects";
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  Search,
  LayoutGrid,
  List,
  Lock,
  LogOut,
  Upload,
  Sparkles,
  CheckCircle,
  Building2,
  Eye,
  MapPin,
  Calendar,
  User,
  Tag,
  AlertTriangle,
  X,
  Layers,
} from "lucide-react";

const ADMIN_PASSCODE = "raza2026";
const AUTH_STORAGE_KEY = "raza_jan_admin_auth_v1";

const SAMPLE_IMAGE_PRESETS = [
  { label: "Luxury Villa", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop" },
  { label: "Modern Interior", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" },
  { label: "Urban Plaza", url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop" },
  { label: "3D Penthouse", url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop" },
  { label: "Commercial Hub", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" },
  { label: "Civic Facade", url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1200&auto=format&fit=crop" },
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Architecture",
    location: "Islamabad, Pakistan",
    year: new Date().getFullYear().toString(),
    client: "",
    description: "",
    image: SAMPLE_IMAGE_PRESETS[0].url,
    featured: false,
    tags: "Architecture, 3D Visualization",
    status: "Completed" as Project["status"],
  });

  // Check Auth on mount
  useEffect(() => {
    const isAuth = localStorage.getItem(AUTH_STORAGE_KEY) === "true";
    setIsAuthenticated(isAuth);
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      // First try API
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
          saveLocalProjects(data);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("API fetch failed, falling back to local projects", e);
    }

    // Fallback to local
    const local = getLocalProjects();
    setProjects(local);
    setIsLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      setAuthError("");
      showToast("Welcome back, Raza Jan!");
    } else {
      setAuthError("Incorrect Passcode. Try 'raza2026'");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setPasscode("");
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      category: "Architecture",
      location: "Islamabad, Pakistan",
      year: new Date().getFullYear().toString(),
      client: "",
      description: "",
      image: SAMPLE_IMAGE_PRESETS[0].url,
      featured: false,
      tags: "Architecture, 3D Visualization",
      status: "Completed",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      category: proj.category,
      location: proj.location,
      year: proj.year,
      client: proj.client,
      description: proj.description,
      image: proj.image,
      featured: proj.featured,
      tags: proj.tags.join(", "),
      status: proj.status,
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProject) {
      // UPDATE
      const updatedItem: Project = {
        ...editingProject,
        title: formData.title,
        category: formData.category,
        location: formData.location,
        year: formData.year,
        client: formData.client,
        description: formData.description,
        image: formData.image,
        featured: formData.featured,
        tags: tagArray.length > 0 ? tagArray : ["Architecture"],
        status: formData.status,
      };

      const updatedList = projects.map((p) => (p.id === editingProject.id ? updatedItem : p));
      setProjects(updatedList);
      saveLocalProjects(updatedList);

      try {
        await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedItem),
        });
      } catch (err) {
        console.warn("Server sync error", err);
      }

      showToast(`Updated "${formData.title}"`);
    } else {
      // CREATE
      const newItem: Project = {
        id: `proj-${Date.now()}`,
        number: String(projects.length + 1).padStart(2, "0"),
        title: formData.title,
        category: formData.category,
        location: formData.location,
        year: formData.year,
        client: formData.client,
        description: formData.description,
        image: formData.image,
        featured: formData.featured,
        tags: tagArray.length > 0 ? tagArray : ["Architecture"],
        status: formData.status,
      };

      const updatedList = [newItem, ...projects];
      setProjects(updatedList);
      saveLocalProjects(updatedList);

      try {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newItem),
        });
      } catch (err) {
        console.warn("Server sync error", err);
      }

      showToast(`Created project "${formData.title}"`);
    }

    setIsModalOpen(false);
  };

  const handleToggleFeatured = async (id: string) => {
    const updatedList = projects.map((p) => {
      if (p.id === id) {
        return { ...p, featured: !p.featured };
      }
      return p;
    });

    setProjects(updatedList);
    saveLocalProjects(updatedList);

    const changed = updatedList.find((p) => p.id === id);
    if (changed) {
      try {
        await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changed),
        });
      } catch (e) {
        console.warn(e);
      }
      showToast(changed.featured ? "Marked as Featured" : "Removed from Featured");
    }
  };

  const handleDeleteProject = async (id: string) => {
    const filtered = projects.filter((p) => p.id !== id);
    setProjects(filtered);
    saveLocalProjects(filtered);

    try {
      await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Server delete error", err);
    }

    setDeleteConfirmationId(null);
    showToast("Project deleted successfully");
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate Metrics
  const totalCount = projects.length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const inProgressCount = projects.filter((p) => p.status === "In Progress").length;
  const categoriesCount = new Set(projects.map((p) => p.category)).size;

  // ══════════════════════════════════════════════════════════════
  // AUTHENTICATION LOGIN SCREEN
  // ══════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] text-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background architectural grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C8A84E_1px,transparent_1px)] [background-size:24px_24px]" />

        <motion.div
          className="w-full max-w-md bg-[#161616] border border-[#2B2B2B] p-8 sm:p-10 rounded-2xl shadow-2xl relative z-10 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo / Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#222222] border border-[var(--color-accent)]/30 flex items-center justify-center mx-auto text-[var(--color-accent)]">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              Studio Admin Portal
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#9C9A94]">
              Syed Raza Jan &middot; Portfolio CMS
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09E96] mb-2">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. raza2026)"
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333333] rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[var(--color-accent)] text-[#0A0A0A] font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-[#B8962E] transition-all shadow-md cursor-pointer"
            >
              Access Dashboard
            </button>
          </form>

          <div className="pt-4 border-t border-[#262626] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-[#8A8882] hover:text-white transition-colors"
            >
              <span>Return to Public Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // AUTHENTICATED ADMIN DASHBOARD
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0DFDC] font-sans">
      
      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-[#1C1C1C] border border-[var(--color-accent)] text-white text-xs font-semibold tracking-wide rounded-xl shadow-2xl flex items-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <CheckCircle className="w-4 h-4 text-[var(--color-accent)]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Navigation Bar ── */}
      <header className="border-b border-[#222222] bg-[#111111]/90 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-10 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Studio Brand */}
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-[#1F1F1F] border border-[var(--color-accent)]/40 flex items-center justify-center font-display font-bold text-xs text-[var(--color-accent)]">
              SRJ
            </div>
            <div>
              <h1 className="font-display font-bold text-base text-white tracking-wide">
                Syed Raza Jan
              </h1>
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-accent)] font-semibold">
                Architecture Projects CMS
              </p>
            </div>
          </div>

          {/* Action Header Tools */}
          <div className="flex items-center gap-3">
            <Link
              href="/#projects"
              target="_blank"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333333] text-xs text-[#C8C6C0] rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              <span>Live Website</span>
            </Link>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-[#0A0A0A] font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-[#B8962E] transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333333] text-[#A09E96] hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* ── Main Dashboard Content ── */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-10 space-y-10">
        
        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#141414] border border-[#262626] p-5 rounded-xl space-y-1">
            <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#888888]">
              Total Projects
            </span>
            <div className="font-display text-3xl font-bold text-white">
              {totalCount}
            </div>
          </div>

          <div className="bg-[#141414] border border-[#262626] p-5 rounded-xl space-y-1">
            <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[var(--color-accent)] flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-current" />
              <span>Featured</span>
            </span>
            <div className="font-display text-3xl font-bold text-[var(--color-accent)]">
              {featuredCount}
            </div>
          </div>

          <div className="bg-[#141414] border border-[#262626] p-5 rounded-xl space-y-1">
            <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#888888]">
              Disciplines
            </span>
            <div className="font-display text-3xl font-bold text-white">
              {categoriesCount}
            </div>
          </div>

          <div className="bg-[#141414] border border-[#262626] p-5 rounded-xl space-y-1">
            <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-emerald-400">
              In Progress
            </span>
            <div className="font-display text-3xl font-bold text-emerald-400">
              {inProgressCount}
            </div>
          </div>
        </div>

        {/* ── Controls: Search, Categories & View Toggle ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, client, or tag..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#2B2B2B] rounded-lg text-sm text-white placeholder-[#666666] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>

          {/* Category Filter Pills & View Mode */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {PROJECT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-[var(--color-accent)] text-black font-bold"
                      : "bg-[#141414] text-[#9E9C96] hover:text-white border border-[#262626]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#141414] border border-[#2B2B2B] rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#282828] text-white" : "text-[#777777]"}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded ${viewMode === "table" ? "bg-[#282828] text-white" : "text-[#777777]"}`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* ── Project List / Grid ── */}
        {isLoading ? (
          <div className="py-20 text-center text-[#777777] text-sm">
            Loading architectural portfolio projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#121212] border border-[#222222] rounded-2xl">
            <Building2 className="w-8 h-8 text-[#555555] mx-auto" />
            <p className="text-white font-medium text-base">No projects found</p>
            <p className="text-xs text-[#777777]">Try adjusting your search query or add a new project.</p>
            <button
              onClick={openAddModal}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-black font-bold text-xs rounded-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Project</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          
          /* ── GRID VIEW ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                className="group bg-[#141414] border border-[#262626] hover:border-[var(--color-accent)]/60 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col"
              >
                {/* Project Image */}
                <div className="relative aspect-[16/10] bg-[#1E1E1E] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#0A0A0A]/85 backdrop-blur-md text-[0.65rem] font-bold tracking-wider uppercase text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                      {project.category}
                    </span>
                    {project.status === "In Progress" && (
                      <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 text-[0.6rem] font-bold uppercase">
                        In Progress
                      </span>
                    )}
                  </div>

                  {/* Featured Star Toggle */}
                  <button
                    onClick={() => handleToggleFeatured(project.id)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-lg backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer ${
                      project.featured
                        ? "bg-[var(--color-accent)] text-black shadow-md"
                        : "bg-[#0A0A0A]/70 text-[#777777] hover:text-white"
                    }`}
                    title={project.featured ? "Featured showcase" : "Mark as featured"}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Project Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#8A8882]">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[var(--color-accent)]" />
                        <span>{project.location}</span>
                      </span>
                      <span className="font-semibold">{project.year}</span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-white leading-snug">
                      {project.title}
                    </h3>

                    {project.client && (
                      <p className="text-xs text-[var(--color-accent)] font-medium">
                        Client: {project.client}
                      </p>
                    )}

                    <p className="text-xs text-[#8A8882] line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags & Action Buttons */}
                  <div className="pt-3 border-t border-[#222222] flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5 max-w-[60%]">
                      {project.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-[#1C1C1C] text-[#9E9C96] text-[0.6rem] rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-2 bg-[#1F1F1F] hover:bg-[var(--color-accent)] hover:text-black text-[#A09E96] rounded-lg transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmationId(project.id)}
                        className="p-2 bg-[#1F1F1F] hover:bg-red-500 hover:text-white text-[#A09E96] rounded-lg transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          
          /* ── TABLE VIEW ── */
          <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1C1C1C] text-[#888888] uppercase tracking-wider font-semibold border-b border-[#262626]">
                  <tr>
                    <th className="py-3.5 px-4">Project</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Year</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Featured</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-[#181818] transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-[#222222] overflow-hidden shrink-0">
                          <Image src={project.image} alt={project.title} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{project.title}</div>
                          {project.client && <div className="text-[#777777]">{project.client}</div>}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--color-accent)] font-medium">
                        {project.category}
                      </td>
                      <td className="py-3.5 px-4 text-[#AAAAAA]">{project.location}</td>
                      <td className="py-3.5 px-4 text-[#AAAAAA]">{project.year}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[0.65rem] font-semibold ${
                          project.status === "Completed"
                            ? "bg-blue-900/40 text-blue-300"
                            : project.status === "In Progress"
                            ? "bg-emerald-900/40 text-emerald-300"
                            : "bg-purple-900/40 text-purple-300"
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(project.id)}
                          className={`p-1.5 rounded cursor-pointer ${
                            project.featured ? "text-[var(--color-accent)]" : "text-[#555555] hover:text-white"
                          }`}
                        >
                          <Star className={`w-4 h-4 ${project.featured ? "fill-current" : ""}`} />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-1.5 bg-[#222222] hover:bg-[var(--color-accent)] hover:text-black rounded text-[#AAAAAA] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmationId(project.id)}
                          className="p-1.5 bg-[#222222] hover:bg-red-500 hover:text-white rounded text-[#AAAAAA] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: ADD / EDIT PROJECT
          ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              className="w-full max-w-2xl bg-[#141414] border border-[#2B2B2B] rounded-2xl shadow-2xl overflow-hidden my-8"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#242424] flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-lg text-white">
                    {editingProject ? "Edit Project Details" : "Add New Architectural Project"}
                  </h2>
                  <p className="text-xs text-[#8A8882]">
                    {editingProject ? "Update portfolio entry & media" : "Publish new project to live showcase"}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-[#222222] text-[#888888] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveProject} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09E96] mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Cecil Luxury Resort & Villas"
                    className="w-full px-4 py-2.5 bg-[#0C0C0C] border border-[#2E2E2E] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09E96] mb-1.5">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#0C0C0C] border border-[#2E2E2E] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-accent)]"
                    >
                      {PROJECT_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09E96] mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Project["status"] })}
                      className="w-full px-3 py-2.5 bg-[#0C0C0C] border border-[#2E2E2E] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-accent)]"
                    >
                      {PROJECT_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09E96] mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Islamabad, Pakistan"
                      className="w-full px-4 py-2.5 bg-[#0C0C0C] border border-[#2E2E2E] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09E96] mb-1.5">
                      Year / Period
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="e.g. 2025 – 2026"
                      className="w-full px-4 py-2.5 bg-[#0C0C0C] border border-[#2E2E2E] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                </div>

                {/* Client */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09E96] mb-1.5">
                    Client / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Lakhani Group & Canopy Resorts"
                    className="w-full px-4 py-2.5 bg-[#0C0C0C] border border-[#2E2E2E] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                {/* Image URL & Presets */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09E96]">
                    Project Image (URL or Upload)
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Paste image URL (https://...)"
                    className="w-full px-4 py-2.5 bg-[#0C0C0C] border border-[#2E2E2E] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--color-accent)]"
                  />

                  {/* Upload file button & Quick presets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#222222] hover:bg-[#2F2F2F] border border-[#3A3A3A] text-xs text-[#D0CEC6] rounded cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                      <span>Upload Local Photo</span>
                      <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                    </label>

                    <span className="text-xs text-[#666666]">or sample preset:</span>
                    {SAMPLE_IMAGE_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[0.65rem] text-[#9E9C96] rounded border border-[#2B2B2B] transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#2A2A2A] bg-[#1E1E1E] mt-2">
                      <Image src={formData.image} alt="Preview" fill className="object-cover" />
                      <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[0.6rem] text-white">
                        Live Preview
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09E96] mb-1.5">
                    Architectural Overview &amp; Scope *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the architectural concept, design solutions, and deliverables..."
                    className="w-full px-4 py-2.5 bg-[#0C0C0C] border border-[#2E2E2E] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-accent)] leading-relaxed"
                  />
                </div>

                {/* Tags & Featured */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A09E96] mb-1.5">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g. Master Plan, 3ds Max, Hospitality"
                      className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#2E2E2E] rounded-lg text-xs text-white focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>

                  <div className="sm:col-span-4 pt-4 sm:pt-0 flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="featuredCheckbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 accent-[var(--color-accent)] rounded cursor-pointer"
                    />
                    <label htmlFor="featuredCheckbox" className="text-xs font-bold text-white cursor-pointer select-none">
                      Featured Showcase ⭐
                    </label>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-4 border-t border-[#242424] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-[#222222] hover:bg-[#2A2A2A] text-[#A09E96] hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[var(--color-accent)] text-black font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-[#B8962E] transition-all shadow-md cursor-pointer"
                  >
                    {editingProject ? "Save Changes" : "Create Project"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          CONFIRMATION DIALOG: DELETE
          ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {deleteConfirmationId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              className="w-full max-w-sm bg-[#161616] border border-[#2E2E2E] rounded-2xl p-6 shadow-2xl space-y-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Delete this project?</h3>
              <p className="text-xs text-[#8A8882] leading-relaxed">
                This project will be removed from your active portfolio. You can always re-add it later.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmationId(null)}
                  className="px-4 py-2 bg-[#262626] hover:bg-[#333333] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProject(deleteConfirmationId)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md"
                >
                  Delete Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
