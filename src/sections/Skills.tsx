import React, { useRef } from 'react';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import { HoverExpand } from '../components/ui/hover-expand';
import { WordPullUp } from '../components/animations/WordPullUp';

const accordionSkills = [
  {
    label: 'Shopify Store Management',
    sublabel: 'PLATFORMS',
    description: 'Managing Shopify storefront operations, product organization, inventory updates, merchandising, and day-to-day store maintenance.',
    detailTags: ['Shopify Admin', 'Shopify Theme Editor', 'Store Setup', 'Collection Management', 'Inventory Updates', 'Order Management', 'Store Merchandising', 'Storefront QA', 'Shopify Sidekick']
  },
  {
    label: 'Product Listing & Catalog',
    sublabel: 'LISTING',
    description: 'Creating accurate, organized, and optimized product listings with compelling descriptions, complete product details, and consistent catalog data.',
    detailTags: ['Product Uploads', 'Product Titles', 'Product Descriptions', 'Product Images', 'Variants & Options', 'SKU Management', 'Product Collections', 'CSV Import/Export', 'Bulk Editing', 'Product Research']
  },
  {
    label: 'UI/UX & Storefront Design',
    sublabel: 'DESIGN',
    description: 'Designing intuitive, mobile-friendly Shopify shopping experiences with clear navigation, strong visual hierarchy, and conversion-focused layouts.',
    detailTags: ['UI/UX Design', 'Figma', 'Shopify Theme Editor', 'Shogun', 'GemPages', 'PageFly', 'EComposer', 'LayoutHub', 'Replo', 'Zipify Pages', 'Homepage Design', 'Product Page Design', 'Landing Page Layouts', 'Mobile-First Design', 'Responsive Design', 'Navigation UX', 'Visual Hierarchy']
  },
  {
    label: 'Conversion Rate Optimization',
    sublabel: 'CRO & TESTING',
    description: 'Improving the customer purchase journey through product page optimization, conversion analysis, experiment hypotheses, and structured A/B testing.',
    detailTags: ['CRO Audits', 'PDP Optimization', 'Landing Page Optimization', 'USP Development', 'CTA Optimization', 'Cart UX', 'A/B Testing', 'Experiment Design', 'Pricing & Offer Testing', 'Bundle Testing', 'Intelligems']
  },
  {
    label: 'Shopify SEO & Performance',
    sublabel: 'OPTIMIZATION',
    description: 'Improving product discoverability, search visibility, mobile usability, and storefront performance through structured SEO and optimization practices.',
    detailTags: ['Product SEO', 'Keyword Research', 'Meta Titles', 'Meta Descriptions', 'Image Alt Text', 'URL Optimization', 'Internal Linking', 'Google Search Console', 'PageSpeed Insights', 'Image Optimization']
  },
  {
    label: 'Analytics & Data Management',
    sublabel: 'ANALYTICS',
    description: 'Organizing product data and interpreting store performance metrics to identify opportunities for better merchandising, usability, and conversions.',
    detailTags: ['Shopify Analytics', 'Google Analytics 4', 'Conversion Funnels', 'Conversion Rate (CVR)', 'Average Order Value (AOV)', 'Revenue Per Visitor', 'Google Sheets', 'Microsoft Excel', 'CSV Data Management', 'A/B Test Reporting']
  },
  {
    label: 'Email Marketing & Automation',
    sublabel: 'AUTOMATION',
    description: 'Supporting customer engagement and retention through email campaigns, audience segmentation, and automated e-commerce marketing workflows.',
    detailTags: ['Klaviyo', 'Shopify Email', 'Shopify Flow', 'Email Campaigns', 'Welcome Flows', 'Abandoned Checkout', 'Customer Segmentation', 'Email Templates', 'Retention Marketing', 'Marketing Automation']
  },
  {
    label: 'Shopify Frontend Customization',
    sublabel: 'DEVELOPMENT',
    description: 'Customizing Shopify storefront presentation and interactions through theme editing, responsive styling, and frontend development fundamentals.',
    detailTags: ['HTML', 'CSS', 'JavaScript', 'Shopify Liquid', 'Theme Customization', 'Custom Sections', 'Responsive Styling', 'Chrome DevTools', 'VS Code', 'GitHub']
  }
];

export const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="skills" ref={sectionRef} className="mobile-seamless-section relative flex min-h-[calc(100*var(--vh))] flex-col justify-start overflow-hidden bg-[#080808] py-6 text-white sm:justify-center sm:py-10 md:block md:min-h-0 md:py-28">
      
      {/* Gradient transition from previous section (black to #080808) */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-[#080808] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <ScrollReveal className="mb-3 text-center sm:mb-5 md:mb-8">
          <span className="font-mono text-[10px] md:text-[11px] font-medium uppercase tracking-[0.28em] text-white/50 mb-3 block">
            E-Commerce Expertise
          </span>
          <WordPullUp
            words="My Skills"
            className="font-display text-[clamp(2.5rem,calc(5.5*var(--vw)),5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.07em] text-white"
            wrapperFramerProps={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
            }}
          />
        </ScrollReveal>

        <ScrollReveal className="mt-3 w-full md:mt-6">
          <HoverExpand 
            items={accordionSkills} 
            collapsedHeight={74} 
            expandedHeight={300}
            className="w-full text-white"
          />
        </ScrollReveal>
        
      </div>
    </section>
  );
};
