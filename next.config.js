const { cleanEnv, str, email } = require('envalid');

const env = cleanEnv(process.env, {
  SENDGRID_KEY: str(),
  CONTACT_TO: email({ default: 'info@blanchard.no' }),
  CONTACT_FROM: email({ default: 'info@blanchard.no' }),
  RECAPTCHA_SECRET: str(),
  RECAPTCHA_SITEKEY: str(),
  BASE: str(),
});

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    basePath: env.BASE,
    reSiteKey: env.RECAPTCHA_SITEKEY,
  },
  serverRuntimeConfig: {
    sendgridKey: env.SENDGRID_KEY,
    contactTo: env.CONTACT_TO,
    contactFrom: env.CONTACT_FROM,
    reSecret: env.RECAPTCHA_SECRET,
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/',
          destination: '/index.html',
        },
      ],
    };
  },
});

module.exports = nextConfig;
