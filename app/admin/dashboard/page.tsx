"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
}

interface Article {
  title: string;
  content: string;
  imageUrl: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"projects" | "articles">(
    "projects"
  );
  const [project, setProject] = useState<Project>({
    title: "",
    description: "",
    technologies: [],
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
  });
  const [article, setArticle] = useState<Article>({
    title: "",
    content: "",
    imageUrl: "",
  });
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "project" | "article"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", type === "project" ? "projects" : "articles");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      if (type === "project") {
        setProject((prev) => ({ ...prev, imageUrl: data.key }));
      } else {
        setArticle((prev) => ({ ...prev, imageUrl: data.key }));
      }
    } catch (error: unknown) {
      console.error("Upload error:", error);
      setMessage("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!project.imageUrl) {
        setMessage("Please upload an image first");
        return;
      }

      const formData = new FormData();
      formData.append("title", project.title);
      formData.append("description", project.description);
      formData.append("technologies", project.technologies.join(","));
      formData.append("githubUrl", project.githubUrl);
      formData.append("liveUrl", project.liveUrl);
      formData.append("imageKey", project.imageUrl);

      const response = await fetch("/api/admin/projects", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Project added successfully!");
        setProject({
          title: "",
          description: "",
          technologies: [],
          githubUrl: "",
          liveUrl: "",
          imageUrl: "",
        });
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to add project");
      }
    } catch (error: unknown) {
      console.error("Project submission error:", error);
      setMessage("An error occurred");
    }
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!article.imageUrl) {
        setMessage("Please upload an image first");
        return;
      }

      const formData = new FormData();
      formData.append("title", article.title);
      formData.append("content", article.content);
      formData.append("imageKey", article.imageUrl);

      const response = await fetch("/api/admin/articles", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Article added successfully!");
        setArticle({
          title: "",
          content: "",
          imageUrl: "",
        });
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to add article");
      }
    } catch (error: unknown) {
      console.error("Article submission error:", error);
      setMessage("An error occurred");
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
          <button
            onClick={() => router.push("/")}
            className='text-blue-600 hover:text-blue-800'
          >
            Back to Home
          </button>
        </div>

        <div className='bg-white rounded-lg shadow-lg p-6'>
          <div className='flex border-b mb-6'>
            <button
              className={`py-2 px-4 ${
                activeTab === "projects"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("projects")}
            >
              Add Project
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "articles"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("articles")}
            >
              Add Article
            </button>
          </div>

          {message && (
            <div className='mb-4 p-4 bg-green-100 text-green-700 rounded'>
              {message}
            </div>
          )}

          {activeTab === "projects" ? (
            <form onSubmit={handleProjectSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Title
                </label>
                <input
                  type='text'
                  value={project.title}
                  onChange={(e) =>
                    setProject({ ...project, title: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Description
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) =>
                    setProject({ ...project, description: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Image
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleImageChange(e, "project")}
                  className='mt-1 block w-full'
                  disabled={uploading}
                />
                {project.imageUrl && (
                  <p className='mt-1 text-sm text-gray-500'>
                    Image uploaded successfully
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Technologies (comma-separated)
                </label>
                <input
                  type='text'
                  value={project.technologies.join(", ")}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      technologies: e.target.value
                        .split(",")
                        .map((t) => t.trim()),
                    })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  GitHub URL
                </label>
                <input
                  type='url'
                  value={project.githubUrl}
                  onChange={(e) =>
                    setProject({ ...project, githubUrl: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Live URL
                </label>
                <input
                  type='url'
                  value={project.liveUrl}
                  onChange={(e) =>
                    setProject({ ...project, liveUrl: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
              <button
                type='submit'
                className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Add Project"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleArticleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Title
                </label>
                <input
                  type='text'
                  value={article.title}
                  onChange={(e) =>
                    setArticle({ ...article, title: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Image
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleImageChange(e, "article")}
                  className='mt-1 block w-full'
                  disabled={uploading}
                />
                {article.imageUrl && (
                  <p className='mt-1 text-sm text-gray-500'>
                    Image uploaded successfully
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Content
                </label>
                <textarea
                  value={article.content}
                  onChange={(e) =>
                    setArticle({ ...article, content: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  required
                  rows={10}
                />
              </div>
              <button
                type='submit'
                className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Add Article"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
