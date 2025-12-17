import { Request, Response } from 'express';
import { ScraperService } from '../services/scraperService';
import { createSuccessResponse, createErrorResponse, buildPaginationMeta } from '../utils/responseHelper';

const scraperService = new ScraperService();

export const getPopularComics = async (req: Request, res: Response) => {
    try {
        const type = req.query.tipe as string;
        const page = Number(req.query.page) || 1;
        const result = await scraperService.getPopular(type, page);
        const meta = buildPaginationMeta(req, page, result.hasNextPage);
        res.json(createSuccessResponse(result.data, meta));
    } catch (error) {
        res.status(500).json(createErrorResponse('Failed to fetch popular comics'));
    }
};

export const getNewestComics = async (req: Request, res: Response) => {
    try {
        const type = req.query.tipe as string;
        const page = Number(req.query.page) || 1;
        const result = await scraperService.getNewest(type, page);
        const meta = buildPaginationMeta(req, page, result.hasNextPage);
        res.json(createSuccessResponse(result.data, meta));
    } catch (error) {
         res.status(500).json(createErrorResponse('Failed to fetch newest comics'));
    }
};

export const getComicList = async (req: Request, res: Response) => {
    try {
        const type = req.query.tipe as string;
        const status = req.query.status as string;
        const genre = req.query.genre as string;
        const genre2 = req.query.genre2 as string;
        const page = Number(req.query.page) || 1;
        const result = await scraperService.getList(type, status, genre, genre2, page);
        const meta = buildPaginationMeta(req, page, result.hasNextPage);
        res.json(createSuccessResponse(result.data, meta));
    } catch (error) {
         res.status(500).json(createErrorResponse('Failed to fetch comic list'));
    }
}

export const searchComics = async (req: Request, res: Response) => {
    try {
        const query = req.query.s as string;
        if (!query) {
             res.status(400).json(createErrorResponse('Search query is required'));
             return;
        }
        const page = Number(req.query.page) || 1;
        const result = await scraperService.search(query, page);
        const meta = buildPaginationMeta(req, page, result.hasNextPage);
        res.json(createSuccessResponse(result.data, meta));
    } catch (error) {
         res.status(500).json(createErrorResponse('Failed to search comics'));
    }
}

export const getGenres = async (req: Request, res: Response) => {
    try {
        const result = await scraperService.getGenres();
        res.json(createSuccessResponse(result.data));
    } catch (error) {
         res.status(500).json(createErrorResponse('Failed to fetch genres'));
    }
}

export const getComicDetail = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const comic = await scraperService.getComicDetail(slug);
        if(!comic) {
            res.status(404).json(createErrorResponse('Comic not found'));
            return;
        }
        res.json(createSuccessResponse(comic));
    } catch (error) {
         res.status(500).json(createErrorResponse('Failed to fetch comic details'));
    }
}

export const getChapterDetail = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const chapter = await scraperService.getChapterDetail(slug);
         if(!chapter) {
            res.status(404).json(createErrorResponse('Chapter not found'));
            return;
        }
        res.json(createSuccessResponse(chapter));
    } catch (error) {
         res.status(500).json(createErrorResponse('Failed to fetch chapter details'));
    }
}
