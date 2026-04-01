import Link from "next/link";
import { getArticles } from "@/lib/api/article";
import { Article } from "@/types";

export default async function TinTuc() {
  const articles = (await getArticles()) as Article[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Tin tức</h1>
      </div>

      {articles.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Chưa có bài viết để hiển thị.
        </p>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <article key={article.articleId} className="rounded-lg border p-4">
              <h2 className="text-xl font-semibold">{article.title}</h2>
              {article.summary ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {article.summary}
                </p>
              ) : null}

              <div className="mt-3">
                <Link
                  href={`/tin-tuc/${article.articleId}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Xem chi tiết
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
