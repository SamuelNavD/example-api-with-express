import express from "express";
import { NextFunction, Request, Response } from "express";
import {
    createArticle,
    deleteArticleById,
    getArticleById,
    updateArticleById,
    updatePartialArticleById,
} from "./app";
import { ArticleNotFoundError } from "./domain/errors/articleNotFound.error";
import { Article } from "./domain/models/article.model";
import { authMiddleware } from "./middlewares/authMiddleware";

const app = express();
const port = 8000;

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("New request:");
    console.log(" - Time:", Date.now());
    console.log(" - Request:", req.method, req.originalUrl);
    next();
});

app.use(express.static("public"));
app.use("/importantDocuments", express.static("docs"));

app.get("/articles/:articleId", (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;
    const { articleId } = params;

    // Logic to get the article from the repository
    getArticleById(articleId)
        .then((article: Article) => {
            res.set("Content-Type", "application/json");
            res.status(200).json(article);
        })
        .catch(next);
});

app.post(
    "/articles",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        const { body } = req;
        const { title, content } = body;

        // Logic to create the article in the repository
        createArticle({
            title: title,
            content: content,
        } as Article)
            .then((newArticle) => {
                res.set("Content-Type", "application/json");
                res.status(200).json(newArticle);
            })
            .catch(next);
    }
);

app.patch("/articles/:articleId", (req: Request, res: Response, next: NextFunction) => {
    const { params, body } = req;
    const { articleId } = params;
    const { id, title, content } = body;

    // Logic to update the article (partially) in the repository
    updatePartialArticleById(articleId, {
        id: id || articleId,
        title: title || undefined,
        content: content || undefined,
    })
        .then((articleUpdated) => {
            res.set("Content-Type", "application/json");
            res.status(200).json(articleUpdated);
        })
        .catch(next);
});

app.put("/articles/:articleId", (req: Request, res: Response, next: NextFunction) => {
    const { params, body } = req;
    const { articleId } = params;
    const { id, title, content } = body;

    // Logic to update the article in the repository
    updateArticleById(articleId, {
        id: id || articleId,
        title: title,
        content: content,
    })
        .then((articleUpdated) => {
            res.set("Content-Type", "application/json");
            res.status(200).json(articleUpdated);
        })
        .catch(next);
});

app.delete("/articles/:articleId", (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;
    const { articleId } = params;

    // Logic to delete the article in the repository
    deleteArticleById(articleId)
        .then((articleDeleted) => {
            res.set("Content-Type", "application/json");
            res.status(200).json(articleDeleted);
        })
        .catch(next);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof ArticleNotFoundError) {
        res.status(404).send(err.message);
    } else {
        res.status(500).json({
            message: "Something went wrong!",
            error: { name: err.name, message: err.message },
        });
    }
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Resource not found!");
});

app.listen(port, () => {
    console.log(`✅ Server listening at http://localhost:${port}`);
});
