import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  LogOut, 
  Mail, 
  Phone, 
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Eye,
  BarChart3,
  FileText,
  FolderOpen,
  Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import ContentEditor from '../components/admin/ContentEditor';
import ProjectManager from '../components/admin/ProjectManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [messagesRes, statsRes] = await Promise.all([
        axios.get('/api/messages'),
        axios.get('/api/contact/stats')
      ]);
      setMessages(messagesRes.data.data || []);
      setStats(statsRes.data.data || { total: 0, new: 0, read: 0, replied: 0 });
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/messages/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      fetchData();
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`/api/messages/${id}`);
      toast.success('Message deleted');
      fetchData();
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'read': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'replied': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'archived': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Mail size={14} />;
      case 'read': return <Eye size={14} />;
      case 'replied': return <CheckCircle size={14} />;
      case 'archived': return <Archive size={14} />;
      default: return <Mail size={14} />;
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'content', label: 'Content Editor', icon: Edit3 },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Messages', value: stats.total, icon: Mail, color: 'blue' },
          { label: 'New Messages', value: stats.new, icon: MessageSquare, color: 'emerald' },
          { label: 'Read Messages', value: stats.read, icon: Eye, color: 'amber' },
          { label: 'Replied', value: stats.replied || 0, icon: CheckCircle, color: 'purple' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400`}>
                <stat.icon size={20} />
              </div>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Recent Messages</h3>
          <button 
            onClick={() => setActiveTab('messages')}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All
          </button>
        </div>

        {messages.slice(0, 5).map((msg, index) => (
          <motion.div
            key={msg._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-all mb-2 cursor-pointer"
            onClick={() => { setSelectedMessage(msg); setActiveTab('messages'); }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(msg.status)}`}>
              {getStatusIcon(msg.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-white truncate">{msg.name}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(msg.status)}`}>
                  {msg.status}
                </span>
              </div>
              <p className="text-sm text-slate-400 truncate">{msg.subject}</p>
            </div>
            <div className="text-xs text-slate-500">
              {new Date(msg.createdAt).toLocaleDateString()}
            </div>
          </motion.div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          />
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-12 pr-8 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 max-h-[600px] overflow-y-auto">
          <h3 className="text-lg font-bold text-white mb-4">Messages ({filteredMessages.length})</h3>

          {filteredMessages.map((msg) => (
            <div
              key={msg._id}
              onClick={() => setSelectedMessage(msg)}
              className={`p-4 rounded-xl mb-2 cursor-pointer transition-all ${
                selectedMessage && selectedMessage._id === msg._id
                  ? 'bg-blue-500/10 border border-blue-500/30'
                  : 'bg-slate-800/30 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-white">{msg.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(msg.status)}`}>
                    {msg.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-400 truncate">{msg.subject}</p>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>No messages found</p>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Message Details</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteMessage(selectedMessage._id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">From</p>
                    <p className="font-medium text-white">{selectedMessage.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <a href={`mailto:${selectedMessage.email}`} className="font-medium text-white hover:text-blue-400 transition-colors">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                {selectedMessage.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <a href={`tel:${selectedMessage.phone}`} className="font-medium text-white hover:text-emerald-400 transition-colors">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Received</p>
                    <p className="font-medium text-white">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-2">Subject</p>
                <p className="font-medium text-white mb-4">{selectedMessage.subject}</p>
                <p className="text-xs text-slate-500 mb-2">Message</p>
                <p className="text-slate-300 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <p className="text-sm text-slate-500 w-full mb-2">Update Status:</p>
                {['new', 'read', 'replied', 'archived'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedMessage._id, status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                      selectedMessage.status === status
                        ? getStatusColor(status)
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-6">Message Analytics</h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'blue' },
            { label: 'New', value: stats.new, color: 'emerald' },
            { label: 'Read', value: stats.read, color: 'amber' },
            { label: 'Replied', value: stats.replied || 0, color: 'purple' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-slate-800/50">
              <div className={`text-3xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-white">Status Distribution</h4>
          {['new', 'read', 'replied', 'archived'].map((status) => {
            const count = messages.filter(m => m.status === status).length;
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={status} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 capitalize">{status}</span>
                  <span className="text-white">{count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="glass-card p-4 sticky top-24">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Admin Panel</p>
                  <p className="text-xs text-slate-500">Shobit Portfolio</p>
                </div>
              </div>

              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-8"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 pb-12">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'messages' && renderMessages()}
              {activeTab === 'content' && <ContentEditor />}
              {activeTab === 'projects' && <ProjectManager />}
              {activeTab === 'analytics' && renderAnalytics()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;