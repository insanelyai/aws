import { getImageUrl } from "@/lib/s3";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

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

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-gray-900 mb-8'>Articles</h1>
        <div className='space-y-8'>
          {articles.map(async (article) => {
            const imageUrl = await getImageUrl(article.imageKey);
            return (
              <article
                key={article._id.toString()}
                className='bg-white rounded-lg shadow-lg overflow-hidden'
              >
                {article.imageKey && (
                  <img
                    src={imageUrl}
                    alt={article.title}
                    className='w-full h-64 object-cover'
                  />
                )}
                <div className='p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    {article.title}
                  </h2>
                  <div
                    className='prose max-w-none'
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                  <div className='mt-4 text-sm text-gray-500'>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
