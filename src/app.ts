import { connectDb, writeDb } from "./db/db";
import { ArticleNotFoundError } from "./domain/errors/articleNotFound.error";
import { InvalidParamsError } from "./domain/errors/invalidParams.error";
import { Article } from "./domain/models/article.model";

export const getArticleById = (articleId: string): Promise<Article> => {
    return new Promise<Article>((resolve, reject) => {
        if (articleId === "") {
            reject(new InvalidParamsError("Article ID is required!"));
        }

        connectDb().then((articles: Article[]) => {
            const article = articles.find((article) => article.id === articleId);

            if (!article) {
                reject(new ArticleNotFoundError("Article not found!"));
            } else {
                resolve(article);
            }
        });
    });
};

export const createArticle = (article: Article): Promise<Article> => {
    return new Promise<Article>((resolve, reject) => {
        if (!article.title || !article.content) {
            reject(new InvalidParamsError("Article title and content are required!"));
        }

        connectDb()
            .then((articles: Article[]) => {
                const newArticle = {
                    ...article,
                    id: (articles.length + 1).toString(),
                };
                articles.push(newArticle);

                return {
                    articles: articles,
                    newArticle: newArticle,
                };
            })
            .then((articles: { articles: Article[]; newArticle: Article }) => {
                writeDb(articles.articles).then(() => {
                    resolve(articles.newArticle);
                });
            });
    });
};

export const deleteArticleById = (articleId: string): Promise<Article> => {
    return new Promise<Article>((resolve, reject) => {
        if (articleId === "") {
            reject(new InvalidParamsError("Article ID is required!"));
            return;
        }

        connectDb().then((articles: Article[]) => {
            const articleIndex = articles.findIndex(
                (article) => article.id === articleId
            );
            if (articleIndex === -1) {
                reject(new ArticleNotFoundError("Article not found!"));
                return;
            }

            const articleDeleted = articles[articleIndex];
            articles.splice(articleIndex, 1);
            writeDb(articles).then(() => {
                resolve(articleDeleted);
            });
        });
    });
};

export const updateArticleById = (
    articleId: string,
    article: Article
): Promise<Article> => {
    return new Promise<Article>((resolve, reject) => {
        if (articleId === "") {
            reject(new InvalidParamsError("Article ID is required!"));
            return;
        }
        if (!article.title || !article.content) {
            reject(new InvalidParamsError("Article title and content are required!"));
            return;
        }

        connectDb().then((articles: Article[]) => {
            const articleIndex = articles.findIndex(
                (article) => article.id === articleId
            );
            if (articleIndex === -1) {
                reject(new ArticleNotFoundError("Article not found!"));
                return;
            }

            const articleUpdated = {
                ...article,
                id: articleId,
            };
            articles[articleIndex] = articleUpdated;
            writeDb(articles).then(() => {
                resolve(articleUpdated);
            });
        });
    });
};

export const updatePartialArticleById = (
    articleId: string,
    article: Article
): Promise<Article> => {
    return new Promise<Article>((resolve, reject) => {
        if (articleId === "") {
            reject(new InvalidParamsError("Article ID is required!"));
            return;
        }

        connectDb().then((articles: Article[]) => {
            const articleIndex = articles.findIndex(
                (article) => article.id === articleId
            );
            if (articleIndex === -1) {
                reject(new ArticleNotFoundError("Article not found!"));
                return;
            }

            const articleUpdated: Article = {
                id: articles[articleIndex].id,
                title: article.title || articles[articleIndex].title,
                content: article.content || articles[articleIndex].content,
            };
            articles[articleIndex] = articleUpdated;
            writeDb(articles).then(() => {
                resolve(articles[articleIndex]);
            });
        });
    });
};
