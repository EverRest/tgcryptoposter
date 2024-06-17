const { PrismaClient } = require('@prisma/client');

class ArticleRepository {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async createArticle(data) {
        return await this.prisma.article.create({
            data,
        });
    }

    async getArticleById(id) {
        return await this.prisma.article.findUnique({
            where: { id },
        });
    }

    async updateArticle(id, data) {
        return await this.prisma.article.update({
            where: { id },
            data,
        });
    }

    async deleteArticle(id) {
        return await this.prisma.article.delete({
            where: { id },
        });
    }
}

module.exports = ArticleRepository;