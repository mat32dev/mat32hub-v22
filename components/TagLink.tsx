
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, User, Calendar, Globe, Music, Layers, Tag, Search } from 'lucide-react';

export type TagType = 'artist' | 'year' | 'genre' | 'country' | 'style' | 'tag' | 'category' | 'vibe';

interface TagLinkProps {
  label: string;
  type: TagType;
  className?: string;
  showIcon?: boolean;
}

export const TagLink: React.FC<TagLinkProps> = ({ label, type, className = "", showIcon = true }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const normalized = label.replace('#', '').trim();
    
    switch (type) {
      case 'artist':
        navigate(`/records?search=${encodeURIComponent(normalized)}`);
        break;
      case 'category':
      case 'genre':
        navigate(`/records?category=${encodeURIComponent(normalized)}`);
        break;
      case 'tag':
      case 'vibe':
        navigate(`/community?search=${encodeURIComponent(normalized)}`);
        break;
      default:
        navigate(`/community?search=${encodeURIComponent(normalized)}`);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'artist': return <User size={10} />;
      case 'year': return <Calendar size={10} />;
      case 'category': return <Tag size={10} />;
      case 'genre': return <Music size={10} />;
      case 'vibe': return <Layers size={10} />;
      case 'tag': return <Hash size={10} />;
      default: return <Search size={10} />;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-mat-700 bg-mat-800/80 text-gray-300 hover:bg-mat-500 hover:text-white hover:border-mat-500 hover:shadow-[0_0_15px_rgba(234,88,12,0.3)] group ${className}`}
    >
      {showIcon && (
        <span className="text-mat-500 group-hover:text-white transition-colors">
          {getIcon()}
        </span>
      )}
      <span>{label.replace('#', '')}</span>
    </button>
  );
};
