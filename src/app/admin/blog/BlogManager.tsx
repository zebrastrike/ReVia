"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, X } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  published: boolean;
  publishedAt: string;
  createdAt: string;
}

const emptyPost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "ReVia Research Team",
  category: "Industry News",
};

export default function BlogManager({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function savePost() {
    if (!editing?.title || !editing?.excerpt || !editing?.content) return;
    setSaving(true);

    const slug = editing.slug || generateSlug(editing.title);
    const body = { ...editing, slug };

    const res = await fetch("/api/admin/blog", {
      method: editing.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const saved = await res.json();
      if (editing.id) {
        setPosts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      } else {
        setPosts((prev) => [saved, ...prev]);
      }
      setEditing(null);
    }
    setSaving(false);
  }

  async function togglePublish(id: string, published: boolean) {
    const res = await fetch("/api/admin/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, published }),
    });
    if (res.ok) {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, published } : p)));
    }
  }

  async function deletePost(id: string) {
    const res = await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <>
      {/* New Post button */}
      {!editing && (
        <button
          onClick={() => setEditing(emptyPost)}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-sky-500 transition-colors"
        >
          <Plus size={14} />
          New Post
        </button>
      )}

      {/* Editor */}
      {editing && (
        <div className="bg-white/50 border border-sky-200/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-stone-800">
              {editing.id ? "Edit Post" : "New Post"}
            </h2>
            <button onClick={() => setEditing(null)} className="text-stone-400 hover:text-stone-600">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Title</label>
              <input
                value={editing.title ?? ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: generateSlug(e.target.value) })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                placeholder="Post title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Slug</label>
              <input
                value={editing.slug ?? ""}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none font-mono"
                placeholder="post-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Author</label>
              <input
                value={editing.author ?? ""}
                onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Category</label>
              <input
                value={editing.category ?? ""}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Excerpt</label>
            <textarea
              value={editing.excerpt ?? ""}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none resize-none"
              placeholder="Short description..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Content (HTML)</label>
            <textarea
              value={editing.content ?? ""}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              rows={12}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono focus:border-sky-500 focus:outline-none resize-y"
              placeholder="<p>Write your blog post here...</p>"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={savePost}
              disabled={saving}
              className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : editing.id ? "Update Post" : "Publish Post"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="rounded-lg border border-neutral-200 px-5 py-2 text-sm text-stone-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl overflow-hidden">
        {posts.length === 0 ? (
          <p className="text-stone-500 text-sm py-12 text-center">No blog posts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-stone-500 border-b border-sky-200/40 bg-white/50">
                <th className="text-left px-6 py-4 font-medium">Title</th>
                <th className="text-left px-6 py-4 font-medium">Category</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Date</th>
                <th className="text-right px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-sky-100/40 hover:bg-white/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-stone-800">{post.title}</td>
                  <td className="px-6 py-4 text-stone-500">{post.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.published ? "bg-sky-100 text-sky-600" : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-500">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(post)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-sky-500 hover:bg-sky-50 transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => togglePublish(post.id, !post.published)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                        title={post.published ? "Unpublish" : "Publish"}
                      >
                        {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
