import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';

export class ScraperService {
  private axiosInstance: AxiosInstance;
  private readonly baseUrl: string = process.env.KOMIKU_MAIN_URL || 'https://komiku.org';
  private readonly apiUrl: string = process.env.KOMIKU_API_URL || 'https://api.komiku.org';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
  }

  async getPopular(type: string = 'manga', page: number = 1) {
    try {
      const pagePath = page > 1 ? `/page/${page}` : '';
      const { data } = await this.axiosInstance.get(`${this.apiUrl}/other/hot${pagePath}/?orderby=meta_value_num&tipe=${type}`);
      const $ = cheerio.load(data);
      const comics: any[] = [];

      $('.bge').each((i, el) => {
        const title = $(el).find('.kan h3').text().trim();
        const urlWithSlug = $(el).find('.kan a').attr('href');
        const slug = urlWithSlug ? urlWithSlug.split('/manga/')[1]?.replace(/\/$/, '') : '';
        const thumbnail = $(el).find('.bgei img').attr('src');
        const latestChapter = $(el).find('.new1').last().find('span').last().text().trim();
        const rating = $(el).find('.up').text().trim(); // Using "Up" text as a placeholder for rating/status info if needed
        const description = $(el).find('.kan p').text().trim();

        if (title && slug) {
          comics.push({
            title,
            slug,
            thumbnail,
            latest_chapter: latestChapter,
            rating,
            description
          });
        }
      });

      // Pagination meta
      const nextUrl = $('span[hx-get]').attr('hx-get');
      const hasNextPage = !!nextUrl;

      return {
        data: comics,
        hasNextPage
      };
    } catch (error) {
      console.error('Error in getPopular:', error);
      return { data: [], hasNextPage: false };
    }
  }

  async getNewest(type: string = 'manga', page: number = 1) {
    try {
      const pagePath = page > 1 ? `/page/${page}` : '';
      const { data } = await this.axiosInstance.get(`${this.apiUrl}/manga${pagePath}/?orderby=date&tipe=${type}`);
      const $ = cheerio.load(data);
      const comics: any[] = [];

      $('.bge').each((i, el) => {
        const title = $(el).find('.kan h3').text().trim();
        const urlWithSlug = $(el).find('.kan a').attr('href');
        const slug = urlWithSlug ? urlWithSlug.split('/manga/')[1]?.replace(/\/$/, '') : '';
        const thumbnail = $(el).find('.bgei img').attr('src');
        const latestChapter = $(el).find('.new1').last().find('span').last().text().trim();
        const description = $(el).find('.kan p').text().trim();

        if (title && slug) {
          comics.push({
            title,
            slug,
            thumbnail,
            latest_chapter: latestChapter,
            description
          });
        }
      });

      // Pagination meta
      const nextUrl = $('span[hx-get]').attr('hx-get');
      const hasNextPage = !!nextUrl;

      return {
        data: comics,
        hasNextPage
      };
    } catch (error) {
      console.error('Error in getNewest:', error);
      return { data: [], hasNextPage: false };
    }
  }

  async getList(type: string = 'manga', status: string = '', genre: string = '', genre2: string = '', page: number = 1) {
    try {
      // https://api.komiku.org/manga/page/2/?orderby=modified&tipe=manga...
      const pagePath = page > 1 ? `/page/${page}` : '';
      const { data } = await this.axiosInstance.get(`${this.apiUrl}/manga${pagePath}/?orderby=modified&tipe=${type}&genre=${genre}&genre2=${genre2}&status=${status}`);
      const $ = cheerio.load(data);
      const comics: any[] = [];

      $('.bge').each((i, el) => {
        const title = $(el).find('.kan h3').text().trim();
        const urlWithSlug = $(el).find('.kan a').attr('href');
        const slug = urlWithSlug ? urlWithSlug.split('/manga/')[1]?.replace(/\/$/, '') : '';
        const thumbnail = $(el).find('.bgei img').attr('src');
        const latestChapter = $(el).find('.new1').last().find('span').last().text().trim();
        const description = $(el).find('.kan p').text().trim();

        if (title && slug) {
          comics.push({
            title,
            slug,
            thumbnail,
            latest_chapter: latestChapter,
            description
          });
        }
      });

      // Pagination meta
      const nextUrl = $('span[hx-get]').attr('hx-get');
      const hasNextPage = !!nextUrl;

      return {
        data: comics,
        hasNextPage
      };
    } catch (error) {
       console.error('Error in getList:', error);
       return { data: [], hasNextPage: false };
    }
  }

  async search(query: string, page: number = 1) {
    try {
      // Search pagination: https://api.komiku.org/page/2/?post_type=manga&s=...
      const pagePath = page > 1 ? `/page/${page}` : '';
      const { data } = await this.axiosInstance.get(`${this.apiUrl}${pagePath}/?post_type=manga&s=${encodeURIComponent(query)}`);
      const $ = cheerio.load(data);
      const comics: any[] = [];

      // Check if there is a 'bge' list directly
      $('.bge').each((i, el) => {
        const title = $(el).find('.kan h3').text().trim();
        const urlWithSlug = $(el).find('.kan a').attr('href');
        const slug = urlWithSlug ? urlWithSlug.split('/manga/')[1]?.replace(/\/$/, '') : '';
        const thumbnail = $(el).find('.bgei img').attr('src');
        const latestChapter = $(el).find('.new1').last().find('span').last().text().trim();
        const description = $(el).find('.kan p').text().trim();

         // Search results might look slightly different, but usually share the 'bge' class on this site based on 'index' class.
         if (title && slug) {
            comics.push({
              title,
              slug,
              thumbnail,
              latest_chapter: latestChapter,
              description
            });
         }
      });
      
      // Pagination meta
      const nextUrl = $('span[hx-get]').attr('hx-get');
      const hasNextPage = !!nextUrl;

      return {
        data: comics,
        hasNextPage
      };
    } catch (error) {
      console.error('Error in search:', error);
      return { data: [], hasNextPage: false };
    }
  }

  async getGenres() {
    try {
      const { data } = await this.axiosInstance.get(`${this.baseUrl}/pustaka/`);
      const $ = cheerio.load(data);
      const genres: string[] = [];
      
      $('select[name="genre"] option').each((i, el) => {
        const value = $(el).val() as string;
        if(value) {
            genres.push(value);
        }
      });

      return {
          data: genres,
          hasNextPage: false
      };
    } catch (error) {
      console.error('Error in getGenres:', error);
      return { data: [], hasNextPage: false };
    }
  }

  async getComicDetail(slug: string) {
    try {
      const { data } = await this.axiosInstance.get(`/manga/${slug}/`);
      const $ = cheerio.load(data);

      const title = $('header h1 span[itemprop="name"]').text().trim();
      const synopsis = $('p.desc').text().trim();
      const thumbnail = $('div.ims img').attr('src');
      
      // Info Table
      const info: Record<string, string> = {};
      $('table.inftable tr').each((i, el) => {
          const key = $(el).find('td').first().text().trim().replace(/\s+/g, '_').toLowerCase();
          const value = $(el).find('td').last().text().trim();
          if(key) info[key] = value;
      });

      // Genres
      const genres: string[] = [];
      $('ul.genre li.genre a span[itemprop="genre"]').each((i, el) => {
        genres.push($(el).text().trim());
      });

      // Chapters
      const chapters: any[] = [];
      $('table#Daftar_Chapter tbody tr').each((i, el) => {
          const chapterEl = $(el).find('td.judulseries a');
          const title = chapterEl.find('span').text().trim();
          const href = chapterEl.attr('href');
          // href is like /kimetsu-no-yaiba-chapter-205-6/
          // slug is kimetsu-no-yaiba-chapter-205-6
          const chapterSlug = href ? href.replace(/^\//, '').replace(/\/$/, '') : '';
          const date = $(el).find('td.tanggalseries').text().trim();

          if(chapterSlug) {
            chapters.push({
                title,
                slug: chapterSlug,
                date
            });
          }
      });

      return {
        title,
        slug,
        thumbnail,
        synopsis,
        info,
        genres,
        chapters
      };

    } catch (error) {
      console.error('Error in getComicDetail:', error);
      return null;
    }
  }

  async getChapterDetail(slug: string) {
    try {
      const { data } = await this.axiosInstance.get(`/${slug}/`);
      const $ = cheerio.load(data);

      const title = $('#Judul header h1').text().trim();
      
      const images: string[] = [];
      $('#Baca_Komik img').each((i, el) => {
          const src = $(el).attr('src');
          if(src) images.push(src);
      });

      return {
        title,
        slug,
        images
      };
    } catch (error) {
      console.error('Error in getChapterDetail:', error);
      return null;
    }
  }
}
