import { getImageUrl } from "@/lib/s3";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

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

async function getProjects() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    console.log("Fetched projects:", projects);
    return projects || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

async function getProjectWithImage(project: any) {
  if (!project?.imageKey) return { ...project, imageUrl: null };
  try {
    const imageUrl = await getImageUrl(project.imageKey);
    return { ...project, imageUrl };
  } catch (error) {
    console.error("Error getting image URL:", error);
    return { ...project, imageUrl: null };
  }
}

export default async function ProjectsPage() {
  try {
    const projects = await getProjects();
    console.log("Projects before mapping:", projects);
    const projectsWithImages = await Promise.all(
      (projects || []).map(getProjectWithImage)
    );
    console.log("Projects with images:", projectsWithImages);

    return (
      <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-4xl font-bold text-gray-900 mb-8'>Projects</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {projectsWithImages?.map((project) => {
              const projectId = project?._doc?._id;
              if (!projectId) {
                console.warn("Project or _id is undefined:", project);
                return null;
              }

              return (
                <div
                  key={projectId.toString()}
                  className='bg-white rounded-lg shadow-lg overflow-hidden'
                >
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project._doc?.title || "Project image"}
                      className='w-full h-48 object-cover'
                    />
                  )}
                  <div className='p-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                      {project._doc?.title || "Untitled Project"}
                    </h2>
                    <p className='text-gray-600 mb-4'>
                      {project._doc?.description || "No description available"}
                    </p>
                    <div className='flex flex-wrap gap-2 mb-4'>
                      {project._doc?.technologies?.map((tech) => (
                        <span
                          key={tech}
                          className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded'
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className='flex gap-4'>
                      {project._doc?.githubUrl && (
                        <a
                          href={project._doc.githubUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 hover:text-blue-800'
                        >
                          GitHub
                        </a>
                      )}
                      {project._doc?.liveUrl && (
                        <a
                          href={project._doc.liveUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 hover:text-blue-800'
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
