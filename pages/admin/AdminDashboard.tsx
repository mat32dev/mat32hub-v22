import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Disc, Package, MessageSquare, ShoppingBag, Mail, UserCheck, TrendingUp, Loader2 } from 'lucide-react';
import { dataService } from '../../services/dataService';

export const AdminDashboard: React.FC = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const results = await Promise.allSettled([
        dataService.getEvents(),
        dataService.getRecords(),
        dataService.getMerch(),
        dataService.getPosts(),
        dataService.getSales(),
        dataService.getInbox(),
        dataService.getSelectors(),
      ]);
      const val = (r: PromiseSettledResult<any[]>) => r.status === 'fulfilled' ? r.value.length : 0;
      setCounts({
        events: val(results[0]),
        records: val(results[1]),
        merch: val(results[2]),
        posts: val(results[3]),
        sales: val(results[4]),
        inbox: val(results[5]),
        selectors: val(results[6]),
      });
      setLoading(false);
    })();
  }, []);

  const cards = [
    { key: 'events', label: 'Eventos', icon: Calendar, color: 'orange', path: '/admin/events' },
    { key: 'records', label: 'Discos', icon: Disc, color: 'purple', path: '/admin/records' },
    { key: 'merch', label: 'Merch', icon: Package, color: 'blue', path: '/admin/merch' },
    { key: 'posts', label: 'Posts', icon: MessageSquare, color: 'green', path: '/admin/posts' },
    { key: 'sales', label: 'Ventas', icon: ShoppingBag, color: 'yellow', path: '/admin/sales' },
    { key: 'inbox', label: 'Inbox', icon: Mail, color: 'pink', path: '/admin/inbox' },
    { key: 'selectors', label: 'Selectors', icon: UserCheck, color: 'cyan', path: '/admin/selectors' },
  ];

  const colorMap: Record<string, string> = {
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-orange-500 animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <Link key={card.key} to={card.path}
              className={`border rounded-xl p-5 transition-all hover:scale-[1.02] hover:shadow-lg ${colorMap[card.color]}`}>
              <div className="flex items-center justify-between mb-3">
                <Icon size={20} />
                <TrendingUp size={14} className="opacity-40" />
              </div>
              <p className="text-2xl font-black">{counts[card.key] ?? 0}</p>
              <p className="text-xs opacity-60 font-semibold mt-1">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-white mb-3">Acciones rapidas</h2>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/events/new" className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors">+ Nuevo evento</Link>
          <Link to="/admin/records/new" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors">+ Nuevo disco</Link>
          <Link to="/admin/posts/new" className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-colors">+ Nuevo post</Link>
          <Link to="/admin/merch/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors">+ Nuevo merch</Link>
        </div>
      </div>
    </div>
  );
};
