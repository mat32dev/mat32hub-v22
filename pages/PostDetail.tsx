
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, Heart, ArrowLeft, CornerDownRight, Hash, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { SEO } from '../components/SEO';
import { Post } from '../types';
import { CachedImage } from '../components/CachedImage';
import { TagLink } from '../components/TagLink';
import { BandcampPlayer } from '../components/BandcampPlayer';

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await dataService.getPostById(id);
        if (data) setPost(data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-mat-900 flex items-center justify-center"><Loader2 className="animate-spin text-mat-500 w-12 h-12" /></div>;
  if (!post) return <div className="min-h-screen bg-mat-900 text-center py-40 text-white">Post no encontrado. <Link to="/community" className="text-mat-500">Volver</Link></div>;

  return (
    <div className="min-h-screen bg-mat-900 pb-24 font-sans">
      <SEO 
        titleKey={`Post de @${post.author}`} 
        descriptionKey={post.content} 
        image={post.imageUrl}
        schemaType="WebPage"
      />

      <div className="container mx-auto px-6 py-12 md:py-24 max-w-4xl">
         <Link to="/community" className="inline-flex items-center gap-2 text-mat-500 font-black uppercase text-[10px] tracking-widest mb-12 hover:text-white transition-colors">
            <ArrowLeft size={16} /> VOLVER AL MURO
         </Link>

         <article className="bg-mat-800 border-2 border-mat-700 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-10 md:p-16">
               <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 bg-mat-500 rounded-full flex items-center justify-center font-black text-white text-2xl shadow-xl">{post.author[0].toUpperCase()}</div>
                  <div>
                     <h1 className="text-3xl font-black text-white uppercase tracking-tighter">@{post.author}</h1>
                     <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{post.timestamp}</span>
                  </div>
               </div>
               
               <div className="text-white text-3xl font-light italic leading-relaxed mb-12">
                  {post.content.split(/(\s+)/).map((part, i) => {
                    if (part.startsWith('#')) {
                      return <TagLink key={i} label={part} type="tag" className="text-mat-500 text-xl" />;
                    }
                    return part;
                  })}
               </div>
               
               {post.imageUrl && (
                  <div className="rounded-[2.5rem] overflow-hidden border-2 border-mat-700 mb-12 shadow-2xl">
                     <CachedImage src={post.imageUrl} alt="Community context" className="w-full h-full" />
                  </div>
               )}

               {post.musicEmbed && (
                  <BandcampPlayer src={post.musicEmbed} affiliateUrl={post.affiliateUrl} />
               )}

               <div className="flex gap-8 items-center border-t border-mat-800 pt-10">
                  <div className="flex items-center gap-2 text-mat-500 font-black"><Heart className="fill-current" /> {post.likes}</div>
                  <div className="flex items-center gap-2 text-gray-500 font-black"><Hash className="w-4 h-4" /> MAT32 HUB</div>
               </div>
            </div>

            <div className="bg-mat-900/50 p-10 md:p-16 border-t border-mat-800">
               <h3 className="text-xl font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-mat-500" /> Comentarios ({post.comments.length})
               </h3>
               
               <div className="space-y-6">
                  {post.comments.map(c => (
                     <div key={c.id} className="flex gap-4 items-start animate-fade-in">
                        <CornerDownRight className="text-mat-700 flex-shrink-0 mt-1" />
                        <div className="bg-mat-800 p-6 rounded-[1.5rem] border border-mat-700 flex-1">
                           <span className="block text-mat-500 font-black uppercase text-[9px] mb-2">@{c.author}</span>
                           <p className="text-gray-300 italic text-sm leading-relaxed">"{c.content}"</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </article>
      </div>
    </div>
  );
};
