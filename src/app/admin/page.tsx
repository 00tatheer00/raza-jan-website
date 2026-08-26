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
  Search,
  LayoutGrid,
  List,
  LogOut,
  Upload,
  CheckCircle2,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Bell,
  Check,
  BarChart3,
  Image as ImageIcon,
  Users,
  Compass,
  X,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  Globe,
  FolderKanban,
} from "lucide-react";

interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: "success" | "info" | "error";
}

const SAMPLE_IMAGE_PRESETS = [
  { label: "Resort Villas", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop" },
  { label: "Waterfront Plaza", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop" },
  { label: "Luxury Residence", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" },
  { label: "Healthcare Center", url: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1200&auto=format&fit=crop" },
  { label: "3D Residence", url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop" },
  { label: "Commercial Strip", url: "https://images.unsplash.com/photo-1555636222-cae831e670b3?q=80&w=1200&auto=format&fit=crop" },
];

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeNav, setActiveNav] = useState<"projects" | "analytics" | "media" | "team">("projects");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Notifications & Toast system
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "n1", title: "Showcase Synced", desc: "Live portfolio updated successfully.", time: "2m ago", read: false },
    { id: "n2", title: "PWA Active", desc: "Offline service worker installed.", time: "1h ago", read: true },
  ]);

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // Form inputs
  const [formData, setFormData] = useState({
    title: "",
    category: "ARCHITECTURE",
    location: "Murree Hills, Pakistan",
    year: "2025 – 2026",
    client: "Lahore Group & Canopy Resorts",
    description: "",
    image: SAMPLE_IMAGE_PRESETS[0].url,
    featured: false,
    tags: "Hospitality, Site Planning",
    status: "IN PROGRESS" as Project["status"],
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
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
      console.warn("Using local fallback", e);
    }
    const local = getLocalProjects();
    setProjects(local);
    setIsLoading(false);
  };

  const addToast = (title: string, message?: string, type: ToastItem["type"] = "success") => {
    const id = `t-${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const openCreateForm = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      category: "ARCHITECTURE",
      location: "Islamabad, Pakistan",
      year: new Date().getFullYear().toString(),
      client: "",
      description: "",
      image: SAMPLE_IMAGE_PRESETS[0].url,
      featured: false,
      tags: "Hospitality, Site Planning",
      status: "IN PROGRESS",
    });
    setIsFormOpen(true);
  };

  const openEditForm = (proj: Project) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      category: proj.category.toUpperCase(),
      location: proj.location,
      year: proj.year,
      client: proj.client || "",
      description: proj.description,
      image: proj.image,
      featured: proj.featured,
      tags: proj.tags.join(", "),
      status: (proj.status ? proj.status.toUpperCase() : "COMPLETED") as any,
    });
    setIsFormOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      addToast("Title required", "Please enter a project title", "error");
      return;
    }

    const tagArr = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProject) {
      const updated: Project = {
        ...editingProject,
        ...formData,
        tags: tagArr.length > 0 ? tagArr : ["Hospitality", "Site Planning"],
      };

      const updatedList = projects.map((p) => (p.id === editingProject.id ? updated : p));
      setProjects(updatedList);
      saveLocalProjects(updatedList);

      try {
        await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
      } catch (err) {
        console.warn(err);
      }

      addToast("Project Updated", `"${formData.title}" saved.`);
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        number: String(projects.length + 1).padStart(2, "0"),
        ...formData,
        tags: tagArr.length > 0 ? tagArr : ["Hospitality", "Site Planning"],
      };

      const updatedList = [newProj, ...projects];
      setProjects(updatedList);
      saveLocalProjects(updatedList);

      try {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProj),
        });
      } catch (err) {
        console.warn(err);
      }

      addToast("Project Created", `"${formData.title}" added to portfolio.`);
    }

    setIsFormOpen(false);
  };

  const handleToggleFeatured = async (id: string) => {
    const updatedList = projects.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p));
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
      addToast(
        changed.featured ? "Featured Showcase" : "Removed from Featured",
        `"${changed.title}" updated`
      );
    }
  };

  const handleDeleteProject = async (id: string) => {
    const deleted = projects.find((p) => p.id === id);
    const filtered = projects.filter((p) => p.id !== id);
    setProjects(filtered);
    saveLocalProjects(filtered);

    try {
      await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn(err);
    }

    setDeleteTarget(null);
    addToast("Project Deleted", `"${deleted?.title || "Item"}" removed`, "info");
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
          addToast("Photo Uploaded", file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Metrics
  const totalCommissions = projects.length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const activeExecutionCount = projects.filter(
    (p) => p.status?.toUpperCase() === "IN PROGRESS" || p.status === "In Progress"
  ).length;
  const completedCount = projects.filter(
    (p) => p.status?.toUpperCase() === "COMPLETED" || p.status === "Completed"
  ).length;

  // Filter & Sort
  const filteredProjects = projects
    .filter((p) => {
      const catMatches =
        selectedCategory === "All Categories" ||
        selectedCategory === "All" ||
        p.category.toUpperCase() === selectedCategory.toUpperCase();

      const statusMatches =
        selectedStatus === "All" ||
        p.status?.toUpperCase() === selectedStatus.toUpperCase();

      return catMatches && statusMatches;
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "oldest") return a.year.localeCompare(b.year);
      return b.year.localeCompare(a.year);
    });

  return (
    <div className="min-h-screen bg-[#090A0D] text-[#E0DFDC] font-sans flex antialiased">
      
      {/* ── TOAST NOTIFICATIONS ── */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className="p-4 rounded-xl shadow-2xl backdrop-blur-md border border-[#2B2F3E] bg-[#161922]/95 text-white pointer-events-auto flex items-start gap-3 text-xs"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                {toast.type === "error" && <AlertTriangle className="w-4 h-4 text-red-400" />}
                {toast.type === "info" && <Sparkles className="w-4 h-4 text-blue-400" />}
              </div>
              <div className="flex-1">
                <div className="font-bold tracking-wide text-white">{toast.title}</div>
                {toast.message && <div className="text-[#8A8F9E] mt-0.5">{toast.message}</div>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════════════════
          1. FIXED/STICKY LEFT SIDEBAR (EXACT PIXEL SPACING)
          ══════════════════════════════════════════════════════════ */}
      <aside className="w-[260px] shrink-0 bg-[#07080B] border-r border-[#15171E] sticky top-0 h-screen hidden md:flex flex-col justify-between p-6 z-20 select-none overflow-y-auto">
        
        <div className="space-y-7">
          
          {/* Top Logo: EEST Architecture Studio Monogram */}
          <div className="flex items-center gap-3 pt-1">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <rect x="2" y="2" width="36" height="36" rx="4" stroke="#D4AF37" strokeWidth="2.5" />
              <path d="M12 12H28V20H20V28H12V12Z" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 20H28V28H20V20Z" stroke="#D4AF37" strokeWidth="2.5" fill="#D4AF37"/>
            </svg>

            <div>
              <div className="font-display font-semibold text-[13px] tracking-[0.25em] text-[#D4AF37] leading-none">
                E E S T
              </div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#7A7E8D] mt-1.5 font-medium">
                ARCHITECTURE STUDIO
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-6 pt-1">
            
            {/* Group 1: STUDIO MANAGEMENT */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555966] px-3 mb-2">
                STUDIO MANAGEMENT
              </div>

              <div className="space-y-1.5">
                {/* Active Projects Portfolio Button (Solid Gold) */}
                <button
                  onClick={() => setActiveNav("projects")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold tracking-wide transition-all cursor-pointer ${
                    activeNav === "projects"
                      ? "bg-[#D4AF37] text-[#0B0C10] font-bold shadow-sm"
                      : "text-[#8E93A4] hover:text-white hover:bg-[#14161F]"
                  }`}
                >
                  <FolderKanban className="w-4 h-4 shrink-0" />
                  <span>Projects Portfolio</span>
                </button>

                <button
                  onClick={() => setActiveNav("analytics")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium tracking-wide transition-all cursor-pointer ${
                    activeNav === "analytics"
                      ? "bg-[#D4AF37] text-[#0B0C10] font-bold shadow-sm"
                      : "text-[#8E93A4] hover:text-white hover:bg-[#14161F]"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span>Metrics &amp; Analytics</span>
                </button>

                <button
                  onClick={() => setActiveNav("media")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium tracking-wide transition-all cursor-pointer ${
                    activeNav === "media"
                      ? "bg-[#D4AF37] text-[#0B0C10] font-bold shadow-sm"
                      : "text-[#8E93A4] hover:text-white hover:bg-[#14161F]"
                  }`}
                >
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  <span>Media Presets</span>
                </button>

                <button
                  onClick={() => setActiveNav("team")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium tracking-wide transition-all cursor-pointer ${
                    activeNav === "team"
                      ? "bg-[#D4AF37] text-[#0B0C10] font-bold shadow-sm"
                      : "text-[#8E93A4] hover:text-white hover:bg-[#14161F]"
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Team &amp; Members</span>
                </button>
              </div>
            </div>

            {/* Group 2: PUBLIC */}
            <div className="space-y-2 pt-2 border-t border-[#14161D]">
              <Link
                href="/#projects"
                target="_blank"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium tracking-wide text-[#8E93A4] hover:text-[#D4AF37] hover:bg-[#14161F] transition-all"
              >
                <Globe className="w-4 h-4 shrink-0" />
                <span>View Public Portfolio</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom Profile Section */}
        <div className="space-y-3 pt-4 border-t border-[#14161D]">
          <div className="flex items-center gap-3 px-1">
            {/* Circular SRJ Badge */}
            <div className="w-9 h-9 rounded-full border-2 border-[#D4AF37]/60 bg-[#12131A] flex items-center justify-center font-display font-bold text-xs text-[#D4AF37] shrink-0">
              SRJ
            </div>
            <div className="truncate">
              <div className="font-display font-medium text-[13px] text-white truncate">
                Syed Raza Jan
              </div>
              <div className="text-[11px] text-[#7A7E8D] truncate">
                Principal Architect
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="w-full flex items-center gap-2 px-2 py-1 text-xs text-[#6A6E7D] hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log out</span>
          </Link>
        </div>

      </aside>

      {/* ══════════════════════════════════════════════════════════
          2. MAIN DASHBOARD CONTENT AREA (PERFECT MARGINS & PADDING)
          ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col p-6 sm:p-8 lg:p-10 space-y-7 bg-[#090A0D]">
        
        {/* ── MAIN HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#7A7E8D]">Welcome back,</div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
              Syed Raza Jan
            </h1>
            <p className="text-xs text-[#7A7E8D] mt-0.5">
              Here&apos;s what&apos;s happening with your studio today.
            </p>
          </div>

          {/* Right Header Buttons: + Create Project & Notification */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCreateForm}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#C29F2F] text-[#000000] font-bold text-xs rounded-lg transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>

            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="p-2.5 rounded-lg bg-[#11131A] hover:bg-[#1A1D26] border border-[#1E212A] text-[#8E93A4] hover:text-white transition-colors cursor-pointer relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 text-[0.6rem] font-bold bg-transparent text-[#7A7E8D]">
                  0
                </span>
              </button>

              <AnimatePresence>
                {isNotifDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-3 w-80 bg-[#161922] border border-[#2B2F3E] rounded-2xl shadow-2xl p-4 z-50 space-y-3"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#222632]">
                      <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
                        Studio Notifications
                      </span>
                      <span className="text-[0.65rem] text-[#D4AF37]">Active</span>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-[#11131A] border border-[#20232E] text-xs">
                          <div className="font-bold text-white">{n.title}</div>
                          <div className="text-[0.7rem] text-[#8A8F9E] mt-0.5">{n.desc}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── 4 LARGE STATISTICS CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: TOTAL COMMISSIONS */}
          <div className="bg-[#11131A] border border-[#1E212A] rounded-2xl p-5 flex items-center gap-4.5">
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/40 bg-[#181A22] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A7E8D]">
                TOTAL COMMISSIONS
              </div>
              <div className="font-display text-2xl font-bold text-white mt-0.5">
                {totalCommissions}
              </div>
              <div className="text-[11px] text-[#5D6171]">All time projects</div>
            </div>
          </div>

          {/* Card 2: FEATURED SHOWCASE */}
          <div className="bg-[#11131A] border border-[#1E212A] rounded-2xl p-5 flex items-center gap-4.5">
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/40 bg-[#181A22] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                FEATURED SHOWCASE
              </div>
              <div className="font-display text-2xl font-bold text-white mt-0.5">
                {featuredCount}
              </div>
              <div className="text-[11px] text-[#5D6171]">Highlighted projects</div>
            </div>
          </div>

          {/* Card 3: ACTIVE EXECUTION */}
          <div className="bg-[#11131A] border border-[#1E212A] rounded-2xl p-5 flex items-center gap-4.5">
            <div className="w-12 h-12 rounded-full border border-[#059669]/40 bg-[#181A22] flex items-center justify-center text-[#34D399] shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A7E8D]">
                ACTIVE EXECUTION
              </div>
              <div className="font-display text-2xl font-bold text-white mt-0.5">
                {activeExecutionCount}
              </div>
              <div className="text-[11px] text-[#5D6171] flex items-center gap-1.5">
                <span>Currently in progress</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block animate-pulse" />
              </div>
            </div>
          </div>

          {/* Card 4: COMPLETED WORKS */}
          <div className="bg-[#11131A] border border-[#1E212A] rounded-2xl p-5 flex items-center gap-4.5">
            <div className="w-12 h-12 rounded-full border border-[#2563EB]/40 bg-[#181A22] flex items-center justify-center text-[#60A5FA] shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A7E8D]">
                COMPLETED WORKS
              </div>
              <div className="font-display text-2xl font-bold text-white mt-0.5">
                {completedCount}
              </div>
              <div className="text-[11px] text-[#5D6171]">Successfully delivered</div>
            </div>
          </div>

        </div>

        {/* ── FILTER & CONTROL BAR (MATCHING REFERENCE IMAGE) ── */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-1">
          
          {/* Category Pills (Left) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {[
              "All Categories",
              "Architecture",
              "Interior",
              "3D Visualization",
              "Master Planning",
              "Residential",
              "Commercial",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                  selectedCategory === cat
                    ? "border-[#D4AF37] bg-[#1C1A14] text-[#D4AF37] shadow-sm"
                    : "border-[#1E212A] bg-[#11131A] text-[#8E93A4] hover:text-white hover:border-[#2D3342]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none px-4 py-2 pr-8 bg-[#11131A] border border-[#1E212A] rounded-xl text-xs text-[#8E93A4] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="All">/ All Status</option>
                <option value="IN PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#5D6171] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none px-4 py-2 pr-8 bg-[#11131A] border border-[#1E212A] rounded-xl text-xs text-[#8E93A4] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="title">Sort: A–Z</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#5D6171] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Grid / Table view toggle */}
            <div className="flex items-center bg-[#11131A] border border-[#1E212A] rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-[#1E212A] text-white" : "text-[#5D6171]"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "table" ? "bg-[#1E212A] text-white" : "text-[#5D6171]"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════
            3. THREE-COLUMN ARCHITECTURE PROJECT CARDS GRID
            ══════════════════════════════════════════════════════════ */}
        {isLoading ? (
          <div className="py-24 text-center text-[#5D6171] text-xs">
            Loading studio projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#11131A] border border-[#1E212A] rounded-2xl">
            <Building2 className="w-10 h-10 text-[#555966] mx-auto" />
            <p className="font-display text-white font-bold text-base">No Projects Found</p>
            <p className="text-xs text-[#8E93A4]">Try changing your category filter.</p>
            <button
              onClick={openCreateForm}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#000000] font-bold text-xs rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Project</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          
          /* ── 3-COLUMN PROJECT GRID ── */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                className="group bg-[#11131A] border border-[#1E212A] hover:border-[#2D3342] rounded-[16px] overflow-hidden transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* ── CARD IMAGE WITH BADGES ── */}
                  <div className="relative aspect-[16/10] bg-[#181A22] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />

                    {/* Top Badges (Left) */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {/* Category Badge */}
                      <span className="px-2.5 py-1 rounded-md bg-[#07080B]/90 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-[#D4AF37] border border-[#D4AF37]/30">
                        {project.category.toUpperCase()}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-md backdrop-blur-md text-[10px] font-bold tracking-wider uppercase border ${
                          project.status?.toUpperCase() === "IN PROGRESS" || project.status === "In Progress"
                            ? "bg-[#0E281E]/90 text-[#34D399] border-[#059669]/40"
                            : "bg-[#13233D]/90 text-[#60A5FA] border-[#2563EB]/40"
                        }`}
                      >
                        {project.status?.toUpperCase() || "COMPLETED"}
                      </span>
                    </div>

                    {/* Top Star (Right) */}
                    <button
                      onClick={() => handleToggleFeatured(project.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-lg backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer ${
                        project.featured
                          ? "bg-[#D4AF37] text-[#000000] shadow-md"
                          : "bg-[#07080B]/80 text-[#D4AF37] hover:bg-[#07080B]"
                      }`}
                      title={project.featured ? "Featured showcase" : "Mark as featured"}
                    >
                      <Star className={`w-3.5 h-3.5 ${project.featured ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* ── CARD BODY ── */}
                  <div className="p-5 space-y-2.5">
                    
                    {/* Location & Year */}
                    <div className="flex items-center justify-between text-xs text-[#8E93A4]">
                      <span className="flex items-center gap-1 text-[#D4AF37]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{project.location}</span>
                      </span>
                      <span className="text-[#5D6171] font-medium">{project.year}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-[1.12rem] text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {project.title}
                    </h3>

                    {/* Client */}
                    {project.client && (
                      <div className="text-xs text-[#8E93A4]">
                        <span className="text-[#D4AF37] font-medium">Client:</span> {project.client}
                      </div>
                    )}

                    {/* Short Description */}
                    <p className="text-xs text-[#7A7E8D] line-clamp-2 leading-relaxed pt-0.5">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* ── CARD FOOTER: TAGS & ACTIONS ── */}
                <div className="p-5 pt-0 mt-1 flex items-center justify-between gap-2 border-t border-[#181A22] pt-3">
                  <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                    {project.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 bg-[#181A22] text-[#8E93A4] text-[10px] rounded-md font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openEditForm(project)}
                      className="p-1.5 bg-[#181A22] hover:bg-[#D4AF37] hover:text-[#000000] text-[#8E93A4] rounded-lg transition-colors cursor-pointer"
                      title="Edit Project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(project)}
                      className="p-1.5 bg-[#181A22] hover:bg-red-600 hover:text-white text-[#8E93A4] rounded-lg transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        ) : (
          
          /* ── TABLE VIEW ── */
          <div className="bg-[#11131A] border border-[#1E212A] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#181A22] text-[#8E93A4] uppercase tracking-wider font-semibold border-b border-[#1E212A]">
                  <tr>
                    <th className="py-4 px-5">Project</th>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5">Location</th>
                    <th className="py-4 px-5">Year</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-center">Featured</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181A22]">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-[#181A22]/60 transition-colors">
                      <td className="py-4 px-5 flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-xl bg-[#1E212A] overflow-hidden shrink-0">
                          <Image src={project.image} alt={project.title} fill unoptimized className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{project.title}</div>
                          {project.client && <div className="text-xs text-[#7A7E8D]">Client: {project.client}</div>}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-[#D4AF37] font-medium">
                        {project.category}
                      </td>
                      <td className="py-4 px-5 text-[#8E93A4]">{project.location}</td>
                      <td className="py-4 px-5 text-[#8E93A4]">{project.year}</td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-2.5 py-1 rounded text-[0.65rem] font-bold ${
                            project.status?.toUpperCase() === "IN PROGRESS" || project.status === "In Progress"
                              ? "bg-[#0E281E]/80 text-[#34D399] border border-[#059669]/40"
                              : "bg-[#13233D]/80 text-[#60A5FA] border border-[#2563EB]/40"
                          }`}
                        >
                          {project.status?.toUpperCase() || "COMPLETED"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => handleToggleFeatured(project.id)}
                          className={`p-1.5 rounded cursor-pointer ${
                            project.featured ? "text-[#D4AF37]" : "text-[#555966] hover:text-white"
                          }`}
                        >
                          <Star className={`w-4 h-4 ${project.featured ? "fill-current" : ""}`} />
                        </button>
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <button
                          onClick={() => openEditForm(project)}
                          className="p-1.5 bg-[#181A22] hover:bg-[#D4AF37] hover:text-[#000000] rounded-lg text-[#8E93A4] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="p-1.5 bg-[#181A22] hover:bg-red-600 hover:text-white rounded-lg text-[#8E93A4] transition-colors cursor-pointer"
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

      </div>

      {/* ══════════════════════════════════════════════════════════
          CREATE / EDIT MODAL
          ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              className="w-full max-w-2xl bg-[#11131A] border border-[#2B2F3E] rounded-2xl shadow-2xl overflow-hidden my-8"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="px-6 py-4 border-b border-[#1E212A] flex items-center justify-between bg-[#181A22]">
                <div>
                  <h2 className="font-display font-bold text-lg text-white">
                    {editingProject ? "Edit Project Details" : "Create Architecture Project"}
                  </h2>
                  <p className="text-xs text-[#D4AF37] font-medium">
                    {editingProject ? "Update portfolio showcase entry" : "Publish new project to portfolio"}
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#1E212A] text-[#8E93A4] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8E93A4] mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Cecil Resort & Luxury Villas"
                    className="w-full px-4 py-2.5 bg-[#07080B] border border-[#262A38] rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8E93A4] mb-1.5">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#07080B] border border-[#262A38] rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {["ARCHITECTURE", "INTERIOR", "3D VISUALIZATION", "MASTER PLANNING", "RESIDENTIAL", "COMMERCIAL"].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8E93A4] mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2.5 bg-[#07080B] border border-[#262A38] rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="IN PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </div>

                {/* Location & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8E93A4] mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Murree Hills, Pakistan"
                      className="w-full px-4 py-2.5 bg-[#07080B] border border-[#262A38] rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8E93A4] mb-1.5">
                      Year
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="e.g. 2025 – 2026"
                      className="w-full px-4 py-2.5 bg-[#07080B] border border-[#262A38] rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Client */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8E93A4] mb-1.5">
                    Client / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Lahore Group & Canopy Resorts"
                    className="w-full px-4 py-2.5 bg-[#07080B] border border-[#262A38] rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Image URL & Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8E93A4]">
                    Image URL &amp; File Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Paste Image URL..."
                      className="flex-1 px-4 py-2.5 bg-[#07080B] border border-[#262A38] rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1E212A] hover:bg-[#2A303F] border border-[#32384A] text-xs text-white rounded-xl cursor-pointer transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[0.65rem] text-[#5D6171]">Presets:</span>
                    {SAMPLE_IMAGE_PRESETS.map((pr) => (
                      <button
                        type="button"
                        key={pr.label}
                        onClick={() => setFormData({ ...formData, image: pr.url })}
                        className="px-2.5 py-1 bg-[#181A22] hover:bg-[#1E212A] text-[0.65rem] text-[#8E93A4] rounded-md border border-[#1E212A] cursor-pointer"
                      >
                        {pr.label}
                      </button>
                    ))}
                  </div>

                  {formData.image && (
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#262A38] bg-black mt-2">
                      <Image src={formData.image} alt="Preview" fill unoptimized className="object-cover" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8E93A4] mb-1.5">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive architectural overview..."
                    className="w-full px-4 py-2.5 bg-[#07080B] border border-[#262A38] rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                  />
                </div>

                {/* Tags & Featured */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8E93A4] mb-1.5">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g. Hospitality, Site Planning"
                      className="w-full px-4 py-2 bg-[#07080B] border border-[#262A38] rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="sm:col-span-4 pt-3 sm:pt-0 flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="featCheck"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#D4AF37] rounded cursor-pointer"
                    />
                    <label htmlFor="featCheck" className="text-xs font-bold text-white cursor-pointer select-none">
                      Featured Showcase ⭐
                    </label>
                  </div>
                </div>

                {/* Modal actions */}
                <div className="pt-4 border-t border-[#1E212A] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 bg-[#1E212A] hover:bg-[#262835] text-[#8E93A4] hover:text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C29F2F] text-[#000000] font-bold text-xs rounded-xl cursor-pointer shadow-md"
                  >
                    {editingProject ? "Save Changes" : "Publish Project"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              className="w-full max-w-sm bg-[#11131A] border border-[#2B2F3E] rounded-2xl p-6 shadow-2xl text-center space-y-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-lg text-white">Delete Project?</h4>
              <p className="text-xs text-[#8E93A4]">
                Are you sure you want to delete &ldquo;{deleteTarget.title}&rdquo;?
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 bg-[#1E212A] text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProject(deleteTarget.id)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
