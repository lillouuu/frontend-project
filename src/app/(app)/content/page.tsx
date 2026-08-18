"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  PenSquare,
  RefreshCw,
  Bookmark,
  Share2,
  Hash,
  Megaphone,
  Layers,
  FileText,
  Lightbulb,
  ArrowRight,
  Send,
  ThumbsUp,
  MessageSquare,
  Globe,
} from "lucide-react";

export default function GenerationPage() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form State matching /api/generations request payload
  const [formData, setFormData] = useState({
    topic: "Why 80% of B2B companies fail at LinkedIn lead generation in 2026",
    format: "Thought Leadership",
    tone: "Authoritative & Educational",
    targetAudience: "CMOs & Marketing Directors",
    includeCTA: true,
  });

  const [generatedPost, setGeneratedPost] = useState<any>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulated response matching POST /api/generations schema from Cahier IA
    setTimeout(() => {
      setGeneratedPost({
        format: formData.format,
        hook: "Most B2B companies treat LinkedIn like a press release feed. That's why 80% fail to generate real enterprise pipeline.",
        body: `Here are 3 fundamental shifts we executed at [Company Name] to turn cold connections into active sales conversations:\n\n1. Stop posting features, start documenting problems.\nDecision-makers don't care about your product update. They care about fixing their current operational headache.\n\n2. Shift from corporate page to founder authority.\nPeople trust leaders, not logos. Executive posts consistently achieve 4x higher reach than company updates.\n\n3. Structure posts for skimmability.\nIf your hook doesn't grab attention in the first 2 lines, 90% of your audience scrolls past.\n\nWhat is your team's biggest challenge with LinkedIn content right now?`,
        cta: "Drop your thoughts below or DM me 'STRATEGY' for our free playbook. 👇",
        hashtags: ["#B2BMarketing", "#LinkedInStrategy", "#GrowthHacking", "#DemandGen"],
        characterCount: 840,
        estimatedReadTime: "45 sec",
        carouselSlideCount: formData.format === "Carousel Blueprint" ? 5 : null,
      });
      setLoading(false);
    }, 1200);
  };

  const handleCopyFullPost = () => {
    if (!generatedPost) return;
    const fullContent = `${generatedPost.hook}\n\n${generatedPost.body}\n\n${generatedPost.cta}\n\n${generatedPost.hashtags.join(" ")}`;
    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans text-slate-800">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            AI Content Generator
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create high-engaging LinkedIn posts, carousel blueprints, and case studies tailored to your industry.
          </p>
        </div>
        <Link
          href="/calendar"
          className="inline-flex items-center gap-2 rounded-xl bg-[#4a7aa8] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#3f6a94]"
        >
          Schedule to Calendar <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Brief Input & AI Settings */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <PenSquare className="h-5 w-5 text-[#4a7aa8]" />
              <h2 className="text-base font-bold text-slate-900">Content Prompt & Parameters</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Topic / Prompt */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Topic / Strategic Brief
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., How to optimize B2B sales pipelines using AI tools..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs outline-none transition-all focus:border-[#4a7aa8] focus:ring-1 focus:ring-[#4a7aa8]"
                />
              </div>

              {/* Content Format Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Content Format
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { id: "Thought Leadership", icon: Lightbulb },
                    { id: "Case Study", icon: FileText },
                    { id: "Carousel Blueprint", icon: Layers },
                    { id: "Product Launch", icon: Megaphone },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, format: item.id })}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
                          formData.format === item.id
                            ? "border-[#4a7aa8] bg-[#4a7aa8]/10 text-[#4a7aa8]"
                            : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="truncate">{item.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tone of Voice
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium outline-none transition-all focus:border-[#4a7aa8]"
                >
                  <option>Authoritative & Educational</option>
                  <option>Bold & Direct</option>
                  <option>Storytelling & Vulnerable</option>
                  <option>Analytical & Data-Backed</option>
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Target Persona / Audience
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs outline-none transition-all focus:border-[#4a7aa8] focus:ring-1 focus:ring-[#4a7aa8]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4a7aa8] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#3f6a94] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Crafting LinkedIn Post...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Content Draft
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live LinkedIn Post Preview & Inspector */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {generatedPost ? (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                  <span>Format: <strong className="text-slate-800">{generatedPost.format}</strong></span>
                  <span>•</span>
                  <span>Est. Read: <strong className="text-slate-800">{generatedPost.estimatedReadTime}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                      saved ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    {saved ? "Saved" : "Save Draft"}
                  </button>
                  <button
                    onClick={handleCopyFullPost}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-slate-800"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied to Clipboard!" : "Copy Post"}
                  </button>
                </div>
              </div>

              {/* LinkedIn Native Style Mock Preview */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                {/* Mock User Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a7aa8] font-bold text-white text-sm">
                    3LM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">3LM Solutions • Executive Post</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      1m • <Globe className="h-3 w-3" />
                    </p>
                  </div>
                </div>

                {/* Main Post Body */}
                <div className="mt-4 space-y-3 text-xs text-slate-800 leading-relaxed font-sans">
                  <p className="font-bold text-slate-900 text-sm leading-snug">{generatedPost.hook}</p>
                  <p className="whitespace-pre-line">{generatedPost.body}</p>
                  <p className="font-semibold text-[#4a7aa8]">{generatedPost.cta}</p>
                </div>

                {/* Hashtag List */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {generatedPost.hashtags.map((tag: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                      <Hash className="h-3 w-3 mr-0.5" />
                      {tag.replace("#", "")}
                    </span>
                  ))}
                </div>

                {/* Mock Feed Interactions Footer */}
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <button className="flex items-center gap-1 hover:text-slate-600"><ThumbsUp className="h-4 w-4" /> Like</button>
                  <button className="flex items-center gap-1 hover:text-slate-600"><MessageSquare className="h-4 w-4" /> Comment</button>
                  <button className="flex items-center gap-1 hover:text-slate-600"><Share2 className="h-4 w-4" /> Repost</button>
                  <button className="flex items-center gap-1 hover:text-slate-600"><Send className="h-4 w-4" /> Send</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">No Post Draft Generated</h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Fill in the topic prompt and parameters on the left and click "Generate Content Draft" to view your post preview.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}