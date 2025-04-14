import React from "react";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

interface ArticlesProps {
  articles: Article[];
}

const Articles: React.FC<ArticlesProps> = ({ articles }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
      {articles.map((article) => (
        <div
          key={article.id}
          className='bg-white rounded-lg shadow-lg overflow-hidden'
        >
          <div className='relative h-48'>
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className='object-cover'
            />
          </div>
          <div className='p-4'>
            <h3 className='text-xl font-bold mb-2'>{article.title}</h3>
            <div className='flex items-center text-sm text-gray-500 mb-2'>
              <span>{article.author}</span>
              <span className='mx-2'>•</span>
              <span>{new Date(article.date).toLocaleDateString()}</span>
            </div>
            <p className='text-gray-600 mb-4'>{article.excerpt}</p>
            <div className='flex flex-wrap gap-2'>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className='bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Articles;
