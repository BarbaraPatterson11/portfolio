import React from 'react';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import { ToolsFanCards, type ToolFanCategory } from '../components/ui/tools-fan-cards';

const toolCategories: ToolFanCategory[] = [
  {
    categoryName: 'E-commerce Platforms',
    shortName: 'ECOMMERCE',
    purpose: 'Storefront and marketplace platforms used for e-commerce operations, product listings, and multichannel selling.',
    backgroundPosition: '6% center',
    tools: [
      { name: 'Shopify', id: 'shopify.svg' },
      { name: 'Amazon Seller Central', id: 'amazon.png' },
      { name: 'eBay Seller Hub', id: 'ebay.svg' },
      { name: 'Etsy', id: 'etsy.webp' },
      { name: 'Walmart Marketplace', id: 'walmart.png' },
      { name: 'Gorgias', id: 'gorgias.png' },
      { name: 'CJ Dropshipping', id: 'cj-dropshipping.ico' },
      { name: 'ShipStation', id: 'shipstation.svg' },
    ],
  },
  {
    categoryName: 'Product & Data Management',
    shortName: 'PRODUCT DATA',
    purpose: 'Tools for organizing product catalogs, managing spreadsheet data, handling bulk uploads, and maintaining accurate inventory records.',
    backgroundPosition: '19% center',
    tools: [
      { name: 'Google Sheets', id: 'google-sheets.svg' },
      { name: 'Microsoft Excel', id: 'ms-excel.svg' },
      { name: 'Shopify CSV', icon: 'spreadsheet' },
      { name: 'Matrixify', id: 'matrixify.png' },
      { name: 'Setary', id: 'setary.png' },
      { name: 'DSers', id: 'dsers.avif' },
    ],
  },
  {
    categoryName: 'UI/UX & Creative Design',
    shortName: 'DESIGN',
    purpose: 'Design tools and Shopify page builders for creating mobile-friendly storefronts, polished product pages, and conversion-focused landing pages.',
    backgroundPosition: '32% center',
    tools: [
      { name: 'Figma', id: 'figma.webp' },
      { name: 'Canva', id: 'canva.svg' },
      { name: 'Adobe Photoshop', id: 'photoshop.svg' },
      { name: 'Chrome DevTools', icon: 'devtools' },
      { name: 'Shogun', id: 'shogun.png' },
      { name: 'GemPages', id: 'gempages.jpg' },
      { name: 'PageFly', id: 'pagefly.png' },
      { name: 'EComposer', id: 'ecomposer.png' },
      { name: 'LayoutHub', id: 'layouthub.png' },
      { name: 'Replo', id: 'replo.png' },
      { name: 'Zipify Pages', id: 'zipify-pages.jpg' },
    ],
  },
  {
    categoryName: 'CRO & A/B Testing',
    shortName: 'CRO & TESTING',
    purpose: 'Experimentation and behavioral analytics tools for evaluating conversion opportunities, testing storefront variations, and improving the customer journey.',
    backgroundPosition: '44% center',
    tools: [
      { name: 'Intelligems', id: 'intelligems.png' },
      { name: 'ABConvert', id: 'abconvert.png' },
      { name: 'Microsoft Clarity', id: 'microsoft-clarity.ico' },
      { name: 'Hotjar', id: 'hotjar.svg' },
      { name: 'Lucky Orange', id: 'lucky-orange.png' },
    ],
  },
  {
    categoryName: 'SEO & Analytics',
    shortName: 'SEO & ANALYTICS',
    purpose: 'Tools for monitoring store performance, analyzing customer behavior, researching keywords, and improving search visibility.',
    backgroundPosition: '57% center',
    tools: [
      { name: 'Google Analytics 4', id: 'google-analytics.svg' },
      { name: 'Google Search Console', id: 'google-search-console.svg' },
      { name: 'Google PageSpeed Insights', id: 'pagespeed-insights.svg' },
      { name: 'Google Keyword Planner', id: 'google-keyword-planner.svg' },
      { name: 'Ahrefs', id: 'ahrefs.svg' },
      { name: 'Semrush', id: 'semrush.svg' },
    ],
  },
  {
    categoryName: 'Email Marketing & Automation',
    shortName: 'AUTOMATION',
    purpose: 'E-commerce marketing tools for customer segmentation, email campaigns, automated workflows, abandoned checkout recovery, and customer retention.',
    backgroundPosition: '69% center',
    tools: [
      { name: 'Klaviyo', id: 'klaviyo.png' },
      { name: 'Shopify Email', id: 'shopify.svg' },
      { name: 'Shopify Flow', id: 'shopify.svg' },
      { name: 'Mailchimp', id: 'mailchimp.svg' },
      { name: 'Omnisend', id: 'omnisend.png' },
    ],
  },
  {
    categoryName: 'AI & Productivity',
    shortName: 'AI & WORKFLOW',
    purpose: 'AI assistants and workflow management tools for research, content preparation, task organization, and team collaboration.',
    backgroundPosition: '82% center',
    tools: [
      { name: 'ChatGPT', id: 'chatgpt.svg' },
      { name: 'Shopify Sidekick', id: 'shopify.svg' },
      { name: 'Trello', id: 'trello.svg' },
      { name: 'Notion', id: 'notion.svg' },
      { name: 'Slack', id: 'slack.svg' },
    ],
  },
  {
    categoryName: 'Frontend Development',
    shortName: 'DEVELOPMENT',
    purpose: 'Code editors, development technologies, and version control tools used for Shopify theme customization and responsive storefront development.',
    backgroundPosition: '95% center',
    tools: [
      { name: 'Visual Studio Code', id: 'visual-studio-code.png' },
      { name: 'Shopify Liquid', icon: 'liquid' },
      { name: 'HTML5', id: 'html5.svg' },
      { name: 'CSS3', id: 'css3.svg' },
      { name: 'JavaScript', id: 'javascript.svg' },
      { name: 'GitHub', id: 'github.svg' },
    ],
  },
];

export const Tools: React.FC = () => (
  <section
    id="tools"
    className="relative flex min-h-[760px] items-center overflow-hidden bg-[#080808] py-20 sm:min-h-[820px] sm:py-24"
  >
    {/* Gradient transition from previous section (black to #080808) */}
    <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-[#080808] pointer-events-none z-0" />
    <div className="w-full">
      <ScrollReveal
        className="relative z-20 mx-auto mb-10 max-w-3xl px-5 text-center sm:mb-12"
        blur={false}
      >
        <span className="font-mono text-[10px] md:text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
          What I Use
        </span>
        <h2 className="mt-3 font-display text-[clamp(2.5rem,calc(5*var(--vw)),4.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.05em] [word-spacing:0.1em] text-white">
          Tools I Use
        </h2>
        <p className="mx-auto mt-3 max-w-2xl font-body text-sm font-normal leading-relaxed tracking-[-0.01em] text-white/70 sm:text-[15px]">
          A specialized toolkit for Shopify store management, product listing, UI/UX design,
          conversion optimization, analytics, and e-commerce automation.
        </p>
      </ScrollReveal>

      <ToolsFanCards categories={toolCategories} />
    </div>
  </section>
);
