import { getImageUrl } from "@/lib/s3";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import Image from "next/image";

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageKey: String,
  createdAt: Date,
  updatedAt: Date,
});

const Article =
  mongoose.models.Article || mongoose.model("Article", articleSchema);

async function getArticles() {
  await connectToDatabase();
  const articles = await Article.find({}).sort({ createdAt: -1 });
  return articles;
}

async function getArticlesWithImages() {
  const articles = await getArticles();
  const articlesWithImages = await Promise.all(
    articles.map(async (article) => ({
      ...article.toObject(),
      imageUrl: article.imageKey ? await getImageUrl(article.imageKey) : null,
    }))
  );
  return articlesWithImages;
}

export default async function ArticlesPage() {
  const articlesWithImages = await getArticlesWithImages();

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Articles</h1>
          <p className='text-xl text-gray-600'>
            Read my latest insights and tutorials
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {articlesWithImages.map((article) => (
            <div
              key={article._id.toString()}
              className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'
            >
              <div className='relative h-48'>
                {article.imageUrl && (
                  <Image
                    src={article.imageUrl}
                    alt={article.title || "Article image"}
                    fill
                    className='object-cover'
                  />
                )}
              </div>
              <div className='p-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                  {article.title || "Untitled Article"}
                </h2>
                <p className='text-gray-600 mb-4 line-clamp-3'>
                  {article.content || "No content available"}
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
