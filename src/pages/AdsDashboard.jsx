import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Plus,
    MoreHorizontal,
    TrendingUp,
    TrendingDown,
    Eye,
    MousePointerClick,
    DollarSign,
    Pause,
    Play,
    Trash2,
    BarChart3
} from 'lucide-react';

const AdsDashboard = () => {
    const navigate = useNavigate();
    const [campaigns] = useState([
        {
            id: 1,
            name: 'Summer Course Promotion',
            status: 'active',
            budget: 1500,
            spent: 4500,
            impressions: 12450,
            clicks: 342,
            startDate: 'Nov 10',
            endDate: 'Nov 13',
        },
        {
            id: 2,
            name: 'New Study Notes Launch',
            status: 'paused',
            budget: 500,
            spent: 1000,
            impressions: 2100,
            clicks: 58,
            startDate: 'Nov 08',
            endDate: 'Nov 10',
        },
        {
            id: 3,
            name: 'Premium Quiz Pack',
            status: 'completed',
            budget: 2000,
            spent: 2000,
            impressions: 8500,
            clicks: 195,
            startDate: 'Nov 01',
            endDate: 'Nov 07',
        }
    ]);

    const [showMenu, setShowMenu] = useState(null);

    const stats = {
        spend: campaigns.reduce((sum, c) => sum + c.spent, 0),
        impressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
        clicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
        ctr: ((campaigns.reduce((sum, c) => sum + c.clicks, 0) / campaigns.reduce((sum, c) => sum + c.impressions, 0)) * 100).toFixed(2)
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500/10 text-green-400';
            case 'paused': return 'bg-yellow-500/10 text-yellow-400';
            case 'completed': return 'bg-blue-500/10 text-blue-400';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    const getStatusDot = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'paused': return 'bg-yellow-500';
            case 'completed': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-reddit-bg text-white">
            {/* Header */}
            <div className="sticky top-0 bg-reddit-bg/95 backdrop-blur-md z-20 border-b border-reddit-border">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 hover:bg-reddit-cardHover rounded-full transition-colors text-reddit-textMuted hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="font-bold text-xl">Ads Manager</h1>
                    </div>
                    <button
                        onClick={() => navigate('/ads/create')}
                        className="bg-reddit-orange hover:bg-reddit-orange/90 px-5 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        New Campaign
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Total Spend */}
                    <div className="bg-reddit-card border border-reddit-border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-reddit-cardHover rounded-lg">
                                <DollarSign size={18} className="text-reddit-textMuted" />
                            </div>
                            <span className="text-sm text-reddit-textMuted">Total Spend</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">₦{stats.spend.toLocaleString()}</span>
                            <div className="flex items-center gap-1 text-green-400 text-xs">
                                <TrendingUp size={12} />
                                <span>12.5%</span>
                            </div>
                        </div>
                    </div>

                    {/* Impressions */}
                    <div className="bg-reddit-card border border-reddit-border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-reddit-cardHover rounded-lg">
                                <Eye size={18} className="text-reddit-textMuted" />
                            </div>
                            <span className="text-sm text-reddit-textMuted">Impressions</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">{(stats.impressions / 1000).toFixed(1)}K</span>
                            <div className="flex items-center gap-1 text-green-400 text-xs">
                                <TrendingUp size={12} />
                                <span>8.2%</span>
                            </div>
                        </div>
                    </div>

                    {/* Total Clicks */}
                    <div className="bg-reddit-card border border-reddit-border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-reddit-cardHover rounded-lg">
                                <MousePointerClick size={18} className="text-reddit-textMuted" />
                            </div>
                            <span className="text-sm text-reddit-textMuted">Total Clicks</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">{stats.clicks}</span>
                            <div className="flex items-center gap-1 text-green-400 text-xs">
                                <TrendingUp size={12} />
                                <span>15.3%</span>
                            </div>
                        </div>
                    </div>

                    {/* CTR */}
                    <div className="bg-reddit-card border border-reddit-border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-reddit-cardHover rounded-lg">
                                <BarChart3 size={18} className="text-reddit-textMuted" />
                            </div>
                            <span className="text-sm text-reddit-textMuted">Avg. CTR</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">{stats.ctr}%</span>
                            <div className="flex items-center gap-1 text-red-400 text-xs">
                                <TrendingDown size={12} />
                                <span>0.2%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Campaigns Section */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Campaigns</h2>
                    <div className="flex items-center gap-1 bg-reddit-card border border-reddit-border rounded-lg p-1">
                        <button className="text-sm text-white px-3 py-1.5 rounded-md bg-reddit-cardHover">
                            All
                        </button>
                        <button className="text-sm text-reddit-textMuted hover:text-white px-3 py-1.5 rounded-md hover:bg-reddit-cardHover transition-colors">
                            Active
                        </button>
                        <button className="text-sm text-reddit-textMuted hover:text-white px-3 py-1.5 rounded-md hover:bg-reddit-cardHover transition-colors">
                            Paused
                        </button>
                    </div>
                </div>

                {/* Campaigns Table */}
                <div className="bg-reddit-card border border-reddit-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-reddit-border">
                                    <th className="text-left py-3 px-4 text-xs font-medium text-reddit-textMuted uppercase tracking-wider">Campaign</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-reddit-textMuted uppercase tracking-wider">Status</th>
                                    <th className="text-right py-3 px-4 text-xs font-medium text-reddit-textMuted uppercase tracking-wider">Spend</th>
                                    <th className="text-right py-3 px-4 text-xs font-medium text-reddit-textMuted uppercase tracking-wider">Results</th>
                                    <th className="text-right py-3 px-4 text-xs font-medium text-reddit-textMuted uppercase tracking-wider">Duration</th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-reddit-border">
                                {campaigns.map((campaign) => (
                                    <tr
                                        key={campaign.id}
                                        className="hover:bg-reddit-cardHover/30 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="font-medium text-sm">{campaign.name}</div>
                                            <div className="text-xs text-reddit-textMuted mt-0.5">ID: #{campaign.id.toString().padStart(4, '0')}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(campaign.status)}`} />
                                                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="text-sm font-medium">₦{campaign.spent.toLocaleString()}</div>
                                            <div className="text-xs text-reddit-textMuted">/ ₦{campaign.budget.toLocaleString()}</div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="text-sm font-medium">{campaign.clicks} clicks</div>
                                            <div className="text-xs text-reddit-textMuted">{campaign.impressions.toLocaleString()} impr.</div>
                                        </td>
                                        <td className="py-4 px-4 text-right text-sm text-reddit-textMuted">
                                            {campaign.startDate} — {campaign.endDate}
                                        </td>
                                        <td className="py-4 px-4 text-right relative">
                                            <button
                                                onClick={() => setShowMenu(showMenu === campaign.id ? null : campaign.id)}
                                                className="p-1.5 hover:bg-reddit-border rounded transition-colors text-reddit-textMuted hover:text-white"
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>
                                            {showMenu === campaign.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute right-4 top-12 w-36 bg-reddit-card border border-reddit-border rounded-lg z-10 overflow-hidden"
                                                >
                                                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-reddit-cardHover transition-colors flex items-center gap-2">
                                                        {campaign.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                                                        {campaign.status === 'active' ? 'Pause' : 'Resume'}
                                                    </button>
                                                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-reddit-cardHover transition-colors flex items-center gap-2">
                                                        <BarChart3 size={14} />
                                                        Details
                                                    </button>
                                                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-reddit-cardHover transition-colors flex items-center gap-2 text-red-400">
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </motion.div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {campaigns.length === 0 && (
                        <div className="text-center py-12">
                            <BarChart3 size={32} className="text-reddit-textMuted mx-auto mb-3" />
                            <h3 className="font-medium mb-1">No campaigns yet</h3>
                            <p className="text-reddit-textMuted text-sm mb-4">Create your first campaign to get started</p>
                            <button
                                onClick={() => navigate('/ads/create')}
                                className="bg-reddit-orange hover:bg-reddit-orange/90 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                            >
                                Create Campaign
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdsDashboard;
