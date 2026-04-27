"use client";

import { useEffect } from "react";
import { X, ExternalLink, ShieldAlert } from "lucide-react";
import styles from "./PreviewModal.module.scss";

interface PreviewModalProps {
  component: {
    name: string;
    library: string;
    previewUrl: string;
    tags: string[];
    embeddable: boolean;
  };
  onClose: () => void;
}

export default function PreviewModal({ component, onClose }: PreviewModalProps) {
  // Handle Esc key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    // Prevent scrolling behind modal
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>{component.name}</h2>
            <span className="badge badge-shadcn border-transparent bg-neutral-800 hidden sm:inline-block">
              {component.library}
            </span>
          </div>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {component.embeddable ? (
            <iframe
              src={component.previewUrl}
              className={styles.iframe}
              title={`${component.name} Preview`}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className={styles.fallback}>
              <ShieldAlert className={styles.fallbackIcon} />
              <h3 className={styles.fallbackTitle}>Preview Not Available</h3>
              <p className={styles.fallbackText}>
                {component.library} does not allow embedding their previews via iframe for security reasons.
              </p>
              <a
                href={component.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 text-lg px-8 py-3"
              >
                Open in {component.library} <ExternalLink size={20} className="ml-2" />
              </a>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.tags}>
            {component.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          {component.embeddable && (
            <a
              href={component.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Open in {component.library} <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
