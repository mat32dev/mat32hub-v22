
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, User, Calendar, Globe, Music, Layers } from 'lucide-react';

// Added 'category' and 'vibe' to TagType to fix type errors in EventCard
export type TagType = 'artist' | 'year' | 'genre' | 'country' | 'style' | 'tag' | 'category' | 'vibe';

interface TagLinkProps {
  label: string;
  type: TagType;
  className?: string;
}

export const TagLink: React.FC<TagLinkProps> = ({ label, type, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const normalized = label.replace('#', '').trim();
    
    // Lógica de enrutamiento inteligente basada en el tipo de tag
    switch (type) {
      case 'artist':
        navigate(`/records?search=${normalized}`);
        break;
      case 'year':
        navigate(`/records?year=${normalized}`);
        break;
      case 'genre':
      case 'style':
      // Handle 'category' by routing to records genre search
      case 'category':
        navigate(`/records?genre=${normalized}`);
        break;
      case 'country':
      // Handle 'vibe' and other tags by routing to community search
      case 'vibe':
        navigate(`/community?search=${normalized}`);
        break;
      default:
        navigate(`/community?search=${normalized}`);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'artist': return <User size={10} />;
      case 'year': return <Calendar size={10} />;
      case 'country': return <Globe size={10} />;
      case 'genre':
      // Map 'category' to Music icon
      case 'category': return <Music size={10} />;
      case 'style':
      // Map 'vibe' to Layers icon
      case 'vibe': return <Layers size={10} />;
      default: return <Hash size={10} />;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-mat-800 bg-mat-900/50 hover:bg-mat-500 hover:text-white hover:border-mat-500 group ${className}`}
    >
      <span className="text-mat-500 group-hover:text-white transition-colors">
        {getIcon()}
      </span>
      <span>{label}</span>
    </button>
  );
};
