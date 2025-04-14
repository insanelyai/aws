import React from "react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'>
      {projects.map((project) => (
        <div
          key={project.id}
          className='bg-white rounded-lg shadow-lg overflow-hidden'
        >
          <div className='relative h-48'>
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className='object-cover'
            />
          </div>
          <div className='p-4'>
            <h3 className='text-xl font-bold mb-2'>{project.title}</h3>
            <p className='text-gray-600 mb-4'>{project.description}</p>
            <div className='flex flex-wrap gap-2 mb-4'>
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className='bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm'
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
                  className='text-blue-600 hover:text-blue-800'
                >
                  GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
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
      ))}
    </div>
  );
};

export default Projects;
