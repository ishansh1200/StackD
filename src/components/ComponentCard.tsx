import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import styles from "./ComponentCard.module.scss";

interface ComponentCardProps {
  component: {
    id: string;
    name: string;
    library: string;
    libraryUrl: string;
    thumbnailUrl: string;
    tags: string[];
  };
  onPreview: () => void;
}

export default function ComponentCard({ component, onPreview }: ComponentCardProps) {
  // Determine badge class based on library name
  const badgeClass = (() => {
    const lib = component.library.toLowerCase();
    if (lib.includes("aceternity")) return "badge-aceternity";
    if (lib.includes("magic")) return "badge-magicui";
    if (lib.includes("shadcn")) return "badge-shadcn";
    if (lib.includes("reactbits")) return "badge-reactbits";
    if (lib.includes("uiverse")) return "badge-uiverse";
    return "badge";
  })();

  return (
    <div className={styles.card}>
      <div className={styles.thumbnailContainer}>
        <Image
          src={component.thumbnailUrl}
          alt={component.name}
          className={styles.thumbnail}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{component.name}</h3>
          <span className={`badge ${badgeClass}`}>{component.library}</span>
        </div>
        
        <div className={styles.tags}>
          {component.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <button onClick={onPreview} className="btn-primary flex-1 justify-center">
            <Play size={16} />
            Preview
          </button>
          <a
            href={component.libraryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={16} />
            Source
          </a>
        </div>
      </div>
    </div>
  );
}
