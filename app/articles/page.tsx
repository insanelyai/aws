import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import Image from "next/image";

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date,
});

const Article =
  mongoose.models.Article || mongoose.model("Article", articleSchema);

async function getArticles() {
  try {
    await connectToDatabase();
    const articles = await Article.find({}).sort({ createdAt: -1 });
    console.log("Fetched articles:", articles);
    return articles || [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function ArticlesPage() {
  try {
    const articles = await getArticles();
    console.log("Articles:", articles);

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
            {articles?.map((article) => {
              if (!article._id) {
                console.warn("Article or _id is undefined:", article);
                return null;
              }

              return (
                <div
                  key={article._id.toString()}
                  className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'
                >
                  <div className='relative h-48'>
                    {article.imageUrl ? (
                      (() => {
                        console.log("Article image URL:", article.imageUrl);
                        return (
                          <Image
                            src={article.imageUrl}
                            alt={article.title || "Article image"}
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
              );
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ArticlesPage:", error);
    return (
      <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-4xl font-bold text-gray-900 mb-8'>Articles</h1>
          <p className='text-red-600'>
            Error loading articles. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
