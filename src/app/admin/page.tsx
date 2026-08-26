"use client";

import { useState, useEffect, useRef } from "react";
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
  Edit3,
  Trash2,
  Star,
  ExternalLink,
  Search,
  LayoutGrid,
  List,
  Lock,
  LogOut,
  Upload,
  CheckCircle2,
  Building2,
  Eye,
  MapPin,
  Calendar,
  User,
  Tag,
  AlertTriangle,
  X,
  Layers,
  Bell,
  Check,
  Filter,
  ArrowUpDown,
  Compass,
  FolderPlus,
  RefreshCw,
  SlidersHorizontal,
  Home,
  ShieldCheck,
  TrendingUp,
  Image as ImageIcon,
  Sparkles,
  Info,
  ChevronRight,
  Menu,
} from "lucide-react";

const ADMIN_PASSCODE = "raza2026";
const AUTH_STORAGE_KEY = "raza_jan_admin_auth_v1";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "success" | "info" | "warning";
}

interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: "success" | "info" | "error";
}

const SAMPLE_IMAGE_PRESETS = [
  { label: "Hillside Resort", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop" },
  { label: "Luxury Interior", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" },
  { label: "Urban Masterplan", url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop" },
  { label: "Modern Penthouse", url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop" },
  { label: "Commercial Center", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" },
  { label: "Civic Facade", url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1200&auto=format&fit=crop" },
];

const POPULAR_TAGS = [
  "3ds Max + Corona",
  "Lumion",
  "Master Planning",
  "Luxury Interior",
  "Hospitality",
  "Site Execution",
  "Commercial",
  "Residential",
  "AutoCAD",
];

export default function AdminDashboard() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<"projects" | "overview" | "media">("projects");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "title" | "year">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Notifications & Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "PWA Sync Active",
      message: "Portfolio offline capabilities & service worker active.",
      time: "Just now",
      read: false,
      type: "info",
    },
    {
      id: "notif-2",
      title: "Portfolio Ready",
      message: "Admin CMS synchronized with live website.",
      time: "10m ago",
      read: false,
      type: "success",
    },
  ]);

  // Modal / Drawer state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteModalProject, setDeleteModalProject] = useState<Project | null>(null);

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
    tags: ["Architecture", "3ds Max + Corona"],
    status: "Completed" as Project["status"],
  });

  const [tagInput, setTagInput] = useState("");

  // Load Auth & Projects on mount
  useEffect(() => {
    const isAuth = localStorage.getItem(AUTH_STORAGE_KEY) === "true";
    setIsAuthenticated(isAuth);
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
      console.warn("API fetch error, fallback to local storage", e);
    }
    const local = getLocalProjects();
    setProjects(local);
    setIsLoading(false);
  };

  const addToast = (title: string, message?: string, type: ToastItem["type"] = "success") => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const addNotification = (title: string, message: string, type: NotificationItem["type"] = "info") => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: "Just now",
      read: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      setAuthError("");
      addToast("Authenticated Successfully", "Welcome to Syed Raza Jan Studio CMS");
      addNotification("Admin Session Started", "Logged in as Principal Architect", "success");
    } else {
      setAuthError("Invalid Passcode. Enter 'raza2026'");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setPasscode("");
    addToast("Logged Out", "Session ended securely", "info");
  };

  const openNewProjectForm = () => {
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
      tags: ["Architecture", "3D Visualization"],
      status: "Completed",
    });
    setTagInput("");
    setIsFormOpen(true);
  };

  const openEditProjectForm = (proj: Project) => {
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
      tags: [...proj.tags],
      status: proj.status,
    });
    setTagInput("");
    setIsFormOpen(true);
  };

  const handleAddTag = (tagToAdd?: string) => {
    const val = (tagToAdd || tagInput).trim();
    if (val && !formData.tags.includes(val)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, val] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
          addToast("Photo Uploaded", `${file.name} ready for preview`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      addToast("Title required", "Please enter a project title", "error");
      return;
    }

    if (editingProject) {
      // UPDATE
      const updatedItem: Project = {
        ...editingProject,
        ...formData,
        tags: formData.tags.length > 0 ? formData.tags : ["Architecture"],
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
        console.warn("API sync fallback", err);
      }

      addToast("Project Updated", `Saved changes for "${formData.title}"`);
      addNotification("Project Updated", `"${formData.title}" was modified in the showcase.`, "info");
    } else {
      // CREATE
      const newItem: Project = {
        id: `proj-${Date.now()}`,
        number: String(projects.length + 1).padStart(2, "0"),
        ...formData,
        tags: formData.tags.length > 0 ? formData.tags : ["Architecture"],
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
        console.warn("API sync fallback", err);
      }

      addToast("Project Created", `Published "${formData.title}" to portfolio`);
      addNotification("New Project Added", `"${formData.title}" is now live in the portfolio.`, "success");
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
        `"${changed.title}" status updated`
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

    setDeleteModalProject(null);
    addToast("Project Deleted", `"${deleted?.title || "Project"}" removed`, "info");
    addNotification("Project Removed", `A project was deleted from your portfolio.`, "warning");
  };

  // Filter & Sort
  const filteredProjects = projects
    .filter((p) => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchStatus = selectedStatus === "All" || p.status === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchStatus && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "year") return b.year.localeCompare(a.year);
      return 0; // default newest
    });

  // Metrics
  const totalCount = projects.length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const inProgressCount = projects.filter((p) => p.status === "In Progress").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  // ══════════════════════════════════════════════════════════════
  // AUTHENTICATION SCREEN
  // ══════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090909] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#C8A84E_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
        
        {/* Ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[rgba(200,168,78,0.12)] via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <motion.div
          className="w-full max-w-md bg-[#121212] border border-[#262626] rounded-3xl p-8 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.8)] relative z-10 space-y-7"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-[var(--color-accent)]/40 flex items-center justify-center mx-auto text-[var(--color-accent)] shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                Studio Management Portal
              </h1>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] font-semibold mt-1">
                Syed Raza Jan &middot; Architectural CMS
              </p>
            </div>
            <p className="text-xs text-[#8A8882] leading-relaxed">
              Enterprise administration for live portfolio projects, 3D visualization assets, and case studies.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[#A09E96] mb-2">
                Security Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (e.g. raza2026)"
                  className="w-full px-4 py-3.5 bg-[#080808] border border-[#2B2B2B] rounded-xl text-white placeholder-[#555555] focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm font-medium"
                  autoFocus
                />
              </div>
              {authError && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[var(--color-accent)] text-black font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-[#B8962E] transition-all shadow-lg hover:shadow-[0_0_24px_rgba(200,168,78,0.3)] cursor-pointer"
            >
              Sign In to Studio CMS
            </button>
          </form>

          <div className="pt-4 border-t border-[#222222] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-[#8A8882] hover:text-white transition-colors"
            >
              <span>Return to Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // ENTERPRISE DASHBOARD LAYOUT
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#090909] text-[#E0DFDC] font-sans flex flex-col md:flex-row">
      
      {/* ── STACKED TOAST NOTIFICATIONS (TOP-RIGHT) ── */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`p-4 rounded-xl shadow-2xl backdrop-blur-md border pointer-events-auto flex items-start gap-3 text-xs ${
                toast.type === "success"
                  ? "bg-[#141414]/95 border-emerald-500/50 text-white"
                  : toast.type === "error"
                  ? "bg-[#141414]/95 border-red-500/50 text-white"
                  : "bg-[#141414]/95 border-[var(--color-accent)]/50 text-white"
              }`}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {toast.type === "error" && <AlertTriangle className="w-4 h-4 text-red-400" />}
                {toast.type === "info" && <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />}
              </div>
              <div className="flex-1">
                <div className="font-bold text-white tracking-wide">{toast.title}</div>
                {toast.message && <div className="text-[#999999] mt-0.5">{toast.message}</div>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ENTERPRISE SIDEBAR PANEL
          ══════════════════════════════════════════════════════════ */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } hidden md:flex flex-col justify-between border-r border-[#1F1F1F] bg-[#0E0E0E] transition-all duration-300 shrink-0 sticky top-0 h-screen z-30`}
      >
        {/* Top Studio Brand */}
        <div className="p-6 border-b border-[#1A1A1A] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#1C1C1C] border border-[var(--color-accent)]/40 flex items-center justify-center font-display font-bold text-sm text-[var(--color-accent)] shrink-0 shadow-sm">
                SRJ
              </div>
              {isSidebarOpen && (
                <div className="truncate">
                  <div className="font-display font-bold text-sm text-white tracking-tight truncate">
                    Syed Raza Jan
                  </div>
                  <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-accent)] font-semibold">
                    Studio Suite
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg bg-[#181818] text-[#777777] hover:text-white transition-colors cursor-pointer"
              title="Toggle sidebar"
            >
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSidebarOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {isSidebarOpen && (
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#161616] border border-[#262626] text-[0.65rem] text-emerald-400 font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE PWA SYNC ACTIVE</span>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-1.5 flex-1">
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === "projects"
                ? "bg-[var(--color-accent)] text-black font-bold shadow-md"
                : "text-[#9E9C96] hover:bg-[#1A1A1A] hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            {isSidebarOpen && (
              <div className="flex-1 flex items-center justify-between">
                <span>Projects Portfolio</span>
                <span className={`px-2 py-0.5 rounded text-[0.65rem] ${activeTab === "projects" ? "bg-black/20 text-black" : "bg-[#222222] text-[#888888]"}`}>
                  {totalCount}
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-[var(--color-accent)] text-black font-bold shadow-md"
                : "text-[#9E9C96] hover:bg-[#1A1A1A] hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            {isSidebarOpen && <span>Metrics &amp; Analytics</span>}
          </button>

          <button
            onClick={() => setActiveTab("media")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === "media"
                ? "bg-[var(--color-accent)] text-black font-bold shadow-md"
                : "text-[#9E9C96] hover:bg-[#1A1A1A] hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            {isSidebarOpen && <span>Media Presets</span>}
          </button>

          <div className="pt-4 border-t border-[#1C1C1C] my-3">
            {isSidebarOpen && (
              <div className="px-3 pb-2 text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#666666]">
                External Links
              </div>
            )}
            <Link
              href="/#projects"
              target="_blank"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-[#8A8882] hover:bg-[#1A1A1A] hover:text-[var(--color-accent)] transition-colors"
            >
              <Eye className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>View Public Portfolio</span>}
            </Link>
          </div>
        </nav>

        {/* Bottom Profile & Logout */}
        <div className="p-4 border-t border-[#1A1A1A] space-y-3">
          {isSidebarOpen && (
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-[#242424] border border-[var(--color-accent)]/30 flex items-center justify-center text-xs font-bold text-white shrink-0">
                RJ
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">Syed Raza Jan</div>
                <div className="text-[0.65rem] text-[#777777]">Principal Architect</div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#171717] hover:bg-red-950/40 hover:border-red-800/50 border border-[#262626] text-xs font-semibold text-[#A09E96] hover:text-red-400 transition-all cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            {isSidebarOpen && <span>Secure Logout</span>}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════
          MAIN CONTENT AREA & TOPBAR
          ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* ── Top Header Bar ── */}
        <header className="border-b border-[#1F1F1F] bg-[#0E0E0E]/90 backdrop-blur-md sticky top-0 z-30 px-6 sm:px-10 py-4 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#1C1C1C] text-white"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Studio Management
              </div>
              <h2 className="font-display font-bold text-lg text-white leading-tight">
                {activeTab === "projects"
                  ? "Architectural Projects Showcase"
                  : activeTab === "overview"
                  ? "Studio Portfolio Analytics"
                  : "Curated Media & Visual Presets"}
              </h2>
            </div>
          </div>

          {/* Right Header Utilities: Push Notifications & Quick Action */}
          <div className="flex items-center gap-3 relative">
            
            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2.5 rounded-xl bg-[#161616] hover:bg-[#222222] border border-[#2B2B2B] text-[#A09E96] hover:text-white transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#141414] border border-[#2C2C2C] rounded-2xl shadow-2xl p-4 z-50 space-y-3"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
                      <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
                        Studio Push Alerts ({notifications.length})
                      </span>
                      <button
                        onClick={() => {
                          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                          addToast("Notifications Cleared", "All alerts marked as read");
                        }}
                        className="text-[0.65rem] text-[var(--color-accent)] hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            notif.read
                              ? "bg-[#111111] border-[#1F1F1F] text-[#888888]"
                              : "bg-[#1A1A1A] border-[var(--color-accent)]/30 text-[#E0DFDC]"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-white">
                            <span>{notif.title}</span>
                            <span className="text-[0.65rem] text-[#666666] font-normal">{notif.time}</span>
                          </div>
                          <p className="text-[0.7rem] text-[#AAAAAA] leading-relaxed">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct New Project Button */}
            <button
              onClick={openNewProjectForm}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-black font-bold text-xs tracking-wider uppercase rounded-xl hover:bg-[#B8962E] transition-all shadow-lg hover:shadow-[0_0_20px_rgba(200,168,78,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>

        </header>

        {/* ── Main Tab Content ── */}
        <main className="p-6 sm:p-10 max-w-7xl w-full mx-auto space-y-8 flex-1">
          
          {/* ══════════════════════════════════════════════════════════
              TAB 1: PROJECTS PORTFOLIO (CRUD)
              ══════════════════════════════════════════════════════════ */}
          {activeTab === "projects" && (
            <>
              {/* Metric Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="bg-[#121212] border border-[#222222] p-5 rounded-2xl">
                  <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#888888]">
                    Total Commissions
                  </div>
                  <div className="font-display text-3xl font-bold text-white mt-1">
                    {totalCount}
                  </div>
                </div>

                <div className="bg-[#121212] border border-[#222222] p-5 rounded-2xl">
                  <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Featured Showcase</span>
                  </div>
                  <div className="font-display text-3xl font-bold text-[var(--color-accent)] mt-1">
                    {featuredCount}
                  </div>
                </div>

                <div className="bg-[#121212] border border-[#222222] p-5 rounded-2xl">
                  <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-emerald-400">
                    Active Execution
                  </div>
                  <div className="font-display text-3xl font-bold text-emerald-400 mt-1">
                    {inProgressCount}
                  </div>
                </div>

                <div className="bg-[#121212] border border-[#222222] p-5 rounded-2xl">
                  <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-400">
                    Completed Works
                  </div>
                  <div className="font-display text-3xl font-bold text-blue-400 mt-1">
                    {completedCount}
                  </div>
                </div>
              </div>

              {/* Filters, Search & Sort Bar */}
              <div className="bg-[#121212] border border-[#222222] p-4 sm:p-5 rounded-2xl space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  
                  {/* Search Input */}
                  <div className="relative flex-1 max-w-lg">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, location, client, or tag..."
                      className="w-full pl-10 pr-4 py-2.5 bg-[#090909] border border-[#282828] rounded-xl text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    />
                  </div>

                  {/* Status, Sort & View toggles */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Status filter */}
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 bg-[#090909] border border-[#282828] rounded-xl text-xs text-[#A09E96] focus:outline-none focus:border-[var(--color-accent)]"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Concept">Concept</option>
                    </select>

                    {/* Sort by */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 bg-[#090909] border border-[#282828] rounded-xl text-xs text-[#A09E96] focus:outline-none focus:border-[var(--color-accent)]"
                    >
                      <option value="newest">Sort: Newest</option>
                      <option value="title">Sort: Title</option>
                      <option value="year">Sort: Year</option>
                    </select>

                    {/* View mode toggle */}
                    <div className="flex items-center bg-[#090909] border border-[#282828] rounded-xl p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          viewMode === "grid" ? "bg-[#222222] text-white" : "text-[#666666]"
                        }`}
                        title="Grid"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("table")}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          viewMode === "table" ? "bg-[#222222] text-white" : "text-[#666666]"
                        }`}
                        title="Table"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-[#1C1C1C] pt-3">
                  <span className="text-[0.65rem] uppercase tracking-wider text-[#666666] font-semibold shrink-0">
                    Category:
                  </span>
                  {PROJECT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategory === cat
                          ? "bg-[var(--color-accent)] text-black"
                          : "bg-[#181818] text-[#888888] hover:text-white border border-[#262626]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── PROJECT LIST / GRID ── */}
              {isLoading ? (
                <div className="py-24 text-center text-[#777777] text-xs">
                  Loading studio showcase portfolio...
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-[#121212] border border-[#222222] rounded-3xl">
                  <Building2 className="w-10 h-10 text-[#555555] mx-auto" />
                  <p className="font-display text-white font-bold text-lg">No Projects Found</p>
                  <p className="text-xs text-[#777777]">Try adjusting your search criteria or create a new commission.</p>
                  <button
                    onClick={openNewProjectForm}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] text-black font-bold text-xs rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                
                /* ── CARDS GRID ── */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      layout
                      className="group bg-[#121212] border border-[#242424] hover:border-[var(--color-accent)]/60 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Preview */}
                        <div className="relative aspect-[16/10] bg-[#181818] overflow-hidden">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md text-[0.65rem] font-bold tracking-wider uppercase text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                              {project.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase ${
                              project.status === "In Progress"
                                ? "bg-emerald-950/85 text-emerald-400 border border-emerald-800/40"
                                : project.status === "Completed"
                                ? "bg-blue-950/85 text-blue-400 border border-blue-800/40"
                                : "bg-purple-950/85 text-purple-400"
                            }`}>
                              {project.status}
                            </span>
                          </div>

                          {/* Star Toggle */}
                          <button
                            onClick={() => handleToggleFeatured(project.id)}
                            className={`absolute top-3 right-3 w-8 h-8 rounded-lg backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                              project.featured
                                ? "bg-[var(--color-accent)] text-black shadow-lg"
                                : "bg-black/60 text-[#777777] hover:text-white"
                            }`}
                            title={project.featured ? "Featured showcase" : "Mark as featured"}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </div>

                        {/* Info */}
                        <div className="p-6 space-y-3">
                          <div className="flex items-center justify-between text-xs text-[#8A8882]">
                            <span className="flex items-center gap-1.5 text-[var(--color-accent)] font-medium">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{project.location}</span>
                            </span>
                            <span className="font-semibold">{project.year}</span>
                          </div>

                          <h3 className="font-display font-bold text-lg text-white group-hover:text-[var(--color-accent)] transition-colors leading-snug">
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
                      </div>

                      {/* Footer Actions */}
                      <div className="p-6 pt-0 border-t border-[#1C1C1C] mt-2 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5 pt-3 max-w-[60%]">
                          {project.tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-[#181818] text-[#888888] text-[0.6rem] rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-3">
                          <button
                            onClick={() => openEditProjectForm(project)}
                            className="p-2 bg-[#1C1C1C] hover:bg-[var(--color-accent)] hover:text-black rounded-lg text-[#A09E96] transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteModalProject(project)}
                            className="p-2 bg-[#1C1C1C] hover:bg-red-600 hover:text-white rounded-lg text-[#A09E96] transition-colors cursor-pointer"
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
                <div className="bg-[#121212] border border-[#222222] rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#1A1A1A] text-[#888888] uppercase tracking-wider font-semibold border-b border-[#242424]">
                        <tr>
                          <th className="py-4 px-5">Project Entry</th>
                          <th className="py-4 px-5">Category</th>
                          <th className="py-4 px-5">Location</th>
                          <th className="py-4 px-5">Year</th>
                          <th className="py-4 px-5">Status</th>
                          <th className="py-4 px-5 text-center">Featured</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1C1C1C]">
                        {filteredProjects.map((project) => (
                          <tr key={project.id} className="hover:bg-[#161616] transition-colors">
                            <td className="py-4 px-5 flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl bg-[#202020] overflow-hidden shrink-0">
                                <Image src={project.image} alt={project.title} fill className="object-cover" />
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm">{project.title}</div>
                                {project.client && <div className="text-xs text-[#777777]">Client: {project.client}</div>}
                              </div>
                            </td>
                            <td className="py-4 px-5 text-[var(--color-accent)] font-medium">
                              {project.category}
                            </td>
                            <td className="py-4 px-5 text-[#AAAAAA]">{project.location}</td>
                            <td className="py-4 px-5 text-[#AAAAAA]">{project.year}</td>
                            <td className="py-4 px-5">
                              <span className={`px-2.5 py-1 rounded text-[0.65rem] font-bold ${
                                project.status === "Completed"
                                  ? "bg-blue-950/60 text-blue-400 border border-blue-800/30"
                                  : project.status === "In Progress"
                                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/30"
                                  : "bg-purple-950/60 text-purple-400"
                              }`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-center">
                              <button
                                onClick={() => handleToggleFeatured(project.id)}
                                className={`p-1.5 rounded cursor-pointer ${
                                  project.featured ? "text-[var(--color-accent)]" : "text-[#555555] hover:text-white"
                                }`}
                              >
                                <Star className={`w-4 h-4 ${project.featured ? "fill-current" : ""}`} />
                              </button>
                            </td>
                            <td className="py-4 px-5 text-right space-x-2">
                              <button
                                onClick={() => openEditProjectForm(project)}
                                className="p-2 bg-[#1E1E1E] hover:bg-[var(--color-accent)] hover:text-black rounded-lg text-[#AAAAAA] transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteModalProject(project)}
                                className="p-2 bg-[#1E1E1E] hover:bg-red-600 hover:text-white rounded-lg text-[#AAAAAA] transition-colors cursor-pointer"
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
            </>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 2: METRICS & ANALYTICS OVERVIEW
              ══════════════════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#121212] border border-[#242424] p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#888888]">
                      Commission Portfolio
                    </span>
                    <Building2 className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                  <div className="font-display text-4xl font-bold text-white">{totalCount} Projects</div>
                  <p className="text-xs text-[#8A8882]">
                    High-end residential, luxury resorts, and urban master plans worldwide.
                  </p>
                </div>

                <div className="bg-[#121212] border border-[#242424] p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
                      Featured Showcases
                    </span>
                    <Star className="w-5 h-5 text-[var(--color-accent)] fill-current" />
                  </div>
                  <div className="font-display text-4xl font-bold text-[var(--color-accent)]">{featuredCount} Featured</div>
                  <p className="text-xs text-[#8A8882]">
                    Spotlight commissions displayed prominently on the home page portfolio.
                  </p>
                </div>

                <div className="bg-[#121212] border border-[#242424] p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Active Execution
                    </span>
                    <Compass className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="font-display text-4xl font-bold text-emerald-400">{inProgressCount} Underway</div>
                  <p className="text-xs text-[#8A8882]">
                    Turnkey architecture and site execution currently in progress.
                  </p>
                </div>
              </div>

              {/* Discipline Breakdown */}
              <div className="bg-[#121212] border border-[#242424] p-8 rounded-3xl space-y-6">
                <h3 className="font-display font-bold text-xl text-white">Discipline Distribution</h3>
                <div className="space-y-4">
                  {PROJECT_CATEGORIES.filter((c) => c !== "All").map((cat) => {
                    const count = projects.filter((p) => p.category === cat).length;
                    const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{cat}</span>
                          <span className="text-[#888888]">{count} projects ({percent}%)</span>
                        </div>
                        <div className="h-2 w-full bg-[#1C1C1C] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 3: MEDIA & PRESET ASSETS
              ══════════════════════════════════════════════════════════ */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="bg-[#121212] border border-[#242424] p-6 rounded-2xl">
                <h3 className="font-display font-bold text-lg text-white mb-2">Curated Architectural Presets</h3>
                <p className="text-xs text-[#8A8882]">
                  High-definition photography presets for immediate use across portfolio projects.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SAMPLE_IMAGE_PRESETS.map((preset) => (
                  <div key={preset.label} className="bg-[#121212] border border-[#242424] rounded-2xl overflow-hidden space-y-3 p-4">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#1C1C1C]">
                      <Image src={preset.url} alt={preset.label} fill className="object-cover" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{preset.label}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(preset.url);
                          addToast("URL Copied", `Copied image link for ${preset.label}`);
                        }}
                        className="px-3 py-1 bg-[#1F1F1F] hover:bg-[var(--color-accent)] hover:text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SLIDE-OVER / MODAL: CREATE & EDIT PROJECT FORM
          ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              className="w-full max-w-3xl bg-[#121212] border border-[#2E2E2E] rounded-3xl shadow-2xl overflow-hidden my-8"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              {/* Modal Header */}
              <div className="px-8 py-5 border-b border-[#222222] flex items-center justify-between bg-[#161616]">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">
                    {editingProject ? "Edit Architectural Commission" : "Create New Portfolio Project"}
                  </h3>
                  <p className="text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider mt-0.5">
                    {editingProject ? "Update project deliverables" : "Live CMS Publication"}
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#242424] text-[#888888] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveProject} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A09E96] mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Cecil Luxury Resort & Hillside Villas"
                    className="w-full px-4 py-3 bg-[#080808] border border-[#282828] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--color-accent)] font-medium"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A09E96] mb-2">
                      Discipline / Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-[#080808] border border-[#282828] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-accent)]"
                    >
                      {PROJECT_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A09E96] mb-2">
                      Execution Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Project["status"] })}
                      className="w-full px-4 py-3 bg-[#080808] border border-[#282828] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-accent)]"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A09E96] mb-2">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Murree Hills, Pakistan"
                      className="w-full px-4 py-3 bg-[#080808] border border-[#282828] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A09E96] mb-2">
                      Year / Commission Period
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="e.g. 2025 – 2026"
                      className="w-full px-4 py-3 bg-[#080808] border border-[#282828] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                </div>

                {/* Client */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A09E96] mb-2">
                    Client / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Lakhani Group & Canopy Resorts"
                    className="w-full px-4 py-3 bg-[#080808] border border-[#282828] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                {/* Image Upload & Presets */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A09E96]">
                    Hero Photography / 3D Render
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Paste Image URL (https://...)"
                      className="flex-1 px-4 py-2.5 bg-[#080808] border border-[#282828] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-accent)]"
                    />

                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333333] text-xs text-white font-semibold rounded-xl cursor-pointer transition-colors shrink-0">
                      <Upload className="w-4 h-4 text-[var(--color-accent)]" />
                      <span>Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[0.65rem] text-[#666666] uppercase font-semibold">Presets:</span>
                    {SAMPLE_IMAGE_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className="px-2.5 py-1 bg-[#181818] hover:bg-[#262626] text-[0.65rem] text-[#A09E96] rounded-md border border-[#242424] cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Live preview */}
                  {formData.image && (
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#262626] bg-[#0E0E0E] mt-3">
                      <Image src={formData.image} alt="Preview" fill className="object-cover" />
                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-black/80 backdrop-blur-md text-[0.65rem] text-[var(--color-accent)] font-bold uppercase">
                        Active Visual Preview
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A09E96] mb-2">
                    Architectural Overview &amp; Execution Scope *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide architectural narrative, materiality, design challenges, and deliverables..."
                    className="w-full px-4 py-3 bg-[#080808] border border-[#282828] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-accent)] leading-relaxed"
                  />
                </div>

                {/* Tags & Featured */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A09E96]">
                    Project Tags
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tag and press Enter (e.g. Corona Render)"
                      className="flex-1 px-4 py-2.5 bg-[#080808] border border-[#282828] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-accent)]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag()}
                      className="px-4 py-2.5 bg-[#1F1F1F] hover:bg-[#282828] text-white text-xs font-bold rounded-xl"
                    >
                      Add
                    </button>
                  </div>

                  {/* Active tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/40 text-[var(--color-accent)] text-xs font-semibold rounded-lg"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-white cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Popular tags quick add */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[0.65rem] text-[#666666]">Quick tag:</span>
                    {POPULAR_TAGS.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => handleAddTag(t)}
                        className="px-2 py-0.5 bg-[#161616] hover:bg-[#222222] text-[0.65rem] text-[#888888] rounded border border-[#222222] cursor-pointer"
                      >
                        + {t}
                      </button>
                    ))}
                  </div>

                  {/* Featured Toggle */}
                  <div className="pt-4 border-t border-[#222222] flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featuredModalCheckbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 accent-[var(--color-accent)] rounded cursor-pointer"
                    />
                    <label htmlFor="featuredModalCheckbox" className="text-xs font-bold text-white cursor-pointer select-none">
                      Mark as Featured Spotlight Project (Shown prominently on Home)
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="pt-6 border-t border-[#222222] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-3 bg-[#1C1C1C] hover:bg-[#262626] text-[#AAAAAA] hover:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-3 bg-[var(--color-accent)] text-black font-bold text-xs tracking-wider uppercase rounded-xl hover:bg-[#B8962E] transition-all shadow-lg cursor-pointer"
                  >
                    {editingProject ? "Save Changes" : "Publish Project"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          CONFIRMATION MODAL: DELETE PROJECT
          ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {deleteModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              className="w-full max-w-md bg-[#141414] border border-[#2C2C2C] rounded-3xl p-8 shadow-2xl text-center space-y-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xl text-white">
                  Delete &ldquo;{deleteModalProject.title}&rdquo;?
                </h4>
                <p className="text-xs text-[#8A8882] mt-1.5 leading-relaxed">
                  This action will permanently remove this project from your online architectural showcase.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => setDeleteModalProject(null)}
                  className="px-5 py-2.5 bg-[#222222] hover:bg-[#2C2C2C] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProject(deleteModalProject.id)}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-lg"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
