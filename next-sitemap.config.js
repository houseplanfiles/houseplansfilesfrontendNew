/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.houseplanfiles.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/admin', '/admin/*', '/dashboard', '/dashboard/*',
    '/professional', '/professional/*', '/seller', '/seller/*',
    '/cart', '/checkout', '/login', '/register',
    '/forgot-password', '/reset-password', '/reset-password/*',
    '/order-success', '/order-success/*', '/thank-you',
    '/products', '/download', '/download/*',
    '/apply', '/apply/*', '/booking-form', '/premium-booking-form',
    '/corporate-inquiry', '/corporate-inquiry/*',
    '/become-a-seller', '/brand-partners',
  ],
  transform: async (config, path) => {
    if (path === '/') return { loc: path, changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString() };
    if (path === '/house-plans') return { loc: path, changefreq: 'daily', priority: 0.95, lastmod: new Date().toISOString() };
    if (path.startsWith('/house-plans/plot/')) return { loc: path, changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() };
    if (path.startsWith('/house-plans/') && !path.includes('/category/') && !path.includes('/region/') && !path.includes('/plot/')) return { loc: path, changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() };
    if (path.startsWith('/house-plans/category/') || path.startsWith('/house-plans/region/')) return { loc: path, changefreq: 'weekly', priority: 0.85, lastmod: new Date().toISOString() };
    if (path.startsWith('/city/')) return { loc: path, changefreq: 'weekly', priority: 0.85, lastmod: new Date().toISOString() };
    if (path.startsWith('/blog/')) return { loc: path, changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() };
    if (path.startsWith('/architects') || path.startsWith('/city-partners')) return { loc: path, changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() };
    return { loc: path, changefreq: config.changefreq, priority: config.priority, lastmod: new Date().toISOString() };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/', '/dashboard/', '/professional/', '/seller/',
          '/cart', '/checkout', '/login', '/register',
          '/forgot-password', '/reset-password/', '/order-success/',
          '/api/', '/thank-you', '/download/', '/apply/',
          '/booking-form', '/premium-booking-form', '/corporate-inquiry/',
        ],
      },
      { userAgent: 'Googlebot', allow: '/', disallow: ['/admin/', '/dashboard/', '/professional/', '/seller/', '/cart', '/checkout', '/download/'] },
      { userAgent: 'Googlebot-Image', allow: '/' },
    ],
    additionalSitemaps: ['https://www.houseplanfiles.com/sitemap.xml'],
  },
};
