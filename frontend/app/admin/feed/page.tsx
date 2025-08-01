'use client';

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2, UploadCloud } from "lucide-react";
import API_BASE from "@/lib/api";

const API_URL = `${API_BASE}/api/feed`;

export default function AdminFeedPage() {
  const [feed, setFeed] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [file, setFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch feed items from backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setFeed)
      .catch(() => setError("Failed to load feed items"));
  }, []);

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("type", mediaType);
      formData.append("title", title || "");
      formData.append("description", description || "");
      if (mediaType === "image" && file) {
        formData.append("file", file);
      } else if (mediaType === "video" && videoFile) {
        formData.append("file", videoFile);
      }
      const token = localStorage.getItem("auth_token");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add feed item");
      }
      const newItem = await res.json();
      setFeed([newItem, ...feed]);
      setTitle("");
      setDescription("");
      setMediaType("image");
      setFile(null);
      setVideoFile(null);
    } catch (err: any) {
      setError(err.message || "Failed to add feed item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete feed item");
      }
      setFeed(feed.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete feed item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-royal-purple mb-6">Manage Feed</h1>
      <form onSubmit={handleAddFeed} className="bg-white/80 p-6 rounded-lg shadow-lg space-y-4">
        <div className="flex gap-4">
          <Button
            type="button"
            variant={mediaType === "image" ? "default" : "outline"}
            onClick={() => setMediaType("image")}
          >
            Photo
          </Button>
          <Button
            type="button"
            variant={mediaType === "video" ? "default" : "outline"}
            onClick={() => setMediaType("video")}
          >
            Video
          </Button>
        </div>
        <Input
          placeholder="Title"
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="Description"
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {mediaType === "image" ? (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        ) : (
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            required
          />
        )}
        <Button type="submit" className="flex items-center gap-2" disabled={loading}>
          <UploadCloud className="h-4 w-4" /> {loading ? "Adding..." : "Add to Feed"}
        </Button>
        {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
      </form>
      <div className="grid gap-6 mt-8">
        {feed.map((item) => (
          <Card key={item.id} className="flex flex-col md:flex-row gap-6 p-4 items-center bg-white/90 shadow-md">
            <div className="w-full md:w-1/3 flex justify-center">
              {item.type === "image" ? (
                <img
                  src={item.url.startsWith("/uploads/") ? `${API_BASE}${item.url}` : item.url}
                  alt={item.title}
                  className="rounded-lg max-h-48 object-cover border-2 border-gold shadow"
                />
              ) : (
                <video
                  src={item.url.startsWith("/uploads/") ? `${API_BASE}${item.url}` : item.url}
                  controls
                  className="rounded-lg max-h-48 w-full border-2 border-gold shadow"
                />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-bold text-royal-purple">{item.title}</h2>
              <p className="text-royal-blue">{item.description}</p>
            </div>
            <Button
              variant="destructive"
              className="self-start mt-2"
              onClick={() => handleDelete(item.id)}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
} 