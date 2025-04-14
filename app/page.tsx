import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import Image from "next/image";

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
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
          <div className='text-center'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6'>
              Welcome to My Portfolio
            </h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              I&apos;m a passionate developer creating innovative solutions and
              sharing knowledge through articles.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900'>
            Featured Projects
          </h2>
          <p className='mt-4 text-lg text-gray-600'>
            Check out some of my latest work
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {projectsWithImages.map((project) => (
            <div
              key={project._id.toString()}
              className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'
            >
              <div className='relative h-48'>
                {project.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className='object-cover'
                  />
                )}
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {project.title}
                </h3>
                <p className='text-gray-600 mb-4 line-clamp-2'>
                  {project.description}
                </p>
                <div className='flex flex-wrap gap-2 mb-4'>
                  {project.technologies.slice(0, 3).map((tech: string) => (
                    <span
                      key={tech}
                      className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full'
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className='flex gap-4'>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800 font-medium'
                    >
                      View on GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800 font-medium'
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Articles */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900'>Latest Articles</h2>
          <p className='mt-4 text-lg text-gray-600'>
            Recent insights and tutorials
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {articlesWithImages.map((article) => (
            <div
              key={article._id.toString()}
              className='bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'
            >
              <div className='relative h-48'>
                {article.imageUrl && (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className='object-cover'
                  />
                )}
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {article.title}
                </h3>
                <p className='text-gray-600 mb-4 line-clamp-3'>
                  {article.content}
                </p>
                <div className='text-sm text-gray-500'>
                  {new Date(article.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
