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

/* ─── Types ─── */
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

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [notifications] = useState([
    { id: "n1", title: "Showcase Synced", desc: "Live portfolio updated successfully.", time: "2m ago", read: false },
    { id: "n2", title: "PWA Active", desc: "Offline service worker installed.", time: "1h ago", read: true },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "ARCHITECTURE",
    location: "Islamabad, Pakistan",
    year: new Date().getFullYear().toString(),
    client: "",
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
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
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
      status: (proj.status ? proj.status.toUpperCase() : "COMPLETED") as Project["status"],
    });
    setIsFormOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast("Title required", "Please enter a project title", "error");
      return;
    }
    const tagArr = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);

    if (editingProject) {
      const updated: Project = { ...editingProject, ...formData, tags: tagArr.length > 0 ? tagArr : ["Hospitality", "Site Planning"] };
      const updatedList = projects.map((p) => (p.id === editingProject.id ? updated : p));
      setProjects(updatedList);
      saveLocalProjects(updatedList);
      try { await fetch("/api/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) }); } catch (err) { console.warn(err); }
      addToast("Project Updated", `"${formData.title}" saved.`);
    } else {
      const newProj: Project = { id: `proj-${Date.now()}`, number: String(projects.length + 1).padStart(2, "0"), ...formData, tags: tagArr.length > 0 ? tagArr : ["Hospitality", "Site Planning"] };
      const updatedList = [newProj, ...projects];
      setProjects(updatedList);
      saveLocalProjects(updatedList);
      try { await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newProj) }); } catch (err) { console.warn(err); }
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
      try { await fetch("/api/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(changed) }); } catch (e) { console.warn(e); }
      addToast(changed.featured ? "Featured Showcase" : "Removed from Featured", `"${changed.title}" updated`);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const deleted = projects.find((p) => p.id === id);
    const filtered = projects.filter((p) => p.id !== id);
    setProjects(filtered);
    saveLocalProjects(filtered);
    try { await fetch(`/api/projects?id=${id}`, { method: "DELETE" }); } catch (err) { console.warn(err); }
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
  const activeExecutionCount = projects.filter((p) => p.status?.toUpperCase() === "IN PROGRESS" || p.status === "In Progress").length;
  const completedCount = projects.filter((p) => p.status?.toUpperCase() === "COMPLETED" || p.status === "Completed").length;

  // Filter & Sort
  const filteredProjects = projects
    .filter((p) => {
      const catOk = selectedCategory === "All Categories" || selectedCategory === "All" || p.category.toUpperCase() === selectedCategory.toUpperCase();
      const statOk = selectedStatus === "All" || p.status?.toUpperCase() === selectedStatus.toUpperCase();
      return catOk && statOk;
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "oldest") return a.year.localeCompare(b.year);
      return b.year.localeCompare(a.year);
    });

  /* ═══════════════════════════════════════════════════
     SIDEBAR NAV ITEMS — matching reference exactly
     ═══════════════════════════════════════════════════ */
  const sidebarNavItems = [
    { key: "projects" as const, icon: FolderKanban, label: "Projects Portfolio" },
    { key: "analytics" as const, icon: BarChart3, label: "Metrics & Analytics" },
    { key: "media" as const, icon: ImageIcon, label: "Media Presets" },
    { key: "team" as const, icon: Users, label: "Team & Members" },
  ];

  /* ═══════════════════════════════════════════════════
     STAT ITEMS — unified row matching reference
     ═══════════════════════════════════════════════════ */
  const statItems = [
    {
      label: "TOTAL COMMISSIONS",
      value: totalCommissions,
      sub: "All time projects",
      icon: Building2,
      iconColor: "#D4AF37",
      borderColor: "#D4AF37",
      labelColor: "#7A7E8D",
    },
    {
      label: "FEATURED SHOWCASE",
      value: featuredCount,
      sub: "Highlighted projects",
      icon: Star,
      iconColor: "#D4AF37",
      borderColor: "#D4AF37",
      labelColor: "#D4AF37",
      iconFill: true,
    },
    {
      label: "ACTIVE EXECUTION",
      value: activeExecutionCount,
      sub: "Currently in progress",
      icon: Compass,
      iconColor: "#34D399",
      borderColor: "#059669",
      labelColor: "#7A7E8D",
      showDot: true,
    },
    {
      label: "COMPLETED WORKS",
      value: completedCount,
      sub: "Successfully delivered",
      icon: CheckCircle2,
      iconColor: "#60A5FA",
      borderColor: "#2563EB",
      labelColor: "#7A7E8D",
    },
  ];

  const categoryFilters = [
    "All Categories",
    "Architecture",
    "Interior",
    "3D Visualization",
    "Master Planning",
    "Residential",
    "Commercial",
  ];

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#E0DFDC] flex antialiased" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      
      {/* ═══ TOAST NOTIFICATIONS ═══ */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 max-w-xs pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className="px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl border border-[#2A2E3B]/80 bg-[#14161E]/95 text-white pointer-events-auto flex items-start gap-3"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                {toast.type === "error" && <AlertTriangle className="w-4 h-4 text-red-400" />}
                {toast.type === "info" && <Sparkles className="w-4 h-4 text-blue-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[13px] text-white leading-tight">{toast.title}</div>
                {toast.message && <div className="text-[11px] text-[#8A8F9E] mt-0.5 leading-snug">{toast.message}</div>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════
          SIDEBAR — Sticky, exactly matching reference
          ═══════════════════════════════════════════════════ */}
      <aside className="w-[220px] shrink-0 bg-[#0B0C10] border-r border-[#1A1D24] sticky top-0 h-screen hidden lg:flex flex-col justify-between overflow-y-auto z-30 select-none">
        
        {/* Top section */}
        <div>
          {/* EEST Logo Block */}
          <div className="px-5 pt-5 pb-4 flex items-center gap-3">
            <div className="w-[38px] h-[38px] shrink-0 border-2 border-[#D4AF37] rounded-lg flex items-center justify-center relative">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="0" y="0" width="10" height="10" fill="#D4AF37" rx="1"/>
                <rect x="0" y="12" width="6" height="6" fill="#D4AF37" rx="1"/>
                <rect x="12" y="0" width="6" height="6" fill="#D4AF37" rx="1"/>
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-bold tracking-[0.22em] text-[#D4AF37] leading-none">
                E E S T
              </div>
              <div className="text-[8px] tracking-[0.18em] uppercase text-[#555966] mt-1 font-semibold">
                ARCHITECTURE STUDIO
              </div>
            </div>
          </div>

          {/* STUDIO MANAGEMENT label */}
          <div className="px-5 pt-3 pb-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#3E4252]">
              STUDIO MANAGEMENT
            </span>
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-0.5">
            {sidebarNavItems.map((item) => {
              const isActive = activeNav === item.key;
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveNav(item.key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-[13px] transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#D4AF37] text-[#0A0B0E] font-bold shadow-[0_2px_8px_rgba(212,175,55,0.15)]"
                      : "text-[#7A7E8D] hover:text-[#C5C8D4] hover:bg-[#12141B] font-medium"
                  }`}
                >
                  <Icon className="w-[15px] h-[15px] shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* View Public Portfolio */}
            <Link
              href="/#projects"
              target="_blank"
              className="w-full flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-[13px] font-medium text-[#7A7E8D] hover:text-[#D4AF37] hover:bg-[#12141B] transition-all duration-200"
            >
              <Globe className="w-[15px] h-[15px] shrink-0" />
              <span>View Public Portfolio</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Profile */}
        <div className="px-4 pb-4">
          <div className="border-t border-[#1A1D24] pt-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full border-[1.5px] border-[#D4AF37]/50 bg-[#14161E] flex items-center justify-center text-[10px] font-bold text-[#D4AF37] shrink-0">
                SRJ
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-white truncate leading-tight">Syed Raza Jan</div>
                <div className="text-[10px] text-[#555966] truncate leading-tight">Principal Architect</div>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-1 py-1 text-[11px] text-[#555966] hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Log out</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════
          MAIN CONTENT AREA
          ═══════════════════════════════════════════════════ */}
      <main className="flex-1 min-w-0 bg-[#0B0C10]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-5 lg:py-6 space-y-5">

          {/* ─── HEADER ROW ─── */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] text-[#555966] font-medium">Welcome back,</p>
              <h1 className="text-[22px] sm:text-[26px] font-bold text-white tracking-[-0.01em] leading-tight mt-0.5">
                Syed Raza Jan
              </h1>
              <p className="text-[11px] text-[#555966] mt-0.5">
                Here&apos;s what&apos;s happening with your studio today.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 pt-1">
              <button
                onClick={openCreateForm}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#C9A632] text-[#0A0B0E] font-bold text-[12px] rounded-lg transition-all cursor-pointer shadow-[0_1px_4px_rgba(212,175,55,0.2)]"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Create Project</span>
              </button>

              {/* Notification bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                  className="w-9 h-9 rounded-lg bg-[#12141B] hover:bg-[#1A1D26] border border-[#1E2130] text-[#7A7E8D] hover:text-white flex items-center justify-center transition-colors cursor-pointer relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold text-[#555966]">0</span>
                </button>

                <AnimatePresence>
                  {isNotifDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-72 bg-[#14161E] border border-[#252838] rounded-xl shadow-2xl p-3.5 z-50 space-y-2"
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#1E2130]">
                        <span className="font-bold text-[11px] uppercase tracking-widest text-white">Notifications</span>
                        <span className="text-[9px] text-[#D4AF37] font-semibold">Active</span>
                      </div>
                      {notifications.map((n) => (
                        <div key={n.id} className="p-2.5 rounded-lg bg-[#0E1016] border border-[#1A1D26] text-[11px]">
                          <div className="font-semibold text-white">{n.title}</div>
                          <div className="text-[10px] text-[#7A7E8D] mt-0.5">{n.desc}</div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ─── UNIFIED STATS BAR (single container, 4 sections with dividers) ─── */}
          <div className="bg-[#12141B] border border-[#1E2130] rounded-2xl flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-[#1E2130]">
            {statItems.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex-1 flex items-center gap-3.5 px-5 py-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      border: `1.5px solid ${stat.borderColor}40`,
                      backgroundColor: "#181B24",
                    }}
                  >
                    <Icon
                      className="w-[18px] h-[18px]"
                      style={{ color: stat.iconColor }}
                      {...(stat.iconFill ? { fill: stat.iconColor } : {})}
                    />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-[9px] font-bold uppercase tracking-[0.12em] leading-none"
                      style={{ color: stat.labelColor }}
                    >
                      {stat.label}
                    </div>
                    <div className="text-[22px] font-bold text-white leading-none mt-1">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-[#555966] mt-0.5 flex items-center gap-1.5 leading-none">
                      <span>{stat.sub}</span>
                      {stat.showDot && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── FILTER BAR ─── */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
              {categoryFilters.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-[7px] rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#D4AF37] text-[#0A0B0E] shadow-[0_1px_4px_rgba(212,175,55,0.15)]"
                        : "bg-[#12141B] text-[#7A7E8D] hover:text-white hover:bg-[#1A1D26] border border-[#1E2130]"
                    }`}
                    style={isActive ? { border: "none" } : {}}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Right-side controls */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none px-3 py-[7px] pr-7 bg-[#12141B] border border-[#1E2130] rounded-lg text-[11px] text-[#7A7E8D] focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer font-medium"
                >
                  <option value="All">/ All Status</option>
                  <option value="IN PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#555966] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")}
                  className="appearance-none px-3 py-[7px] pr-7 bg-[#12141B] border border-[#1E2130] rounded-lg text-[11px] text-[#7A7E8D] focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer font-medium"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="oldest">Sort: Oldest</option>
                  <option value="title">Sort: A–Z</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#555966] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="flex items-center bg-[#12141B] border border-[#1E2130] rounded-lg p-[3px]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-[#1E2130] text-white" : "text-[#555966] hover:text-[#7A7E8D]"}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "table" ? "bg-[#1E2130] text-white" : "text-[#555966] hover:text-[#7A7E8D]"}`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              3-COLUMN PROJECT CARDS GRID
              ═══════════════════════════════════════════════════ */}
          {isLoading ? (
            <div className="py-20 text-center text-[#555966] text-xs">Loading studio projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-[#12141B] border border-[#1E2130] rounded-2xl">
              <Building2 className="w-9 h-9 text-[#3E4252] mx-auto" />
              <p className="font-bold text-white text-sm">No Projects Found</p>
              <p className="text-[11px] text-[#7A7E8D]">Try adjusting your filters or create a new project.</p>
              <button onClick={openCreateForm} className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] text-[#0A0B0E] font-bold text-[11px] rounded-lg cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Project</span>
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  className="group bg-[#12141B] border border-[#1E2130] hover:border-[#2A2E3B] rounded-xl overflow-hidden transition-all duration-300 flex flex-col"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] bg-[#181B24] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />

                    {/* Top-left badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-[3px] rounded bg-[#0A0B0E]/85 backdrop-blur-sm text-[9px] font-bold tracking-[0.08em] uppercase text-[#D4AF37] border border-[#D4AF37]/25">
                        {project.category.toUpperCase()}
                      </span>
                      <span className={`px-2 py-[3px] rounded backdrop-blur-sm text-[9px] font-bold tracking-[0.08em] uppercase border ${
                        project.status?.toUpperCase() === "IN PROGRESS" || project.status === "In Progress"
                          ? "bg-[#0D2618]/85 text-[#34D399] border-[#059669]/30"
                          : "bg-[#0D1B33]/85 text-[#60A5FA] border-[#2563EB]/30"
                      }`}>
                        {project.status?.toUpperCase() || "COMPLETED"}
                      </span>
                    </div>

                    {/* Top-right star */}
                    <button
                      onClick={() => handleToggleFeatured(project.id)}
                      className={`absolute top-3 right-3 w-7 h-7 rounded-lg backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer ${
                        project.featured
                          ? "bg-[#D4AF37] text-[#0A0B0E]"
                          : "bg-[#0A0B0E]/70 text-[#D4AF37]/70 hover:text-[#D4AF37] hover:bg-[#0A0B0E]/90"
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${project.featured ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 px-4 pt-3.5 pb-1 space-y-1.5">
                    {/* Location & Year */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px] text-[#D4AF37] font-medium">
                        <MapPin className="w-3 h-3" />
                        <span>{project.location}</span>
                      </span>
                      <span className="text-[10px] text-[#555966] font-medium">{project.year}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-[15px] text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {project.title}
                    </h3>

                    {/* Client */}
                    {project.client && (
                      <div className="text-[11px] text-[#7A7E8D]">
                        <span className="text-[#D4AF37] font-semibold">Client:</span>{" "}
                        <span>{project.client}</span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-[11px] text-[#555966] line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Card Footer — tags + action icons */}
                  <div className="px-4 pb-3.5 pt-2 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-2 py-[2px] bg-[#181B24] text-[#7A7E8D] text-[9px] rounded font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Edit/Delete — visible on hover only */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => openEditForm(project)}
                        className="p-1.5 text-[#555966] hover:text-[#D4AF37] transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(project)}
                        className="p-1.5 text-[#555966] hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* ═══ TABLE VIEW ═══ */
            <div className="bg-[#12141B] border border-[#1E2130] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#181B24] text-[#555966] uppercase tracking-wider font-semibold border-b border-[#1E2130]">
                    <tr>
                      <th className="py-3 px-4">Project</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Year</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Featured</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1D26]">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-[#181B24]/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg bg-[#1E2130] overflow-hidden shrink-0">
                              <Image src={project.image} alt={project.title} fill unoptimized className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-white text-[12px] truncate">{project.title}</div>
                              {project.client && <div className="text-[10px] text-[#555966] truncate">Client: {project.client}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#D4AF37] font-medium text-[11px]">{project.category}</td>
                        <td className="py-3 px-4 text-[#7A7E8D]">{project.location}</td>
                        <td className="py-3 px-4 text-[#7A7E8D]">{project.year}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            project.status?.toUpperCase() === "IN PROGRESS" || project.status === "In Progress"
                              ? "bg-[#0D2618]/60 text-[#34D399] border border-[#059669]/30"
                              : "bg-[#0D1B33]/60 text-[#60A5FA] border border-[#2563EB]/30"
                          }`}>
                            {project.status?.toUpperCase() || "COMPLETED"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={() => handleToggleFeatured(project.id)} className={`cursor-pointer ${project.featured ? "text-[#D4AF37]" : "text-[#3E4252] hover:text-white"}`}>
                            <Star className={`w-3.5 h-3.5 ${project.featured ? "fill-current" : ""}`} />
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button onClick={() => openEditForm(project)} className="p-1 text-[#555966] hover:text-[#D4AF37] transition-colors cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setDeleteTarget(project)} className="p-1 text-[#555966] hover:text-red-400 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ═══════════════════════════════════════════════════
          CREATE / EDIT MODAL
          ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              className="w-full max-w-2xl bg-[#12141B] border border-[#252838] rounded-2xl shadow-2xl overflow-hidden my-6"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2 }}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#1E2130] bg-[#14161E] flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[17px] text-white">{editingProject ? "Edit Project Details" : "Create Architecture Project"}</h2>
                  <p className="text-[11px] text-[#D4AF37] font-medium mt-0.5">{editingProject ? "Update portfolio showcase entry" : "Publish new project to portfolio"}</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="w-7 h-7 rounded-lg bg-[#1E2130] text-[#7A7E8D] hover:text-white flex items-center justify-center transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveProject} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A7E8D] mb-1.5">Project Title *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Cecil Resort & Luxury Villas" className="w-full px-3.5 py-2.5 bg-[#0B0C10] border border-[#1E2130] rounded-lg text-[13px] text-white placeholder-[#3E4252] focus:outline-none focus:border-[#D4AF37]/50 transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A7E8D] mb-1.5">Category *</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2.5 bg-[#0B0C10] border border-[#1E2130] rounded-lg text-[12px] text-white focus:outline-none focus:border-[#D4AF37]/50">
                      {["ARCHITECTURE","INTERIOR","3D VISUALIZATION","MASTER PLANNING","RESIDENTIAL","COMMERCIAL"].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A7E8D] mb-1.5">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Project["status"] })} className="w-full px-3 py-2.5 bg-[#0B0C10] border border-[#1E2130] rounded-lg text-[12px] text-white focus:outline-none focus:border-[#D4AF37]/50">
                      <option value="IN PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A7E8D] mb-1.5">Location</label>
                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Murree Hills, Pakistan" className="w-full px-3.5 py-2.5 bg-[#0B0C10] border border-[#1E2130] rounded-lg text-[12px] text-white placeholder-[#3E4252] focus:outline-none focus:border-[#D4AF37]/50" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A7E8D] mb-1.5">Year</label>
                    <input type="text" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} placeholder="2025 – 2026" className="w-full px-3.5 py-2.5 bg-[#0B0C10] border border-[#1E2130] rounded-lg text-[12px] text-white placeholder-[#3E4252] focus:outline-none focus:border-[#D4AF37]/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A7E8D] mb-1.5">Client / Organization</label>
                  <input type="text" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} placeholder="Lahore Group & Canopy Resorts" className="w-full px-3.5 py-2.5 bg-[#0B0C10] border border-[#1E2130] rounded-lg text-[12px] text-white placeholder-[#3E4252] focus:outline-none focus:border-[#D4AF37]/50" />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A7E8D]">Cover Image</label>
                  <div className="flex gap-2">
                    <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="Paste Image URL..." className="flex-1 px-3.5 py-2 bg-[#0B0C10] border border-[#1E2130] rounded-lg text-[11px] text-white placeholder-[#3E4252] focus:outline-none focus:border-[#D4AF37]/50" />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1E2130] hover:bg-[#252838] text-[11px] text-white rounded-lg cursor-pointer transition-colors shrink-0 font-medium">
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[9px] text-[#3E4252] font-medium">Presets:</span>
                    {SAMPLE_IMAGE_PRESETS.map((pr) => (
                      <button type="button" key={pr.label} onClick={() => setFormData({ ...formData, image: pr.url })} className="px-2 py-0.5 bg-[#181B24] hover:bg-[#1E2130] text-[9px] text-[#7A7E8D] rounded border border-[#1E2130] cursor-pointer">{pr.label}</button>
                    ))}
                  </div>
                  {formData.image && (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-[#1E2130] bg-black mt-1">
                      <Image src={formData.image} alt="Preview" fill unoptimized className="object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A7E8D] mb-1.5">Description *</label>
                  <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Comprehensive architectural overview..." className="w-full px-3.5 py-2.5 bg-[#0B0C10] border border-[#1E2130] rounded-lg text-[12px] text-white placeholder-[#3E4252] focus:outline-none focus:border-[#D4AF37]/50 leading-relaxed" />
                </div>

                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-8">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A7E8D] mb-1.5">Tags (Comma separated)</label>
                    <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Hospitality, Site Planning" className="w-full px-3.5 py-2 bg-[#0B0C10] border border-[#1E2130] rounded-lg text-[12px] text-white placeholder-[#3E4252] focus:outline-none focus:border-[#D4AF37]/50" />
                  </div>
                  <div className="col-span-4 flex items-center gap-2 pb-0.5">
                    <input type="checkbox" id="featuredCheck" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-3.5 h-3.5 accent-[#D4AF37] rounded cursor-pointer" />
                    <label htmlFor="featuredCheck" className="text-[11px] font-semibold text-white cursor-pointer select-none whitespace-nowrap">Featured ⭐</label>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#1E2130] flex items-center justify-end gap-2.5">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-[#1E2130] hover:bg-[#252838] text-[#7A7E8D] hover:text-white text-[12px] font-semibold rounded-lg cursor-pointer transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-[#D4AF37] hover:bg-[#C9A632] text-[#0A0B0E] font-bold text-[12px] rounded-lg cursor-pointer shadow-[0_1px_4px_rgba(212,175,55,0.2)] transition-colors">{editingProject ? "Save Changes" : "Publish Project"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ DELETE CONFIRMATION ═══ */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              className="w-full max-w-sm bg-[#12141B] border border-[#252838] rounded-2xl p-6 shadow-2xl text-center space-y-4"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-11 h-11 rounded-full bg-red-950/50 border border-red-800/30 flex items-center justify-center mx-auto text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[16px] text-white">Delete Project?</h4>
              <p className="text-[11px] text-[#7A7E8D] leading-relaxed">
                Are you sure you want to permanently delete &ldquo;{deleteTarget.title}&rdquo;? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-2.5 pt-1">
                <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-[#1E2130] text-white text-[12px] font-semibold rounded-lg cursor-pointer hover:bg-[#252838] transition-colors">Cancel</button>
                <button onClick={() => handleDeleteProject(deleteTarget.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold rounded-lg cursor-pointer shadow-md transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
