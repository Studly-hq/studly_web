import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MoreHorizontal, ArrowUpRight, Calendar } from 'lucide-react';

const AdsDashboard = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([
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
        }
    ]);

    const stats = {
        spend: campaigns.reduce((sum, c) => sum + c.spent, 0),
        impressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
        clicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
        ctr: 2.4 // Averaged for demo
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20">
            {/* Header */}
            <div className="sticky top-0 bg-black/80 backdrop-blur-xl z-20 border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <span className="font-semibold text-lg tracking-tight">Ads Manager</span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-medium tracking-tight mb-2">Overview</h1>
                        <p className="text-white/40">Manage your active campaigns and performance.</p>
                    </div>
                    <button
                        onClick={() => navigate('/ads/create')}
                        className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-full font-medium text-sm transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        New Campaign
                    </button>
                </div>

                {/* KPI Cards - Minimalist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-colors">
                        <p className="text-sm font-medium text-white/40 mb-4">Total Spend</p>
                        <div className="text-3xl font-medium tracking-tight flex items-baseline gap-1">
                            <span className="text-lg text-white/40 font-normal">₦</span>
                            {stats.spend.toLocaleString()}
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-colors">
                        <p className="text-sm font-medium text-white/40 mb-4">Impressions</p>
                        <div className="text-3xl font-medium tracking-tight">
                            {(stats.impressions / 1000).toFixed(1)}k
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-colors">
                        <p className="text-sm font-medium text-white/40 mb-4">Clicks</p>
                        <div className="text-3xl font-medium tracking-tight">
                            {stats.clicks}
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-colors">
                        <p className="text-sm font-medium text-white/40 mb-4">Avg. CTR</p>
                        <div className="text-3xl font-medium tracking-tight flex items-center gap-2">
                            {stats.ctr}%
                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-normal">+0.4%</span>
                        </div>
                    </div>
                </div>

                {/* Campaigns List - Table Style */}
                <h2 className="text-lg font-medium mb-6 px-1">Active Campaigns</h2>
                <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left py-4 px-6 text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap">Campaign</th>
                                <th className="text-left py-4 px-6 text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="text-right py-4 px-6 text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap">Spend</th>
                                <th className="text-right py-4 px-6 text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap">Result</th>
                                <th className="text-right py-4 px-6 text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap">Duration</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-[#111]">
                            {campaigns.map((campaign) => (
                                <tr key={campaign.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-sm">{campaign.name}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-500'}`} />
                                            <span className={`text-sm capitalize ${campaign.status === 'active' ? 'text-white' : 'text-white/40'}`}>
                                                {campaign.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right font-medium text-sm tabular-nums">
                                        ₦{campaign.spent.toLocaleString()}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="font-medium text-sm tabular-nums">{campaign.clicks} clicks</span>
                                            <span className="text-xs text-white/40 tabular-nums">{(campaign.clicks / campaign.impressions * 100).toFixed(1)}% CTR</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right text-sm text-white/40 tabular-nums">
                                        {campaign.startDate} — {campaign.endDate}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdsDashboard;
