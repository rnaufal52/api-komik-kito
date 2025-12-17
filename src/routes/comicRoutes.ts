import { Router } from 'express';
import { 
    getPopularComics, 
    getNewestComics, 
    getComicList, 
    searchComics, 
    getComicDetail, 
    getChapterDetail,
    getGenres
} from '../controllers/comicController';

const router = Router();

router.get('/popular', getPopularComics);
router.get('/newest', getNewestComics);
router.get('/list', getComicList);
router.get('/search', searchComics);
router.get('/genres', getGenres);
router.get('/comic/:slug', getComicDetail);
router.get('/chapter/:slug', getChapterDetail);

export default router;
