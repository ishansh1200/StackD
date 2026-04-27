"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import componentsData from "@/data/components.json";
import ComponentCard from "@/components/ComponentCard";
import PreviewModal from "@/components/PreviewModal";
import styles from "./page.module.scss";

// Extract unique values for filters
const categories = Array.from(new Set(componentsData.map(c => c.category))).sort();
const libraries = Array.from(new Set(componentsData.map(c => c.library))).sort();
const styleTypes = Array.from(new Set(componentsData.map(c => c.styleType))).sort();
const animationLevels = Array.from(new Set(componentsData.map(c => c.animationLevel))).sort();

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State initialized from URL or defaults
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [library, setLibrary] = useState("all");
  const [styleType, setStyleType] = useState("all");
  const [animationLevel, setAnimationLevel] = useState("all");
  const [darkModeOnly, setDarkModeOnly] = useState(false);

  const [previewComponentId, setPreviewComponentId] = useState<string | null>(null);

  // Sync state from URL on initial load (only runs once on client)
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || "all");
    setLibrary(searchParams.get("library") || "all");
    setStyleType(searchParams.get("styleType") || "all");
    setAnimationLevel(searchParams.get("animationLevel") || "all");
    setDarkModeOnly(searchParams.get("darkMode") === "true");
  }, [searchParams]);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "all") params.set("category", category);
    if (library !== "all") params.set("library", library);
    if (styleType !== "all") params.set("styleType", styleType);
    if (animationLevel !== "all") params.set("animationLevel", animationLevel);
    if (darkModeOnly) params.set("darkMode", "true");

    const newUrl = params.toString() ? `/?${params.toString()}` : "/";
    router.replace(newUrl, { scroll: false });
  }, [query, category, library, styleType, animationLevel, darkModeOnly, router]);

  // Filter components
  const filteredComponents = useMemo(() => {
    return componentsData.filter((c) => {
      // Text search in name or tags
      const matchesQuery = query === "" || 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = category === "all" || c.category === category;
      const matchesLibrary = library === "all" || c.library === library;
      const matchesStyle = styleType === "all" || c.styleType === styleType;
      const matchesAnimation = animationLevel === "all" || c.animationLevel === animationLevel;
      const matchesDarkMode = !darkModeOnly || c.darkModeSupport === true;

      return matchesQuery && matchesCategory && matchesLibrary && matchesStyle && matchesAnimation && matchesDarkMode;
    });
  }, [query, category, library, styleType, animationLevel, darkModeOnly]);

  const previewComponent = useMemo(() => {
    return componentsData.find(c => c.id === previewComponentId) || null;
  }, [previewComponentId]);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Discover Perfect Components</h1>
        <p className={styles.heroSubtitle}>
          A curated discovery platform of the finest UI components across the web. 
          Stop searching through documentation and start building faster.
        </p>
        
        <div className={`${styles.searchWrapper} group`}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search animated cards, retro grids, or neon buttons..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            <SlidersHorizontal size={20} className="text-violet-400" />
            <h2>Filters</h2>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Category</label>
            <select className={styles.filterSelect} value={category} onChange={e => setCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Library</label>
            <select className={styles.filterSelect} value={library} onChange={e => setLibrary(e.target.value)}>
              <option value="all">All Libraries</option>
              {libraries.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Style</label>
            <select className={styles.filterSelect} value={styleType} onChange={e => setStyleType(e.target.value)}>
              <option value="all">Any Style</option>
              {styleTypes.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Animation</label>
            <select className={styles.filterSelect} value={animationLevel} onChange={e => setAnimationLevel(e.target.value)}>
              <option value="all">Any Animation</option>
              {animationLevels.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={darkModeOnly}
                onChange={(e) => setDarkModeOnly(e.target.checked)}
                className={styles.checkbox}
              />
              Must support Dark Mode
            </label>
          </div>
        </aside>

        {/* Component Grid */}
        <div className={styles.content}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              {filteredComponents.length} {filteredComponents.length === 1 ? 'result' : 'results'}
            </h2>
          </div>

          {filteredComponents.length > 0 ? (
            <div className={styles.componentGrid}>
              {filteredComponents.map((component) => (
                <ComponentCard 
                  key={component.id} 
                  component={component} 
                  onPreview={() => setPreviewComponentId(component.id)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className="text-neutral-600 mb-2">
                <Search size={48} />
              </div>
              <h3 className={styles.emptyTitle}>No components found</h3>
              <p className={styles.emptyText}>
                Try adjusting your filters or search query to find what you&apos;re looking for.
              </p>
              <button 
                onClick={() => {
                  setQuery(""); setCategory("all"); setLibrary("all"); setStyleType("all"); setAnimationLevel("all"); setDarkModeOnly(false);
                }}
                className="btn-secondary mt-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Built as a Developer Tool Prototype.</p>
        <a href="mailto:suggest@componenthub.dev" className={styles.footerLink}>
          Suggest a component library
        </a>
      </footer>

      {/* Preview Modal */}
      {previewComponent && (
        <PreviewModal 
          component={previewComponent} 
          onClose={() => setPreviewComponentId(null)} 
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-neutral-400 bg-[#0a0a0a]">Loading ComponentHub...</div>}>
      <HomeContent />
    </Suspense>
  );
}
