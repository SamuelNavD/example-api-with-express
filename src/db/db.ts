import fs from "fs";
import { Article } from "../domain/models/article.model";

export const connectDb = () => {
    return new Promise<Article[]>((resolve, reject) => {
        fs.readFile("src/db/articles.json", "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

export const writeDb = (articles: Article[]) => {
    return new Promise<Article[]>((resolve, reject) => {
        fs.writeFile("src/db/articles.json", JSON.stringify(articles), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(articles);
            }
        });
    });
};
