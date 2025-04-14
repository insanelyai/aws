import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import Image from "next/image";

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

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

interface Project extends mongoose.Document {
  title: string;
  description: string;
  imageKey: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

async function getProjects() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ createdAt: -1 });

    return projects || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  try {
    const projects = await getProjects();
    console.log("Projects:", projects);

    return (
      <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>Projects</h1>
            <p className='text-xl text-gray-600'>
              Explore my collection of projects and work
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {projects?.map((project) => {
              if (!project._id) {
                console.warn("Project or _id is undefined:", project);
                return null;
              }

              console.log("Project:", project.imageUrl);
              return (
                <div
                  key={project._id.toString()}
                  className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'
                >
                  <div className='relative h-48'>
                    {project.imageUrl ? (
                      (() => {
                        console.log("Project image URL:", project.imageUrl);
                        return (
                          <Image
                            src={project.imageUrl}
                            alt={project.title || "Project image"}
                            width={800}
                            height={600}
                            className='object-cover w-full h-full'
                            unoptimized
                          />
                        );
                      })()
                    ) : (
                      <div className='flex items-center justify-center h-full bg-gray-200 text-gray-500'>
                        No image available
                      </div>
                    )}
                  </div>
                  <div className='p-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                      {project.title || "Untitled Project"}
                    </h2>
                    <p className='text-gray-600 mb-4 line-clamp-2'>
                      {project.description || "No description available"}
                    </p>
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {project.technologies?.map((tech: string) => (
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
              );
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ProjectsPage:", error);
    return (
      <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-4xl font-bold text-gray-900 mb-8'>Projects</h1>
          <p className='text-red-600'>
            Error loading projects. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
