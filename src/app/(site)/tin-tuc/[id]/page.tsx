import { getArticleById } from "@/lib/api/article";
import { Article } from "@/types";
import Image from "next/image";

type DetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TinTucDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const articleId = Number(id);

  if (Number.isNaN(articleId)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <p className="text-red-600">ID bài viết không hợp lệ.</p>
      </div>
    );
  }

  const article = (await getArticleById(articleId)) as Article | null;

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <p className="text-muted-foreground">Không tìm thấy bài viết.</p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      {/* <Image src={article.thumbnailUrl} alt={article.title} width={800} height={450} /> */}
      {article.summary ? (
        <p className="mt-3 text-muted-foreground">{article.summary}</p>
      ) : null}

      <div className="mt-6 prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content || "" }} />
      </div>
    </main>
  );
}
