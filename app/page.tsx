import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/s3";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageKey: String,
  technologies: [String],
  githubUrl: String,
  liveUrl: String,
  createdAt: Date,
  updatedAt: Date,
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageKey: String,
  createdAt: Date,
  updatedAt: Date,
});

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
const Article =
  mongoose.models.Article || mongoose.model("Article", articleSchema);

async function getFeaturedProjects() {
  await connectToDatabase();
  const projects = await Project.find({}).sort({ createdAt: -1 }).limit(3);
  return projects;
}

async function getFeaturedArticles() {
  await connectToDatabase();
  const articles = await Article.find({}).sort({ createdAt: -1 }).limit(3);
  return articles;
}

export default async function Home() {
  const [projects, articles] = await Promise.all([
    getFeaturedProjects(),
    getFeaturedArticles(),
  ]);

  // Get image URLs for projects
  const projectsWithImages = await Promise.all(
    projects.map(async (project) => ({
      ...project.toObject(),
      imageUrl: project.imageKey ? await getImageUrl(project.imageKey) : null,
    }))
  );

  // Get image URLs for articles
  const articlesWithImages = await Promise.all(
    articles.map(async (article) => ({
      ...article.toObject(),
      imageUrl: article.imageKey ? await getImageUrl(article.imageKey) : null,
    }))
  );

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Hero Section */}
      <div className='bg-white'>
        <div className='max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl'>
              Welcome to Overclouded
            </h1>
            <p className='mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl'>
              Explore my projects and articles on cloud computing, web
              development, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-900'>
            Featured Projects
          </h2>
          <Link
            href='/projects'
            className='text-blue-600 hover:text-blue-800 font-medium'
          >
            View all projects →
          </Link>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {projectsWithImages.map((project) => (
            <div
              key={project._id.toString()}
              className='bg-white rounded-lg shadow-lg overflow-hidden relative h-48'
            >
              {project.imageUrl && (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className='object-cover'
                />
              )}
              <div className='p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {project.title}
                </h3>
                <p className='text-gray-600 mb-4'>{project.description}</p>
                <div className='flex flex-wrap gap-2'>
                  {project.technologies.slice(0, 3).map((tech: string) => (
                    <span
                      key={tech}
                      className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded'
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Articles */}
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-900'>Latest Articles</h2>
          <Link
            href='/articles'
            className='text-blue-600 hover:text-blue-800 font-medium'
          >
            View all articles →
          </Link>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {articlesWithImages.map((article) => (
            <article
              key={article._id.toString()}
              className='bg-white rounded-lg shadow-lg overflow-hidden'
            >
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className='w-full h-48 object-cover'
                />
              )}
              <div className='p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {article.title}
                </h3>
                <div className='text-sm text-gray-500 mb-4'>
                  {new Date(article.createdAt).toLocaleDateString()}
                </div>
                <p className='text-gray-600 line-clamp-3'>
                  {article.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
