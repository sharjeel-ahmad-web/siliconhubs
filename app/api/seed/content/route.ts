import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// Complete site content extracted from all components
const initialContent = [
  // ==================== HOMEPAGE ====================
  {
    page: 'home',
    section: 'hero',
    content: {
      eyebrow: 'Digital Excellence Delivered',
      title: 'Rising Dot Agency',
      subtitle:
        'We craft stunning websites, powerful automations, and intelligent chatbots that transform your digital presence.',
      ctaText: 'Get Started',
      ctaLink: '/contact',
      scrollText: 'Scroll to explore',
      // Images: public/scene.splinecode (3D model)
    },
  },
  {
    page: 'home',
    section: 'showreel',
    content: {
      // Videos: public/videos/showreel_desktop_16-9.mp4, showreel_mobile_9-16.mp4
      desktopVideo: '/videos/showreel_desktop_16-9.mp4',
      mobileVideo: '/videos/showreel_mobile_9-16.mp4',
    },
  },
  {
    page: 'home',
    section: 'featuredServices',
    content: {
      eyebrow: 'What We Offer',
      title: 'Featured',
      titleHighlight: 'Services',
      subtitle:
        'Discover how we help businesses transform their digital presence',
      // Images: public/media/home/featured-services/*.jpg
      services: [
        {
          title: 'N8N Automations',
          description:
            'Streamline your business workflows with powerful N8N automation solutions. We build custom integrations that connect your apps, automate repetitive tasks, and save you countless hours every week.',
          imageUrl: '/media/home/featured-services/n8n-automations.jpg',
          href: '/services/n8n-automations',
          ctaText: 'Explore Automations',
        },
        {
          title: 'Chatbot Development',
          description:
            'Engage your customers 24/7 with intelligent AI-powered chatbots. From customer support to lead generation, our chatbots deliver personalized experiences that convert visitors into customers.',
          imageUrl: '/media/home/featured-services/chatbot-development.jpg',
          href: '/services/chatbot-development',
          ctaText: 'Build Your Chatbot',
        },
        {
          title: 'Web Development',
          description:
            'Create stunning, high-performance websites that captivate your audience. We specialize in modern web technologies to deliver fast, responsive, and SEO-optimized digital experiences.',
          imageUrl: '/media/home/featured-services/web-development.jpg',
          href: '/services/web-design',
          ctaText: 'Start Your Project',
        },
        {
          title: 'Shopify Solutions',
          description:
            'Launch and scale your e-commerce business with custom Shopify stores. From theme customization to app integrations, we build online stores that drive sales and delight customers.',
          imageUrl: '/media/home/featured-services/shopify.jpg',
          href: '/services/shopify',
          ctaText: 'Launch Your Store',
        },
        {
          title: 'WordPress Development',
          description:
            'Build powerful, flexible websites with WordPress. Whether you need a blog, business site, or custom web application, we create WordPress solutions tailored to your unique needs.',
          imageUrl: '/media/home/featured-services/wordpress.jpg',
          href: '/services/wordpress',
          ctaText: 'Get WordPress Site',
        },
        {
          title: 'SEO Optimization',
          description:
            'Dominate search rankings and drive organic traffic to your website. Our data-driven SEO strategies help you reach your target audience and grow your online presence sustainably.',
          imageUrl: '/media/home/featured-services/seo.jpg',
          href: '/services/seo',
          ctaText: 'Boost Your Rankings',
        },
      ],
    },
  },
  {
    page: 'home',
    section: 'valueProposition',
    content: {
      eyebrow: 'Digital Excellence',
      title: 'Transform Your',
      titleHighlight: 'Digital Presence',
      subtitle: 'Premium digital solutions powered by cutting-edge technology',
      // Color configuration
      colors: {
        cardBackground: '#1E293B',
        cardAccentColor: '#37AFE1',
        cardHoverAccentColor: '#F58122',
        particleColor: '#37AFE1',
        connectionLineStart: '#37AFE1',
        connectionLineEnd: '#F58122',
      },
      services: [
        {
          id: 'n8n',
          name: 'N8N Automations',
          icon: '⚡',
          description: 'Workflow automation',
          relatedServices: ['chatbot', 'shopify'],
        },
        {
          id: 'chatbot',
          name: 'Chatbot Development',
          icon: '🤖',
          description: 'AI-powered conversations',
          relatedServices: ['n8n', 'web-design'],
        },
        {
          id: 'web-design',
          name: 'Web Design',
          icon: '🎨',
          description: 'Beautiful interfaces',
          relatedServices: ['chatbot', 'wordpress'],
        },
        {
          id: 'wordpress',
          name: 'WordPress',
          icon: '📝',
          description: 'Content management',
          relatedServices: ['web-design', 'seo'],
        },
        {
          id: 'shopify',
          name: 'Shopify',
          icon: '🛒',
          description: 'E-commerce solutions',
          relatedServices: ['n8n', 'seo'],
        },
        {
          id: 'seo',
          name: 'SEO',
          icon: '📈',
          description: 'Search optimization',
          relatedServices: ['wordpress', 'shopify'],
        },
      ],
    },
  },
  {
    page: 'home',
    section: 'serviceCards',
    content: {
      eyebrow: 'Solutions',
      title: 'Our',
      titleHighlight: 'Services',
      subtitle: 'Comprehensive digital solutions tailored to your needs',
      // Color configuration
      colors: {
        cardBackground: '#1E293B',
        cardAccentColor: '#37AFE1',
        cardHoverAccentColor: '#F58122',
        particleColor: '#37AFE1',
        featureDotColor: '#37AFE1',
        linkColor: '#37AFE1',
        linkHoverColor: '#F58122',
        borderColor: '#334155',
      },
      cards: [
        {
          id: 'n8n-automations',
          title: 'N8N Automations',
          description:
            'Streamline your workflows with powerful automation solutions that save time and reduce errors.',
          icon: '⚡',
          features: [
            'Workflow Design',
            'API Integration',
            'Process Automation',
          ],
        },
        {
          id: 'chatbot-development',
          title: 'Chatbot Development',
          description:
            'AI-powered conversational interfaces that engage users and provide instant support 24/7.',
          icon: '🤖',
          features: ['Natural Language', 'AI Training', 'Multi-Platform'],
        },
        {
          id: 'web-design',
          title: 'Web Design',
          description:
            'Beautiful, responsive websites that captivate visitors and drive conversions.',
          icon: '🎨',
          features: ['UI/UX Design', 'Responsive', 'Brand Identity'],
        },
        {
          id: 'wordpress',
          title: 'WordPress',
          description:
            'Custom WordPress solutions that are scalable, secure, and easy to manage.',
          icon: '📝',
          features: ['Custom Themes', 'Plugin Development', 'Performance'],
        },
        {
          id: 'shopify',
          title: 'Shopify',
          description:
            'E-commerce solutions that maximize conversions and provide seamless shopping experiences.',
          icon: '🛒',
          features: ['Store Setup', 'Custom Apps', 'Conversion Optimization'],
        },
        {
          id: 'seo',
          title: 'SEO',
          description:
            'Data-driven SEO strategies that improve rankings and drive organic traffic growth.',
          icon: '📈',
          features: ['Keyword Research', 'Technical SEO', 'Content Strategy'],
        },
      ],
    },
  },
  {
    page: 'home',
    section: 'caseStudies',
    content: {
      eyebrow: 'Case Studies',
      title: 'Results That',
      titleHighlight: 'Speak',
      subtitle:
        "Real projects, real impact. See how we've helped businesses transform their digital presence.",
      // Images: public/media/home/case-studies/*.jpg
      studies: [
        {
          img: '/media/home/case-studies/ecommerce.jpg',
          title: 'E-Commerce Success',
          desc: 'Increased conversion rates by 45% through strategic UX redesign and performance optimization.',
          sliderName: 'ecommerce',
        },
        {
          img: '/media/home/case-studies/saas-dashboard.jpg',
          title: 'SaaS Dashboard',
          desc: 'Built a real-time analytics platform serving 10,000+ daily active users with 99.9% uptime.',
          sliderName: 'saas',
        },
        {
          img: '/media/home/case-studies/workflow-automation.jpg',
          title: 'Workflow Automation',
          desc: 'Automated 200+ hours of manual work monthly using N8N workflows and custom integrations.',
          sliderName: 'automation',
        },
        {
          img: '/media/home/case-studies/ai-chatbot.jpg',
          title: 'AI Chatbot',
          desc: 'Deployed intelligent chatbot handling 5,000+ customer queries daily with 95% satisfaction rate.',
          sliderName: 'chatbot',
        },
      ],
    },
  },
  {
    page: 'home',
    section: 'testimonials',
    content: {
      eyebrow: '✨ Client Success Stories',
      title: 'Trusted by',
      titleHighlight: 'Industry Leaders',
      subtitle:
        'Join businesses already transforming their digital presence with Rising Starter.',
      stats: [
        { number: '500+', label: 'Happy Clients' },
        { number: '98%', label: 'Satisfaction Rate' },
        { number: '$10M+', label: 'Revenue Generated' },
        { number: '99.9%', label: 'Uptime SLA' },
      ],
      // Images: public/media/home/testimonials/*.jpg
    },
  },
  {
    page: 'home',
    section: 'team',
    content: {
      eyebrow: 'Zero Gravity Talent',
      title: 'Agency &',
      titleHighlight: 'Team',
      // Images: public/team/*.png
    },
  },
  {
    page: 'home',
    section: 'techStack',
    content: {
      eyebrow: 'Technologies',
      title: 'Trusted by Experts.',
      titleHighlight: 'Used by Leaders.',
      subtitle: 'We use cutting-edge technologies to build powerful solutions',
      // Tech logos: public/media/home/tech-stack-marquee/*.svg
    },
  },
  {
    page: 'home',
    section: 'stackFeature',
    content: {
      eyebrow: '✨ Our Tech Stack',
      title: 'Build Your',
      titleHighlight: 'Digital Empire',
      subtitle:
        'We leverage cutting-edge technologies to deliver scalable, high-performance solutions that drive your business forward.',
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
      secondaryCtaText: 'View Our Work',
      secondaryCtaHref: '/portfolio',
      centerText: 'RISING',
      colors: {
        borderColor: '#37AFE1',
        orbitBorderColor: '#37AFE1',
        iconBgColor: '#0F172A',
        iconBorderColor: '#37AFE1',
        gradientStart: '#F58122',
        gradientEnd: '#37AFE1',
      },
      icons: [
        { icon: 'FaReact', color: '#61DAFB' },
        { icon: 'FaAws', color: '#FF9900' },
        { icon: 'FaDocker', color: '#2496ED' },
        { icon: 'FaNodeJs', color: '#339933' },
        { icon: 'SiNextdotjs', color: '#FFFFFF' },
        { icon: 'SiVercel', color: '#FFFFFF' },
        { icon: 'SiTypescript', color: '#3178C6' },
        { icon: 'SiTailwindcss', color: '#06B6D4' },
        { icon: 'FaWordpress', color: '#21759B' },
        { icon: 'FaShopify', color: '#7AB55C' },
        { icon: 'SiOpenai', color: '#10A37F' },
        { icon: 'SiN8N', color: '#EA4B71' },
        { icon: 'FaGoogle', color: '#DB4437' },
        { icon: 'FaSlack', color: '#4A154B' },
        { icon: 'SiStripe', color: '#635BFF' },
        { icon: 'SiSupabase', color: '#3ECF8E' },
      ],
    },
  },
  {
    page: 'home',
    section: 'blog',
    content: {
      eyebrow: 'Latest Insights',
      title: 'From Our',
      titleHighlight: 'Blog',
      subtitle:
        'Stay updated with the latest trends and insights in digital technology',
      // Blog posts are managed in the Blog Posts section
    },
  },
  {
    page: 'home',
    section: 'connect',
    content: {
      title: 'Any questions about your project?',
      subtitle: 'Feel free to reach out to us!',
      ctaText: 'Book a call',
      ctaLink: '/contact',
      email: 'contact@risingdot.agency',
      whatsapp: '+1234567890',
      services: ['Chatbots', 'N8N Automation', 'Web Development', 'Shopify'],
    },
  },
  {
    page: 'home',
    section: 'contact',
    content: {
      eyebrow: 'Get In Touch',
      title: "Let's Build Something",
      titleHighlight: 'Amazing',
      subtitle: 'Connect with us from anywhere in the world',
      // Contact form is handled by the HolographicContact component
    },
  },
  {
    page: 'home',
    section: 'cta',
    content: {
      eyebrow: 'Ready to Start?',
      title: "Let's Build Something",
      titleHighlight: 'Extraordinary',
      subtitle:
        "Transform your vision into reality with our expert team. We're ready to bring your ideas to life.",
      ctaText: 'Get Started Today',
      ctaLink: '/contact',
      secondaryCtaText: 'View Our Work',
      secondaryCtaLink: '/portfolio',
      stats: [
        { number: '500+', label: 'Projects Completed' },
        { number: '98%', label: 'Client Satisfaction' },
        { number: '50+', label: 'Team Members' },
        { number: '24/7', label: 'Support Available' },
      ],
    },
  },

  // ==================== ABOUT PAGE ====================
  {
    page: 'about',
    section: 'hero',
    content: {
      eyebrow: 'Who We Are',
      title: 'About Rising Dot',
      subtitle:
        "We're a team of passionate developers, designers, and strategists dedicated to creating exceptional digital experiences that drive results.",
      ctaLabel: 'Meet Our Team',
      ctaHref: '#team',
    },
  },
  {
    page: 'about',
    section: 'showreel',
    content: {
      videoUrl: '/media/about/agency-showreel/videos/showreel.mp4',
      caption: 'OUR VISION',
      heading: 'Rising Together in the World of Digital Dots',
      paragraphs: [
        'We transform ideas into exceptional digital experiences that drive real business results.',
        "From stunning web designs to powerful automations, we're your partner in digital growth.",
      ],
      // Video: public/media/about/agency-showreel/videos/showreel.mp4
    },
  },
  {
    page: 'about',
    section: 'team',
    content: {
      eyebrow: 'Zero Gravity Talent',
      title: 'Agency &',
      titleHighlight: 'Team',
      socialText: 'Connect with us',
      // Images: public/team/*.png - Team members managed in Team section
    },
  },
  {
    page: 'about',
    section: 'skills',
    content: {
      eyebrow: 'What We Do Best',
      title: 'Our',
      titleHighlight: 'Expertise',
      skills: [
        { name: 'Web Design', level: 95, color: '#2563EB' },
        { name: 'React/Next.js', level: 90, color: '#F97316' },
        { name: 'SEO', level: 88, color: '#2563EB' },
        { name: 'N8N Automation', level: 92, color: '#F97316' },
        { name: 'AI/Chatbots', level: 85, color: '#2563EB' },
        { name: 'WordPress', level: 87, color: '#F97316' },
        { name: 'Shopify', level: 89, color: '#2563EB' },
        { name: 'Animation', level: 93, color: '#F97316' },
      ],
    },
  },
  {
    page: 'about',
    section: 'timeline',
    content: {
      eyebrow: 'Our Story',
      title: 'Our',
      titleHighlight: 'Journey',
      milestones: [
        {
          year: '2018',
          title: 'Company Founded',
          description:
            'Rising Dot Agency was born with a vision to revolutionize digital experiences.',
          era: 'foundation',
          icon: '🚀',
        },
        {
          year: '2019',
          title: 'First Major Client',
          description:
            'Landed our first enterprise client, delivering a complete digital transformation.',
          era: 'foundation',
          icon: '🎯',
        },
        {
          year: '2020',
          title: 'Team Expansion',
          description:
            'Grew from 3 to 15 team members, expanding our service offerings.',
          era: 'growth',
          icon: '👥',
        },
        {
          year: '2021',
          title: 'Award Recognition',
          description:
            'Won "Best Digital Agency" award for innovative web design and development.',
          era: 'growth',
          icon: '🏆',
        },
        {
          year: '2022',
          title: 'International Expansion',
          description:
            'Opened offices in three new countries, serving clients globally.',
          era: 'expansion',
          icon: '🌍',
        },
        {
          year: '2023',
          title: 'AI Integration',
          description: 'Launched AI-powered chatbot and automation services.',
          era: 'innovation',
          icon: '🤖',
        },
        {
          year: '2024',
          title: 'Industry Leader',
          description:
            'Recognized as a top 10 digital agency with 500+ successful projects.',
          era: 'innovation',
          icon: '⭐',
        },
      ],
    },
  },
  {
    page: 'about',
    section: 'officeTour',
    content: {
      eyebrow: 'Virtual Experience',
      title: '360°',
      titleHighlight: 'Office Tour',
      tourStops: [
        {
          id: '1',
          name: 'Reception Area',
          description:
            'Welcome to Rising Dot! Our modern reception area sets the tone for innovation.',
          image: '🏢',
          hotspots: [
            {
              id: '1-1',
              x: 30,
              y: 40,
              title: 'Digital Display',
              description: 'Real-time project showcase',
            },
            {
              id: '1-2',
              x: 70,
              y: 50,
              title: 'Lounge',
              description: 'Comfortable waiting area',
            },
          ],
        },
        {
          id: '2',
          name: 'Open Workspace',
          description:
            'Collaborative environment where creativity flows and ideas come to life.',
          image: '💻',
          hotspots: [
            {
              id: '2-1',
              x: 25,
              y: 35,
              title: 'Dev Stations',
              description: 'Dual-monitor setups for developers',
            },
            {
              id: '2-2',
              x: 50,
              y: 60,
              title: 'Standing Desks',
              description: 'Ergonomic workstations',
            },
            {
              id: '2-3',
              x: 75,
              y: 45,
              title: 'Collaboration Zone',
              description: 'Whiteboard brainstorming area',
            },
          ],
        },
        {
          id: '3',
          name: 'Meeting Rooms',
          description:
            'State-of-the-art meeting spaces equipped with the latest technology.',
          image: '🎯',
          hotspots: [
            {
              id: '3-1',
              x: 40,
              y: 50,
              title: 'Video Conferencing',
              description: '4K cameras and audio',
            },
            {
              id: '3-2',
              x: 70,
              y: 40,
              title: 'Smart Board',
              description: 'Interactive presentation display',
            },
          ],
        },
        {
          id: '4',
          name: 'Break Room',
          description:
            'Recharge and connect with teammates in our fully-stocked break area.',
          image: '☕',
          hotspots: [
            {
              id: '4-1',
              x: 30,
              y: 45,
              title: 'Coffee Bar',
              description: 'Premium espresso machine',
            },
            {
              id: '4-2',
              x: 60,
              y: 55,
              title: 'Game Zone',
              description: 'Ping pong and arcade games',
            },
          ],
        },
      ],
      // Images: public/media/about/office/*.jpg
    },
  },
  {
    page: 'about',
    section: 'testimonials',
    content: {
      eyebrow: '✨ Client Success Stories',
      title: 'What Our',
      titleHighlight: 'Clients Say',
      subtitle: 'Hear from businesses we have helped transform.',
      // Testimonials managed in Testimonials section
    },
  },
  {
    page: 'about',
    section: 'cta',
    content: {
      eyebrow: 'Start a Project',
      title: "Let's Build Something",
      titleHighlight: 'Amazing',
      subtitle:
        "Ready to transform your digital presence? Let's discuss your project.",
      ctaText: 'Get in Touch',
      ctaLink: '/contact',
    },
  },

  // ==================== CONTACT PAGE ====================
  {
    page: 'contact',
    section: 'hero',
    content: {
      eyebrow: "Let's Connect",
      title: 'Get In Touch',
      subtitle:
        "Ready to start your next project? Let's create something amazing together. We're here to help bring your vision to life.",
      ctaLabel: 'Send Message',
      ctaHref: '#contact-form',
    },
  },
  {
    page: 'contact',
    section: 'form',
    content: {
      title: 'Send Us a',
      titleHighlight: 'Message',
    },
  },
  {
    page: 'contact',
    section: 'info',
    content: {
      title: 'Contact',
      titleHighlight: 'Information',
      email: 'hello@risingdot.agency',
      phone: '+1 (555) 123-4567',
      address: '123 Innovation Street\nTech District, CA 94102',
      hours: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday - Sunday: Closed',
    },
  },
  {
    page: 'contact',
    section: 'map',
    content: {
      eyebrow: 'Location',
      title: 'Find',
      titleHighlight: 'Us',
    },
  },
  {
    page: 'contact',
    section: 'social',
    content: {
      eyebrow: 'Social Media',
      title: 'Connect',
      titleHighlight: 'With Us',
    },
  },
  {
    page: 'contact',
    section: 'cta',
    content: {
      eyebrow: 'Ready to Start?',
      title: "Let's Work",
      titleHighlight: 'Together',
      subtitle: 'Have a project in mind? We would love to hear from you.',
      ctaText: 'Get in Touch',
      ctaLink: '/contact',
    },
  },

  // ==================== PORTFOLIO PAGE ====================
  {
    page: 'portfolio',
    section: 'hero',
    content: {
      eyebrow: 'Our Work',
      title: 'Our Creative',
      titleHighlight: 'Portfolio',
      subtitle:
        'Explore our work across web design, e-commerce, automation, chatbots, and SEO. Each project showcases our commitment to excellence and innovation.',
      ctaLabel: 'Start Your Project',
      ctaHref: '/contact',
      heroItems: [
        {
          id: 1,
          title: 'E-Commerce',
          imageUrl: '/media/portfolio/hero/ecommerce.jpg',
        },
        {
          id: 2,
          title: 'Web Design',
          imageUrl: '/media/portfolio/hero/web-design.jpg',
        },
        {
          id: 3,
          title: 'AI Chatbots',
          imageUrl: '/media/portfolio/hero/ai-chatbots.jpg',
        },
        {
          id: 4,
          title: 'Automation',
          imageUrl: '/media/portfolio/hero/automation.jpg',
        },
        { id: 5, title: 'SEO', imageUrl: '/media/portfolio/hero/seo.jpg' },
      ],
      // Images: public/media/portfolio/hero/*.jpg
    },
  },
  {
    page: 'portfolio',
    section: 'filters',
    content: {
      eyebrow: 'Our Expertise',
      title: 'Skills &',
      titleHighlight: 'Technologies',
      subtitle:
        'Drag and explore the technologies we master to bring your vision to life',
      tags: [
        'All',
        'Web Design',
        'Shopify',
        'WordPress',
        'SEO',
        'Chatbot Development',
        'N8N Automations',
        'React',
        'Next.js',
        'Tailwind',
        'TypeScript',
        'Figma',
        'Stripe',
        'OpenAI',
        'Analytics',
        'SaaS',
        'AI/ML',
      ],
    },
  },
  {
    page: 'portfolio',
    section: 'grid',
    content: {
      eyebrow: 'Our Work',
      title: 'All',
      titleHighlight: 'Projects',
      subtitle: 'Explore our complete collection of successful client projects',
      // Images: public/media/portfolio/all-projects/project-{n}/*.jpg
      note: 'Projects are managed in the Projects section of the dashboard',
    },
  },

  // ==================== PORTFOLIO PAGE (continued) ====================
  {
    page: 'portfolio',
    section: 'projects',
    content: {
      projects: [
        {
          id: '1',
          title: 'E-Commerce Platform Redesign',
          client: 'TechStore Inc.',
          description:
            'Complete redesign of e-commerce platform with focus on conversion optimization and mobile experience.',
          thumbnailUrl: '/media/portfolio/all-projects/project-1/thumbnail.jpg',
          tags: ['Web Design', 'Shopify', 'SEO'],
          metrics: [
            { label: 'Conversion Rate', value: '+45%' },
            { label: 'Page Speed', value: '95/100' },
            { label: 'Mobile Traffic', value: '+60%' },
          ],
          images: [
            '/media/portfolio/all-projects/project-1/thumbnail.jpg',
            '/media/portfolio/all-projects/project-1/detail-1.jpg',
            '/media/portfolio/all-projects/project-1/detail-2.jpg',
          ],
          hotspots: [
            {
              x: 30,
              y: 40,
              title: 'Navigation',
              description: 'Simplified mega menu with visual categories',
            },
            {
              x: 70,
              y: 60,
              title: 'Product Grid',
              description: 'Optimized product cards with quick view',
            },
          ],
        },
        {
          id: '2',
          title: 'AI Chatbot Integration',
          client: 'Support Solutions',
          description:
            'Custom AI chatbot with natural language processing for customer support automation.',
          thumbnailUrl: '/media/portfolio/all-projects/project-2/thumbnail.jpg',
          tags: ['Chatbot Development', 'N8N Automations'],
          metrics: [
            { label: 'Response Time', value: '-80%' },
            { label: 'Customer Satisfaction', value: '4.8/5' },
            { label: 'Cost Savings', value: '$50K/year' },
          ],
          images: [
            '/media/portfolio/all-projects/project-2/thumbnail.jpg',
            '/media/portfolio/all-projects/project-2/detail-1.jpg',
            '/media/portfolio/all-projects/project-2/detail-2.jpg',
          ],
          hotspots: [
            {
              x: 50,
              y: 30,
              title: 'Chat Interface',
              description: 'Clean, intuitive chat UI',
            },
            {
              x: 50,
              y: 70,
              title: 'AI Engine',
              description: 'GPT-4 powered responses',
            },
          ],
        },
        {
          id: '3',
          title: 'WordPress Blog Platform',
          client: 'Content Creators Co.',
          description:
            'High-performance WordPress blog with custom theme and advanced SEO optimization.',
          thumbnailUrl: '/media/portfolio/all-projects/project-3/thumbnail.jpg',
          tags: ['WordPress', 'SEO', 'Web Design'],
          metrics: [
            { label: 'Organic Traffic', value: '+120%' },
            { label: 'Load Time', value: '1.2s' },
            { label: 'SEO Score', value: '98/100' },
          ],
          images: [
            '/media/portfolio/all-projects/project-3/thumbnail.jpg',
            '/media/portfolio/all-projects/project-3/detail-1.jpg',
            '/media/portfolio/all-projects/project-3/detail-2.jpg',
          ],
          hotspots: [
            {
              x: 40,
              y: 50,
              title: 'Article Layout',
              description: 'Optimized reading experience',
            },
            {
              x: 80,
              y: 30,
              title: 'Sidebar',
              description: 'Dynamic content recommendations',
            },
          ],
        },
        {
          id: '4',
          title: 'Automation Workflow System',
          client: 'Enterprise Corp',
          description:
            'Complex N8N automation workflows connecting multiple business systems.',
          thumbnailUrl: '/media/portfolio/all-projects/project-4/thumbnail.jpg',
          tags: ['N8N Automations'],
          metrics: [
            { label: 'Time Saved', value: '200hrs/month' },
            { label: 'Error Reduction', value: '-95%' },
            { label: 'ROI', value: '450%' },
          ],
          images: [
            '/media/portfolio/all-projects/project-4/thumbnail.jpg',
            '/media/portfolio/all-projects/project-4/detail-1.jpg',
            '/media/portfolio/all-projects/project-4/detail-2.jpg',
          ],
          hotspots: [
            {
              x: 25,
              y: 40,
              title: 'Trigger Nodes',
              description: 'Event-based workflow triggers',
            },
            {
              x: 75,
              y: 60,
              title: 'Integration',
              description: 'Multi-system data sync',
            },
          ],
        },
        {
          id: '5',
          title: 'SEO Campaign Success',
          client: 'Local Business Hub',
          description:
            'Comprehensive SEO strategy with technical optimization and content marketing.',
          thumbnailUrl: '/media/portfolio/all-projects/project-5/thumbnail.jpg',
          tags: ['SEO'],
          metrics: [
            { label: 'Keyword Rankings', value: '#1-3' },
            { label: 'Organic Traffic', value: '+250%' },
            { label: 'Lead Generation', value: '+180%' },
          ],
          images: [
            '/media/portfolio/all-projects/project-5/thumbnail.jpg',
            '/media/portfolio/all-projects/project-5/detail-1.jpg',
            '/media/portfolio/all-projects/project-5/detail-2.jpg',
          ],
          hotspots: [
            {
              x: 50,
              y: 40,
              title: 'Keyword Strategy',
              description: 'Targeted keyword clusters',
            },
            {
              x: 50,
              y: 70,
              title: 'Content Hub',
              description: 'Topic authority building',
            },
          ],
        },
        {
          id: '6',
          title: 'Shopify Store Launch',
          client: 'Fashion Boutique',
          description:
            'Custom Shopify store with advanced product filtering and checkout optimization.',
          thumbnailUrl: '/media/portfolio/all-projects/project-6/thumbnail.jpg',
          tags: ['Shopify', 'Web Design'],
          metrics: [
            { label: 'Conversion Rate', value: '3.8%' },
            { label: 'Average Order', value: '+35%' },
            { label: 'Cart Abandonment', value: '-40%' },
          ],
          images: [
            '/media/portfolio/all-projects/project-6/thumbnail.jpg',
            '/media/portfolio/all-projects/project-6/detail-1.jpg',
            '/media/portfolio/all-projects/project-6/detail-2.jpg',
          ],
          hotspots: [
            {
              x: 30,
              y: 50,
              title: 'Product Page',
              description: 'Enhanced product visualization',
            },
            {
              x: 70,
              y: 50,
              title: 'Checkout',
              description: 'Streamlined checkout flow',
            },
          ],
        },
        {
          id: '7',
          title: 'SaaS Dashboard Design',
          client: 'Analytics Pro',
          description:
            'Modern SaaS dashboard with real-time data visualization and user management.',
          thumbnailUrl: '/media/portfolio/all-projects/project-7/thumbnail.jpg',
          tags: ['Web Design', 'SaaS', 'React'],
          metrics: [
            { label: 'User Engagement', value: '+65%' },
            { label: 'Task Completion', value: '92%' },
            { label: 'Support Tickets', value: '-50%' },
          ],
          images: [
            '/media/portfolio/all-projects/project-7/thumbnail.jpg',
            '/media/portfolio/all-projects/project-7/detail-1.jpg',
            '/media/portfolio/all-projects/project-7/detail-2.jpg',
          ],
          hotspots: [
            {
              x: 20,
              y: 30,
              title: 'Navigation',
              description: 'Intuitive sidebar navigation',
            },
            {
              x: 60,
              y: 50,
              title: 'Analytics',
              description: 'Real-time data charts',
            },
          ],
        },
        {
          id: '8',
          title: 'Mobile App Landing Page',
          client: 'StartupX',
          description:
            'High-converting landing page for mobile app launch with A/B tested elements.',
          thumbnailUrl: '/media/portfolio/all-projects/project-8/thumbnail.jpg',
          tags: ['Web Design', 'SEO'],
          metrics: [
            { label: 'Conversion Rate', value: '12%' },
            { label: 'Bounce Rate', value: '-35%' },
            { label: 'App Downloads', value: '10K+' },
          ],
          images: [
            '/media/portfolio/all-projects/project-8/thumbnail.jpg',
            '/media/portfolio/all-projects/project-8/detail-1.jpg',
            '/media/portfolio/all-projects/project-8/detail-2.jpg',
          ],
          hotspots: [
            {
              x: 50,
              y: 25,
              title: 'Hero Section',
              description: 'Compelling value proposition',
            },
            {
              x: 50,
              y: 75,
              title: 'CTA',
              description: 'Optimized call-to-action buttons',
            },
          ],
        },
      ],
    },
  },
  {
    page: 'portfolio',
    section: 'featuredWork',
    content: {
      eyebrow: 'Featured Work',
      title: 'Our Best',
      titleHighlight: 'Projects',
      subtitle: 'Explore our most impactful work across various industries',
      slides: [
        {
          id: '1',
          title: 'E-Commerce Revolution',
          description:
            'Complete digital transformation for a leading retail brand, resulting in 45% increase in online sales.',
          services: ['Web Design', 'Shopify', 'SEO'],
          type: 'E-Commerce',
          imageUrl: '/media/portfolio/featured-projects/ecommerce-platform.jpg',
        },
        {
          id: '2',
          title: 'AI-Powered Support',
          description:
            'Intelligent chatbot system handling 5,000+ daily customer queries with 95% satisfaction rate.',
          services: ['Chatbot Development', 'N8N Automations'],
          type: 'AI/Automation',
          imageUrl: '/media/portfolio/featured-projects/ai-chatbot.jpg',
        },
        {
          id: '3',
          title: 'Content Platform',
          description:
            'High-performance WordPress blog achieving 120% organic traffic growth in 6 months.',
          services: ['WordPress', 'SEO', 'Web Design'],
          type: 'Content',
          imageUrl: '/media/portfolio/featured-projects/wordpress-blog.jpg',
        },
        {
          id: '4',
          title: 'Workflow Automation',
          description:
            'Enterprise automation system saving 200+ hours monthly through intelligent workflows.',
          services: ['N8N Automations'],
          type: 'Automation',
          imageUrl: '/media/portfolio/featured-projects/n8n-workflow.jpg',
        },
        {
          id: '5',
          title: 'SaaS Dashboard',
          description:
            'Modern analytics dashboard serving 10,000+ daily active users with real-time insights.',
          services: ['Web Design', 'React', 'SaaS'],
          type: 'SaaS',
          imageUrl: '/media/portfolio/featured-projects/saas-dashboard.jpg',
        },
        {
          id: '6',
          title: 'SEO Campaign Success',
          description:
            'Comprehensive SEO strategy achieving #1-3 keyword rankings and 250% organic traffic growth.',
          services: ['SEO', 'Web Design'],
          type: 'SEO',
          imageUrl: '/media/portfolio/featured-projects/seo-campaign.jpg',
        },
      ],
    },
  },
  {
    page: 'portfolio',
    section: 'caseStudies',
    content: {
      eyebrow: 'Case Studies',
      title: 'Success',
      titleHighlight: 'Stories',
      subtitle:
        'Deep dives into our most impactful projects and the results we achieved',
      studies: [
        {
          img: '/media/portfolio/case-studies/ecommerce.jpg',
          title: 'E-Commerce Transformation',
          desc: 'How we helped TechStore Inc. achieve a 45% increase in conversion rates through strategic UX redesign.',
          sliderName: 'ecommerce',
        },
        {
          img: '/media/portfolio/case-studies/ai-chatbot.jpg',
          title: 'AI Chatbot Success',
          desc: 'Building an intelligent support system that handles 5,000+ queries daily with 95% satisfaction.',
          sliderName: 'chatbot',
        },
        {
          img: '/media/portfolio/case-studies/saas-dashboard.jpg',
          title: 'SaaS Dashboard',
          desc: 'Modern analytics dashboard serving 10,000+ daily active users with real-time insights.',
          sliderName: 'saas',
        },
        {
          img: '/media/portfolio/case-studies/workflow-automation.jpg',
          title: 'Automation Excellence',
          desc: 'Enterprise workflow automation saving 200+ hours monthly with 450% ROI.',
          sliderName: 'automation',
        },
      ],
    },
  },
  {
    page: 'portfolio',
    section: 'advantages',
    content: {
      eyebrow: 'Why Choose Us',
      title: 'Our',
      titleHighlight: 'Advantages',
      subtitle:
        'What sets us apart in delivering exceptional digital solutions',
      stats: [
        { value: '500+', label: 'Projects Completed' },
        { value: '98%', label: 'Client Satisfaction' },
        { value: '50+', label: 'Team Experts' },
      ],
      features: [
        {
          title: 'Expert Team',
          description:
            'Our team of seasoned professionals brings years of experience across all digital disciplines.',
          icon: 'Users',
          color: '#2563EB',
        },
        {
          title: 'Cutting-Edge Tech',
          description:
            'We leverage the latest technologies and frameworks to build future-proof solutions.',
          icon: 'Zap',
          color: '#37AFE1',
        },
        {
          title: 'Results-Driven',
          description:
            'Every project is focused on delivering measurable results and ROI for your business.',
          icon: 'TrendingUp',
          color: '#31A4DB',
        },
        {
          title: '24/7 Support',
          description:
            'Round-the-clock support ensures your digital presence is always performing at its best.',
          icon: 'Headphones',
          color: '#F59E0B',
        },
      ],
    },
  },
  {
    page: 'portfolio',
    section: 'cta',
    content: {
      eyebrow: 'Ready to Start?',
      title: "Let's Work",
      titleHighlight: 'Together',
      subtitle: 'Have a project in mind? We would love to hear from you.',
      ctaText: 'Get in Touch',
      ctaLink: '/contact',
    },
  },

  // ==================== SERVICES PAGE ====================
  {
    page: 'services',
    section: 'hero',
    content: {
      eyebrow: 'What We Do',
      title: 'Our',
      titleHighlight: 'Services',
      subtitle:
        'Comprehensive digital solutions to help your business grow and succeed online.',
    },
  },
  {
    page: 'services',
    section: 'list',
    content: {
      // Images: public/media/services/*.jpg
      note: 'Services are managed in the Services section of the dashboard',
    },
  },

  // ==================== CHATBOT DEVELOPMENT SERVICE PAGE ====================
  {
    page: 'services-chatbot',
    section: 'hero',
    content: {
      titleHighlight: 'AI-Powered',
      title: 'Chatbots',
      subtitle:
        'Intelligent conversational AI that connects with your customers 24/7 across all platforms. From WhatsApp to Slack, we build chatbots that convert.',
      ctaText: 'Build Your Chatbot',
      ctaHref: '/contact',
      // Icons are defined in the component as they require React components
    },
  },
  {
    page: 'services-chatbot',
    section: 'video',
    content: {
      eyebrow: 'See AI In Action',
      title: 'Watch How We Build',
      titleHighlight: 'Intelligent Chatbots',
      subtitle:
        'Experience our AI development process and see the conversational bots we create for our clients.',
      videoSrc: '/media/services/chatbot-development/video/hero-video.mp4',
      ctaText: 'Build Your Chatbot',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-chatbot',
    section: 'chatDemo',
    content: {
      eyebrow: 'Interactive Demo',
      title: 'Live Chat',
      titleHighlight: 'Demo',
      subtitle:
        'Experience our AI chatbot in action with this interactive demonstration.',
      // Inner content - Chat interface configuration
      initialMessage: "Hello! I'm an AI assistant. How can I help you today?",
      inputPlaceholder: 'Type your message...',
      sendButtonText: 'Send',
      typingIndicatorText: 'AI is typing...',
      // Sample AI responses
      aiResponses: [
        "That's a great question! Let me help you with that.",
        "I understand. Here's what I can tell you...",
        'Interesting! Based on my analysis...',
        "I'd be happy to assist you with that.",
        'Let me process that information for you.',
      ],
      // Colors
      userMessageColor: '#2563EB',
      aiMessageColor: '#37AFE1',
    },
  },
  {
    page: 'services-chatbot',
    section: 'learningAnimation',
    content: {
      eyebrow: 'Neural Networks',
      title: 'AI Learning',
      titleHighlight: 'Process',
      subtitle:
        'See how our neural networks process and understand your conversations.',
      // Inner content - Neural network layers
      layers: [
        { nodes: 4, label: 'Input', sublabel: 'User Query' },
        { nodes: 6, label: 'Hidden 1', sublabel: 'Understanding' },
        { nodes: 8, label: 'Hidden 2', sublabel: 'Processing' },
        { nodes: 6, label: 'Hidden 3', sublabel: 'Reasoning' },
        { nodes: 4, label: 'Output', sublabel: 'Response' },
      ],
      // Process steps cards
      processSteps: [
        {
          id: 'input',
          title: 'Input Layer',
          description:
            'User messages are tokenized and converted into numerical vectors for processing.',
          color: '#F58122',
        },
        {
          id: 'processing',
          title: 'Hidden Layers',
          description:
            'Multiple neural layers analyze context, intent, and generate intelligent understanding.',
          color: '#37AFE1',
        },
        {
          id: 'output',
          title: 'Output Layer',
          description:
            'Final layer produces natural language responses tailored to user queries.',
          color: '#31A4DB',
        },
      ],
      // Stage labels
      stageLabels: {
        input: 'Receiving Input...',
        processing: 'Processing Data...',
        output: 'Generating Response...',
      },
    },
  },
  {
    page: 'services-chatbot',
    section: 'accuracyChart',
    content: {
      eyebrow: 'Analytics',
      title: 'Performance',
      titleHighlight: 'Improvement',
      subtitle:
        'Track the continuous improvement of your AI chatbot over time.',
      // Inner content - Metrics cards
      metrics: [
        { label: 'Current Accuracy', color: '#37AFE1', suffix: '%' },
        { label: 'Improvement', color: '#F97316', prefix: '+', suffix: '%' },
        { label: 'Training Epochs', color: '#31A4DB', suffix: '' },
        { label: 'Response Time', color: '#2563EB', value: '<100ms' },
      ],
      // Chart configuration
      chartConfig: {
        xAxisLabel: 'Training Epochs',
        yAxisLabel: 'Accuracy (%)',
        lineColor: '#37AFE1',
        gridColor: '#64748B',
      },
    },
  },
  {
    page: 'services-chatbot',
    section: 'caseStudies',
    content: {
      eyebrow: 'AI Chatbot Success Stories',
      title: 'Chatbots That',
      titleHighlight: 'Engage',
      subtitle:
        "See how we've helped businesses automate conversations and delight customers 24/7.",
      studies: [
        {
          img: '/media/services/chatbot-development/case-studies/customer-support-bot.jpg',
          title: 'Customer Support Bot',
          desc: 'AI chatbot handling 5,000+ queries daily with 95% satisfaction rate and 80% faster response.',
          sliderName: 'support',
        },
        {
          img: '/media/services/chatbot-development/case-studies/sales-assistant.jpg',
          title: 'Sales Assistant',
          desc: 'Conversational AI that increased qualified leads by 150% and reduced sales cycle by 30%.',
          sliderName: 'sales',
        },
        {
          img: '/media/services/chatbot-development/case-studies/whatsapp-commerce.jpg',
          title: 'WhatsApp Commerce',
          desc: 'End-to-end shopping experience on WhatsApp with 40% conversion rate improvement.',
          sliderName: 'whatsapp',
        },
        {
          img: '/media/services/chatbot-development/case-studies/internal-knowledge-bot.jpg',
          title: 'Internal Knowledge Bot',
          desc: 'Enterprise chatbot reducing HR queries by 70% and improving employee onboarding.',
          sliderName: 'internal',
        },
      ],
    },
  },
  {
    page: 'services-chatbot',
    section: 'cta',
    content: {
      title: 'Ready to Build Your AI Chatbot?',
      subtitle:
        "Let's create an intelligent chatbot that engages your customers 24/7",
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-chatbot',
    section: 'techStack',
    content: {
      eyebrow: '✨ Our Tech Stack',
      title: 'Build Your',
      titleHighlight: 'Digital Empire',
      subtitle:
        'We leverage cutting-edge technologies to deliver scalable, high-performance solutions that drive your business forward.',
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
      secondaryCtaText: 'View Our Work',
      secondaryCtaHref: '/portfolio',
    },
  },

  // ==================== SEO SERVICE PAGE ====================
  {
    page: 'services-seo',
    section: 'hero',
    content: {
      title: 'Dominate Search',
      highlightedText: 'Drive Organic Growth',
      subtitle:
        'Strategic SEO solutions that boost your rankings, increase organic traffic, and convert visitors into customers. Data-driven optimization for measurable results.',
      ctaButton: {
        label: 'Get SEO Audit',
        href: '/contact',
      },
      floatingIcons: [
        {
          icon: 'Search',
          label: 'Keywords',
          position: { x: '8%', y: '25%' },
          color: '#37AFE1',
        },
        {
          icon: 'TrendingUp',
          label: 'Rankings',
          position: { x: '12%', y: '60%' },
          color: '#37AFE1',
        },
        {
          icon: 'Target',
          label: 'Traffic',
          position: { x: '82%', y: '20%' },
          color: '#F58122',
        },
        {
          icon: 'BarChart3',
          label: 'Analytics',
          position: { x: '78%', y: '55%' },
          color: '#F58122',
        },
      ],
    },
  },
  {
    page: 'services-seo',
    section: 'video',
    content: {
      eyebrow: 'See SEO In Action',
      title: 'Watch How We Drive',
      titleHighlight: 'Organic Growth',
      subtitle:
        'Experience our SEO process and see the ranking improvements we achieve for our clients.',
      videoSrc: '/media/services/seo/video/hero-video.mp4',
      ctaText: 'Start Your SEO Journey',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-seo',
    section: 'serpRanking',
    content: {
      eyebrow: 'SERP Tracking',
      title: 'Search Engine',
      titleHighlight: 'Rankings',
      subtitle:
        'Watch your keywords climb from page 2 to the top of search results.',
      keywords: [
        {
          keyword: 'Web Design Agency',
          startPosition: 10,
          endPosition: 1,
          color: '#31A4DB',
        },
        {
          keyword: 'Custom Chatbots',
          startPosition: 8,
          endPosition: 2,
          color: '#31A4DB',
        },
        {
          keyword: 'N8N Automation',
          startPosition: 12,
          endPosition: 3,
          color: '#31A4DB',
        },
        {
          keyword: 'Shopify Development',
          startPosition: 15,
          endPosition: 4,
          color: '#31A4DB',
        },
        {
          keyword: 'WordPress Solutions',
          startPosition: 9,
          endPosition: 5,
          color: '#31A4DB',
        },
      ],
      competitors: [
        { position: 6, name: 'Competitor A' },
        { position: 7, name: 'Competitor B' },
        { position: 8, name: 'Competitor C' },
      ],
      yourRankingsLabel: 'Your Rankings',
      competitorsLabel: 'Competitors',
      siteDomain: 'risingdot.agency',
    },
  },
  {
    page: 'services-seo',
    section: 'keywordCloud',
    content: {
      eyebrow: 'Keyword Strategy',
      title: 'Strategic Keyword',
      titleHighlight: 'Targeting',
      subtitle:
        'Explore our comprehensive keyword strategy tailored to your business.',
      keywords: [
        { text: 'Web Design', importance: 10, category: 'design' },
        { text: 'SEO', importance: 9, category: 'marketing' },
        { text: 'Chatbot', importance: 8, category: 'ai' },
        { text: 'Automation', importance: 8, category: 'automation' },
        { text: 'E-commerce', importance: 7, category: 'ecommerce' },
        { text: 'WordPress', importance: 7, category: 'cms' },
        { text: 'Shopify', importance: 7, category: 'ecommerce' },
        { text: 'N8N', importance: 6, category: 'automation' },
        { text: 'AI', importance: 6, category: 'ai' },
        { text: 'Conversion', importance: 6, category: 'marketing' },
      ],
      categories: [
        { id: 'all', name: 'All Keywords', color: '#2563EB' },
        { id: 'design', name: 'Design', color: '#F97316' },
        { id: 'marketing', name: 'Marketing', color: '#31A4DB' },
        { id: 'ai', name: 'AI', color: '#2563EB' },
        { id: 'automation', name: 'Automation', color: '#F97316' },
        { id: 'ecommerce', name: 'E-commerce', color: '#F59E0B' },
        { id: 'cms', name: 'CMS', color: '#EF4444' },
        { id: 'technical', name: 'Technical', color: '#64748B' },
      ],
      totalKeywordsLabel: 'Total Keywords',
      avgImportanceLabel: 'Avg Importance',
      categoriesLabel: 'Categories',
    },
  },
  {
    page: 'services-seo',
    section: 'trafficGrowth',
    content: {
      eyebrow: 'Growth Metrics',
      title: 'Organic Traffic',
      titleHighlight: 'Growth',
      subtitle:
        'See the exponential growth in organic traffic and conversions.',
      data: [
        { month: 'Jan', traffic: 1200, conversions: 24 },
        { month: 'Feb', traffic: 1800, conversions: 36 },
        { month: 'Mar', traffic: 2500, conversions: 50 },
        { month: 'Apr', traffic: 3200, conversions: 64 },
        { month: 'May', traffic: 4100, conversions: 82 },
        { month: 'Jun', traffic: 5300, conversions: 106 },
        { month: 'Jul', traffic: 6800, conversions: 136 },
        { month: 'Aug', traffic: 8500, conversions: 170 },
        { month: 'Sep', traffic: 10200, conversions: 204 },
        { month: 'Oct', traffic: 12500, conversions: 250 },
        { month: 'Nov', traffic: 15000, conversions: 300 },
        { month: 'Dec', traffic: 18000, conversions: 360 },
      ],
      milestones: [
        { index: 2, label: '2.5K Visitors', icon: '🎯' },
        { index: 5, label: '5K Visitors', icon: '🚀' },
        { index: 8, label: '10K Visitors', icon: '⭐' },
        { index: 11, label: '18K Visitors', icon: '🎉' },
      ],
      totalGrowthLabel: 'Total Growth',
      monthlyVisitorsLabel: 'Monthly Visitors',
      conversionsLabel: 'Conversions',
      conversionRateLabel: 'Conversion Rate',
    },
  },
  {
    page: 'services-seo',
    section: 'competitorAnalysis',
    content: {
      eyebrow: 'Market Analysis',
      title: 'Competitive',
      titleHighlight: 'Advantage',
      subtitle: 'Outrank your competitors and capture more market share.',
      yourSite: {
        name: 'Rising Dot',
        rank: 1,
        traffic: 18000,
        keywords: 250,
        backlinks: 1200,
        color: '#31A4DB',
      },
      competitors: [
        {
          name: 'Competitor A',
          rank: 2,
          traffic: 15000,
          keywords: 220,
          backlinks: 980,
          color: '#F59E0B',
        },
        {
          name: 'Competitor B',
          rank: 3,
          traffic: 12000,
          keywords: 180,
          backlinks: 850,
          color: '#F59E0B',
        },
        {
          name: 'Competitor C',
          rank: 4,
          traffic: 9500,
          keywords: 150,
          backlinks: 720,
          color: '#F59E0B',
        },
        {
          name: 'Competitor D',
          rank: 5,
          traffic: 7200,
          keywords: 120,
          backlinks: 580,
          color: '#F59E0B',
        },
      ],
      monthlyTrafficLabel: 'Monthly Traffic',
      rankingKeywordsLabel: 'Ranking Keywords',
      qualityBacklinksLabel: 'Quality Backlinks',
    },
  },
  {
    page: 'services-seo',
    section: 'caseStudies',
    content: {
      eyebrow: 'SEO Success Stories',
      title: 'Rankings That',
      titleHighlight: 'Dominate',
      subtitle:
        "See how we've helped businesses climb to the top of search results and drive organic growth.",
      studies: [
        {
          img: '/media/services/seo/case-studies/local-business.jpg',
          title: 'Local Business SEO',
          desc: 'From page 5 to #1 rankings with 250% increase in organic traffic and 180% more leads.',
          sliderName: 'local',
        },
        {
          img: '/media/services/seo/case-studies/ecommerce-seo.jpg',
          title: 'E-Commerce SEO',
          desc: 'Product page optimization resulting in 300% revenue growth from organic search.',
          sliderName: 'ecommerce',
        },
        {
          img: '/media/services/seo/case-studies/technical-seo.jpg',
          title: 'Technical SEO Audit',
          desc: 'Site-wide technical fixes improving Core Web Vitals and 40% faster indexing.',
          sliderName: 'technical',
        },
        {
          img: '/media/services/seo/case-studies/content-strategy.jpg',
          title: 'Content Strategy',
          desc: 'Topic cluster approach generating 500+ ranking keywords and 10x organic visibility.',
          sliderName: 'content',
        },
      ],
    },
  },
  {
    page: 'services-seo',
    section: 'cta',
    content: {
      title: 'Ready to Dominate Search Results?',
      subtitle:
        "Let's create an SEO strategy that drives real business results",
      ctaText: 'Start Your SEO Journey',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-seo',
    section: 'techStack',
    content: {
      eyebrow: '✨ Our Tech Stack',
      title: 'Build Your',
      titleHighlight: 'Digital Empire',
      subtitle:
        'We leverage cutting-edge technologies to deliver scalable, high-performance solutions that drive your business forward.',
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
      secondaryCtaText: 'View Our Work',
      secondaryCtaHref: '/portfolio',
    },
  },

  // ==================== SHOPIFY SERVICE PAGE ====================
  {
    page: 'services-shopify',
    section: 'hero',
    content: {
      eyebrow: 'E-Commerce Excellence',
      title: 'Build Your Shopify Empire with Expert Development',
      highlightedWord: 'Shopify',
      highlightedWord2: 'Expert',
      subtitle:
        'High-converting online stores that drive sales and delight customers. From custom themes to seamless integrations, we build e-commerce experiences that scale.',
      services: [
        {
          id: 'custom-themes',
          name: 'Custom Themes',
          url: '/portfolio?category=shopify-themes',
          description: 'Unique store designs that stand out',
          imgSrc: '/media/services/shopify/services/custom-themes.jpg',
        },
        {
          id: 'store-setup',
          name: 'Store Setup',
          url: '/portfolio?category=shopify-setup',
          description: 'Complete Shopify store configuration',
          imgSrc: '/media/services/shopify/services/store-setup.jpg',
        },
        {
          id: 'app-integration',
          name: 'App Integration',
          url: '/portfolio?category=shopify-apps',
          description: 'Seamless third-party integrations',
          imgSrc: '/media/services/shopify/services/app-integration.jpg',
        },
        {
          id: 'conversion-optimization',
          name: 'Conversion Optimization',
          url: '/portfolio?category=shopify-cro',
          description: 'Boost your sales with proven strategies',
          imgSrc:
            '/media/services/shopify/services/conversion-optimization.jpg',
        },
        {
          id: 'payment-setup',
          name: 'Payment Setup',
          url: '/portfolio?category=shopify-payments',
          description: 'Secure payment gateway integration',
          imgSrc: '/media/services/shopify/services/payment-setup.jpg',
        },
        {
          id: 'migration',
          name: 'Store Migration',
          url: '/portfolio?category=shopify-migration',
          description: 'Seamless migration from any platform',
          imgSrc: '/media/services/shopify/services/migration.jpg',
        },
      ],
      ctaLabel: 'Start Your Store',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-shopify',
    section: 'video',
    content: {
      eyebrow: 'See Shopify In Action',
      title: 'Watch How We Build',
      titleHighlight: 'E-Commerce Stores',
      subtitle:
        'Experience our development process and see the high-converting Shopify stores we create for our clients.',
      videoSrc: '/media/services/shopify/video/hero-video.mp4',
      ctaText: 'Start Your Shopify Store',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-shopify',
    section: 'conversionFunnel',
    content: {
      eyebrow: 'Sales Analytics',
      title: 'Conversion Funnel',
      titleHighlight: 'Visualization',
      subtitle:
        'Watch how customers flow through your sales funnel with real-time particle visualization.',
      stages: [
        { name: 'Visitors', percentage: 100, color: '#2563EB' },
        { name: 'Product Views', percentage: 65, color: '#F97316' },
        { name: 'Add to Cart', percentage: 35, color: '#2563EB' },
        { name: 'Checkout', percentage: 20, color: '#F97316' },
        { name: 'Purchase', percentage: 15, color: '#31A4DB' },
      ],
      conversionLabel: 'Conversions',
      abandonmentLabel: 'Abandonment',
    },
  },
  {
    page: 'services-shopify',
    section: 'productPreview',
    content: {
      eyebrow: 'Product Display',
      title: 'Interactive 3D',
      titleHighlight: 'Product Preview',
      subtitle:
        'Give customers an immersive product experience with 3D rotation and color customization.',
      colorSwatches: [
        { name: 'Midnight Black', color: '#1E293B', image: 'black' },
        { name: 'Ocean Blue', color: '#2563EB', image: 'blue' },
        { name: 'Sunset Orange', color: '#F97316', image: 'orange' },
        { name: 'Forest Green', color: '#31A4DB', image: 'green' },
      ],
      productLabel: 'SHOP',
      addToCartText: 'Add to Cart',
      dragHint: 'Drag to rotate',
      scrollHint: 'Scroll to zoom',
    },
  },
  {
    page: 'services-shopify',
    section: 'dashboard',
    content: {
      eyebrow: 'Analytics',
      title: 'Real-Time Performance',
      titleHighlight: 'Dashboard',
      subtitle:
        "Track your store's performance with live metrics and animated visualizations.",
      metrics: [
        { label: 'Revenue', target: 125000, unit: '$', color: '#31A4DB' },
        { label: 'Orders', target: 1250, unit: '', color: '#2563EB' },
        { label: 'Conversion Rate', target: 3.8, unit: '%', color: '#F97316' },
        { label: 'Avg Order Value', target: 98, unit: '$', color: '#F59E0B' },
      ],
      chartTitle: 'Revenue Trend',
      liveDataLabel: 'Live Data',
      monthLabels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
  },
  {
    page: 'services-shopify',
    section: 'mobileExperience',
    content: {
      eyebrow: 'Mobile First',
      title: 'Mobile Shopping',
      titleHighlight: 'Experience',
      subtitle: 'Deliver a seamless mobile shopping experience that converts.',
      products: [
        { id: 1, name: 'Premium Headphones', price: 299, image: '🎧' },
        { id: 2, name: 'Smart Watch', price: 399, image: '⌚' },
        { id: 3, name: 'Wireless Earbuds', price: 199, image: '🎵' },
      ],
      features: [
        {
          icon: '⚡',
          title: 'Lightning Fast',
          desc: 'Optimized for mobile performance',
        },
        {
          icon: '👆',
          title: 'Touch Optimized',
          desc: 'Intuitive gestures and interactions',
        },
        {
          icon: '🎨',
          title: 'Beautiful Design',
          desc: 'Stunning visuals on any screen',
        },
        {
          icon: '🔒',
          title: 'Secure Checkout',
          desc: 'Safe and encrypted transactions',
        },
      ],
      shopTitle: 'Shop',
      shopSubtitle: 'Discover amazing products',
      checkoutText: 'Checkout',
      continueShoppingText: 'Continue Shopping',
      addedToCartText: 'Added to Cart!',
      featuresTitle: 'Mobile-First Experience',
    },
  },
  {
    page: 'services-shopify',
    section: 'caseStudies',
    content: {
      eyebrow: 'E-Commerce Success Stories',
      title: 'Shopify Stores That',
      titleHighlight: 'Convert',
      subtitle:
        "See how we've helped businesses build high-converting Shopify stores that drive sales.",
      studies: [
        {
          img: '/media/services/shopify/case-studies/fashion-boutique.jpg',
          title: 'Fashion Boutique',
          desc: 'Custom Shopify store with 3.8% conversion rate and 35% increase in average order value.',
          sliderName: 'fashion',
        },
        {
          img: '/media/services/shopify/case-studies/electronics-store.jpg',
          title: 'Electronics Store',
          desc: 'High-volume e-commerce with advanced filtering and 40% reduction in cart abandonment.',
          sliderName: 'electronics',
        },
        {
          img: '/media/services/shopify/case-studies/subscription-box.jpg',
          title: 'Subscription Box',
          desc: 'Recurring revenue model with seamless subscription management and 95% retention rate.',
          sliderName: 'subscription',
        },
        {
          img: '/media/services/shopify/case-studies/marketplace.jpg',
          title: 'Multi-vendor Marketplace',
          desc: 'Platform migration with 200+ vendors and zero downtime during transition.',
          sliderName: 'marketplace',
        },
      ],
    },
  },
  {
    page: 'services-shopify',
    section: 'cta',
    content: {
      title: 'Ready to Launch Your Online Store?',
      subtitle:
        "Let's build a Shopify store that turns visitors into loyal customers",
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-shopify',
    section: 'techStack',
    content: {
      eyebrow: '✨ Our Tech Stack',
      title: 'Build Your',
      titleHighlight: 'Digital Empire',
      subtitle:
        'We leverage cutting-edge technologies to deliver scalable, high-performance solutions that drive your business forward.',
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
      secondaryCtaText: 'View Our Work',
      secondaryCtaHref: '/portfolio',
    },
  },

  // ==================== WORDPRESS SERVICE PAGE ====================
  {
    page: 'services-wordpress',
    section: 'hero',
    content: {
      eyebrow: 'WordPress Experts',
      title: 'Build Scalable WordPress Solutions with Modular Architecture',
      highlightedWord: 'WordPress',
      highlightedWord2: 'Modular',
      subtitle:
        'Scalable, modular WordPress solutions that grow with your business. From custom themes to powerful plugins, we build websites that perform.',
      services: [
        {
          id: 'custom-themes',
          name: 'Custom Themes',
          url: '/portfolio?category=wordpress-themes',
          description: 'Bespoke WordPress themes tailored to your brand',
          imgSrc: '/media/services/wordpress/services/custom-themes.jpg',
        },
        {
          id: 'plugin-development',
          name: 'Plugin Development',
          url: '/portfolio?category=wordpress-plugins',
          description: 'Custom plugins for unique functionality',
          imgSrc: '/media/services/wordpress/services/plugin-development.jpg',
        },
        {
          id: 'woocommerce',
          name: 'WooCommerce',
          url: '/portfolio?category=woocommerce',
          description: 'Powerful e-commerce solutions',
          imgSrc: '/media/services/wordpress/services/woocommerce.jpg',
        },
        {
          id: 'speed-optimization',
          name: 'Speed Optimization',
          url: '/portfolio?category=wordpress-speed',
          description: 'Lightning-fast loading times',
          imgSrc: '/media/services/wordpress/services/speed-optimization.jpg',
        },
        {
          id: 'security',
          name: 'Security Hardening',
          url: '/portfolio?category=wordpress-security',
          description: 'Protect your site from threats',
          imgSrc: '/media/services/wordpress/services/security.jpg',
        },
        {
          id: 'maintenance',
          name: 'Maintenance Plans',
          url: '/portfolio?category=wordpress-maintenance',
          description: 'Keep your site running smoothly',
          imgSrc: '/media/services/wordpress/services/maintenance.jpg',
        },
      ],
      ctaLabel: 'Start Your Project',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-wordpress',
    section: 'video',
    content: {
      eyebrow: 'See WordPress In Action',
      title: 'Watch How We Build',
      titleHighlight: 'WordPress Sites',
      subtitle:
        'Experience our development process and see the powerful WordPress solutions we create for our clients.',
      videoSrc: '/media/services/wordpress/video/hero-video.mp4',
      ctaText: 'Start Your WordPress Project',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-wordpress',
    section: 'modularGrid',
    content: {
      eyebrow: 'Architecture',
      title: 'Modular Component',
      titleHighlight: 'System',
      subtitle:
        'Watch how WordPress components snap together like puzzle pieces to create powerful websites.',
      modules: [
        {
          id: 'header',
          title: 'Header',
          icon: '📋',
          color: '#2563EB',
          position: { row: 0, col: 0 },
        },
        {
          id: 'hero',
          title: 'Hero Section',
          icon: '🎯',
          color: '#F97316',
          position: { row: 0, col: 1 },
        },
        {
          id: 'nav',
          title: 'Navigation',
          icon: '🧭',
          color: '#2563EB',
          position: { row: 0, col: 2 },
        },
        {
          id: 'search',
          title: 'Search',
          icon: '🔍',
          color: '#F97316',
          position: { row: 0, col: 3 },
        },
        {
          id: 'content',
          title: 'Content Block',
          icon: '📝',
          color: '#F97316',
          position: { row: 1, col: 0 },
        },
        {
          id: 'sidebar',
          title: 'Sidebar',
          icon: '📊',
          color: '#2563EB',
          position: { row: 1, col: 1 },
        },
        {
          id: 'gallery',
          title: 'Gallery',
          icon: '🖼️',
          color: '#F97316',
          position: { row: 1, col: 2 },
        },
        {
          id: 'forms',
          title: 'Forms',
          icon: '📋',
          color: '#2563EB',
          position: { row: 1, col: 3 },
        },
        {
          id: 'testimonials',
          title: 'Testimonials',
          icon: '💬',
          color: '#2563EB',
          position: { row: 2, col: 0 },
        },
        {
          id: 'cta',
          title: 'Call to Action',
          icon: '🎯',
          color: '#F97316',
          position: { row: 2, col: 1 },
        },
        {
          id: 'footer',
          title: 'Footer',
          icon: '📌',
          color: '#2563EB',
          position: { row: 2, col: 2 },
        },
        {
          id: 'social',
          title: 'Social Links',
          icon: '🔗',
          color: '#F97316',
          position: { row: 2, col: 3 },
        },
      ],
      successMessage: '✨ Modular components assembled successfully!',
    },
  },
  {
    page: 'services-wordpress',
    section: 'metrics',
    content: {
      eyebrow: 'Analytics',
      title: 'Performance That',
      titleHighlight: 'Matters',
      subtitle:
        'See the dramatic improvements our WordPress optimization delivers.',
      metrics: [
        {
          label: 'Loading Speed',
          before: 4.2,
          after: 1.3,
          unit: 's',
          format: 'number',
          inverse: true,
        },
        {
          label: 'SEO Score',
          before: 72,
          after: 96,
          unit: '/100',
          format: 'score',
        },
        {
          label: 'Accessibility',
          before: 68,
          after: 94,
          unit: '/100',
          format: 'score',
        },
        {
          label: 'Conversion Rate',
          before: 2.1,
          after: 4.8,
          unit: '%',
          format: 'percentage',
        },
      ],
    },
  },
  {
    page: 'services-wordpress',
    section: 'pluginConstellation',
    content: {
      eyebrow: 'Integrations',
      title: 'Plugin',
      titleHighlight: 'Ecosystem',
      subtitle:
        'Explore our curated selection of WordPress plugins and their relationships.',
      // Plugins with better spacing to prevent overlapping
      plugins: [
        // Security plugins - top left area
        {
          id: 'wordfence',
          name: 'Wordfence',
          category: 'security',
          x: 12,
          y: 15,
          relatedTo: ['jetpack', 'ithemes'],
        },
        {
          id: 'ithemes',
          name: 'iThemes Security',
          category: 'security',
          x: 8,
          y: 32,
          relatedTo: ['wordfence', 'sucuri'],
        },
        {
          id: 'sucuri',
          name: 'Sucuri',
          category: 'security',
          x: 18,
          y: 45,
          relatedTo: ['ithemes', 'wordfence'],
        },
        // Performance plugins - top center area
        {
          id: 'wp-rocket',
          name: 'WP Rocket',
          category: 'performance',
          x: 38,
          y: 12,
          relatedTo: ['autoptimize', 'smush'],
        },
        {
          id: 'autoptimize',
          name: 'Autoptimize',
          category: 'performance',
          x: 48,
          y: 25,
          relatedTo: ['wp-rocket', 'smush'],
        },
        {
          id: 'smush',
          name: 'Smush',
          category: 'performance',
          x: 58,
          y: 15,
          relatedTo: ['wp-rocket', 'autoptimize', 'imagify'],
        },
        {
          id: 'imagify',
          name: 'Imagify',
          category: 'performance',
          x: 68,
          y: 28,
          relatedTo: ['smush'],
        },
        // SEO plugins - top right area
        {
          id: 'yoast',
          name: 'Yoast SEO',
          category: 'seo',
          x: 78,
          y: 18,
          relatedTo: ['rank-math', 'aioseo'],
        },
        {
          id: 'rank-math',
          name: 'Rank Math',
          category: 'seo',
          x: 88,
          y: 32,
          relatedTo: ['yoast', 'aioseo'],
        },
        {
          id: 'aioseo',
          name: 'All in One SEO',
          category: 'seo',
          x: 82,
          y: 48,
          relatedTo: ['yoast', 'rank-math'],
        },
        // E-commerce plugins - bottom left area
        {
          id: 'woocommerce',
          name: 'WooCommerce',
          category: 'ecommerce',
          x: 28,
          y: 62,
          relatedTo: ['stripe', 'paypal', 'mailchimp'],
        },
        {
          id: 'stripe',
          name: 'Stripe',
          category: 'ecommerce',
          x: 38,
          y: 78,
          relatedTo: ['woocommerce', 'paypal'],
        },
        {
          id: 'paypal',
          name: 'PayPal',
          category: 'ecommerce',
          x: 22,
          y: 82,
          relatedTo: ['woocommerce', 'stripe'],
        },
        // Content plugins - center area
        {
          id: 'elementor',
          name: 'Elementor',
          category: 'content',
          x: 15,
          y: 68,
          relatedTo: ['acf', 'gutenberg'],
        },
        {
          id: 'acf',
          name: 'ACF',
          category: 'content',
          x: 8,
          y: 52,
          relatedTo: ['elementor', 'wpbakery'],
        },
        {
          id: 'gutenberg',
          name: 'Gutenberg',
          category: 'content',
          x: 32,
          y: 88,
          relatedTo: ['elementor'],
        },
        {
          id: 'wpbakery',
          name: 'WPBakery',
          category: 'content',
          x: 5,
          y: 75,
          relatedTo: ['acf', 'elementor'],
        },
        // Analytics plugins - right side
        {
          id: 'monsterinsights',
          name: 'MonsterInsights',
          category: 'analytics',
          x: 72,
          y: 62,
          relatedTo: ['google-analytics', 'jetpack'],
        },
        {
          id: 'google-analytics',
          name: 'GA Dashboard',
          category: 'analytics',
          x: 85,
          y: 72,
          relatedTo: ['monsterinsights'],
        },
        // Utility plugins - scattered
        {
          id: 'jetpack',
          name: 'Jetpack',
          category: 'utility',
          x: 55,
          y: 52,
          relatedTo: ['wordfence', 'mailchimp', 'monsterinsights'],
        },
        {
          id: 'mailchimp',
          name: 'Mailchimp',
          category: 'utility',
          x: 48,
          y: 42,
          relatedTo: ['woocommerce', 'jetpack'],
        },
        {
          id: 'contact-form-7',
          name: 'Contact Form 7',
          category: 'utility',
          x: 62,
          y: 38,
          relatedTo: ['mailchimp'],
        },
        // Backup plugins
        {
          id: 'updraftplus',
          name: 'UpdraftPlus',
          category: 'backup',
          x: 75,
          y: 85,
          relatedTo: ['jetpack'],
        },
        {
          id: 'duplicator',
          name: 'Duplicator',
          category: 'backup',
          x: 88,
          y: 58,
          relatedTo: ['updraftplus'],
        },
      ],
      // More categories with distinct colors
      categoryColors: [
        { category: 'security', color: '#EF4444' },
        { category: 'performance', color: '#2563EB' },
        { category: 'seo', color: '#31A4DB' },
        { category: 'ecommerce', color: '#F59E0B' },
        { category: 'content', color: '#F97316' },
        { category: 'analytics', color: '#37AFE1' },
        { category: 'utility', color: '#64748B' },
        { category: 'backup', color: '#22C55E' },
      ],
      legendTitle: 'Plugin Categories',
      instructionText: 'over plugins to see related connections',
    },
  },
  {
    page: 'services-wordpress',
    section: 'caseStudies',
    content: {
      eyebrow: 'WordPress Success Stories',
      title: 'WordPress Projects That',
      titleHighlight: 'Deliver',
      subtitle:
        "See how we've helped businesses build powerful WordPress solutions that drive results.",
      studies: [
        {
          img: '/media/services/wordpress/case-studies/blog-platform.jpg',
          title: 'Blog Platform',
          desc: 'High-performance WordPress blog with 120% increase in organic traffic and 98/100 SEO score.',
          sliderName: 'blog',
        },
        {
          img: '/media/services/wordpress/case-studies/woocommerce-store.jpg',
          title: 'WooCommerce Store',
          desc: 'Custom WooCommerce solution with 45% conversion rate improvement and optimized checkout.',
          sliderName: 'woocommerce',
        },
        {
          img: '/media/services/wordpress/case-studies/corporate-site.jpg',
          title: 'Corporate Site',
          desc: 'Enterprise WordPress site with custom plugins and 1.2s load time optimization.',
          sliderName: 'corporate',
        },
        {
          img: '/media/services/wordpress/case-studies/membership-portal.jpg',
          title: 'Membership Portal',
          desc: 'Secure membership site with custom user roles and protected content management.',
          sliderName: 'membership',
        },
      ],
    },
  },
  {
    page: 'services-wordpress',
    section: 'cta',
    content: {
      title: 'Ready to Build Your WordPress Site?',
      subtitle:
        "Let's create a scalable, high-performance WordPress solution tailored to your needs",
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-wordpress',
    section: 'techStack',
    content: {
      eyebrow: '✨ Our Tech Stack',
      title: 'Build Your',
      titleHighlight: 'Digital Empire',
      subtitle:
        'We leverage cutting-edge technologies to deliver scalable, high-performance solutions that drive your business forward.',
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
      secondaryCtaText: 'View Our Work',
      secondaryCtaHref: '/portfolio',
    },
  },

  // ==================== WEB DESIGN SERVICE PAGE ====================
  {
    page: 'services-webdesign',
    section: 'hero',
    content: {
      eyebrow: 'Creative Design Solutions',
      title: 'Build Stunning Websites with Premium Quality Design',
      highlightedWord: 'Premium',
      highlightedWord2: 'Design',
      subtitle:
        'We craft beautiful, functional websites that captivate your audience and convert visitors into customers. From wireframes to stunning final designs.',
      services: [
        {
          id: 'landing-pages',
          name: 'Landing Pages',
          url: '/portfolio?category=landing',
          description: 'High-converting landing pages that capture leads',
          imgSrc: '/media/services/web-design/services/landing-pages.jpg',
        },
        {
          id: 'corporate-websites',
          name: 'Corporate Websites',
          url: '/portfolio?category=corporate',
          description: 'Professional websites for established businesses',
          imgSrc: '/media/services/web-design/services/corporate-websites.jpg',
        },
        {
          id: 'portfolio-sites',
          name: 'Portfolio Sites',
          url: '/portfolio?category=portfolio',
          description: 'Showcase your work with stunning portfolios',
          imgSrc: '/media/services/web-design/services/portfolio-sites.jpg',
        },
        {
          id: 'ui-ux-design',
          name: 'UI/UX Design',
          url: '/portfolio?category=uiux',
          description: 'User-centered design that delights',
          imgSrc: '/media/services/web-design/services/ui-ux-design.jpg',
        },
        {
          id: 'responsive-design',
          name: 'Responsive Design',
          url: '/portfolio?category=responsive',
          description: 'Pixel-perfect on every device',
          imgSrc: '/media/services/web-design/services/responsive-design.jpg',
        },
        {
          id: 'brand-identity',
          name: 'Brand Identity',
          url: '/portfolio?category=branding',
          description: 'Complete visual identity systems',
          imgSrc: '/media/services/web-design/services/brand-identity.jpg',
        },
      ],
      ctaLabel: 'Start Your Project',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-webdesign',
    section: 'video',
    content: {
      eyebrow: 'See Design In Action',
      title: 'Watch How We Create',
      titleHighlight: 'Stunning Designs',
      subtitle:
        'Experience our creative process and see the beautiful, functional designs we craft for our clients.',
      videoSrc: '/media/services/web-design/video/hero-video.mp4',
      ctaText: 'Start Your Design Project',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-webdesign',
    section: 'wireframeMorph',
    content: {
      eyebrow: 'Transformation',
      title: 'Watch Design',
      titleHighlight: 'Come to Life',
      subtitle:
        'See how we transform simple wireframes into beautiful, functional designs.',
      logoText: 'Logo',
      navItems: ['Home', 'About', 'Services', 'Contact'],
      heroTitle: 'Beautiful Design',
      heroSubtitle: 'Crafted with precision',
    },
  },
  {
    page: 'services-webdesign',
    section: 'designTimeline',
    content: {
      eyebrow: 'Methodology',
      title: 'Our Design',
      titleHighlight: 'Process',
      subtitle: 'Explore each phase of our comprehensive design methodology.',
      phases: [
        {
          id: 'discovery',
          name: 'Discovery',
          description: 'Research & Strategy',
          color: '#64748B',
          position: 0,
          cards: [
            {
              title: 'User Research',
              description: 'Understanding your target audience',
            },
            {
              title: 'Competitor Analysis',
              description: 'Market positioning insights',
            },
            {
              title: 'Goal Definition',
              description: 'Clear objectives & KPIs',
            },
          ],
        },
        {
          id: 'wireframe',
          name: 'Wireframe',
          description: 'Structure & Layout',
          color: '#2563EB',
          position: 25,
          cards: [
            {
              title: 'Information Architecture',
              description: 'Content organization',
            },
            { title: 'User Flows', description: 'Navigation pathways' },
            { title: 'Low-Fi Mockups', description: 'Basic layout structure' },
          ],
        },
        {
          id: 'design',
          name: 'Design',
          description: 'Visual Identity',
          color: '#37AFE1',
          position: 50,
          cards: [
            {
              title: 'Visual Design',
              description: 'Colors, typography & imagery',
            },
            {
              title: 'UI Components',
              description: 'Buttons, forms & elements',
            },
            {
              title: 'Responsive Layouts',
              description: 'Multi-device optimization',
            },
          ],
        },
        {
          id: 'development',
          name: 'Development',
          description: 'Build & Test',
          color: '#F97316',
          position: 75,
          cards: [
            { title: 'Frontend Code', description: 'HTML, CSS & JavaScript' },
            {
              title: 'CMS Integration',
              description: 'Content management setup',
            },
            { title: 'Quality Assurance', description: 'Testing & bug fixes' },
          ],
        },
        {
          id: 'launch',
          name: 'Launch',
          description: 'Deploy & Monitor',
          color: '#31A4DB',
          position: 100,
          cards: [
            { title: 'Deployment', description: 'Go live on production' },
            { title: 'Performance', description: 'Speed optimization' },
            { title: 'Analytics', description: 'Tracking & insights' },
          ],
        },
      ],
    },
  },
  {
    page: 'services-webdesign',
    section: 'styleShowcase',
    content: {
      eyebrow: 'Branding',
      title: 'Customize Your',
      titleHighlight: 'Brand',
      subtitle:
        'Experiment with colors and typography to find your perfect style.',
      featureCards: [
        { title: 'Feature 1', description: 'Description text' },
        { title: 'Feature 2', description: 'Description text' },
        { title: 'Feature 3', description: 'Description text' },
      ],
      brandTitle: 'Your Brand Title',
      brandDescription:
        'This is how your content will look with the selected style. The typography and colors update in real-time to give you an instant preview of your design choices.',
      ctaText: 'Call to Action',
      // Color schemes - editable from dashboard
      colorSchemes: [
        {
          name: 'Ocean',
          primary: '#2563EB',
          secondary: '#37AFE1',
          accent: '#31A4DB',
        },
        {
          name: 'Sunset',
          primary: '#F97316',
          secondary: '#F58122',
          accent: '#F59E0B',
        },
        {
          name: 'Sky',
          primary: '#37AFE1',
          secondary: '#31A4DB',
          accent: '#2563EB',
        },
        {
          name: 'Fire',
          primary: '#F58122',
          secondary: '#F97316',
          accent: '#F59E0B',
        },
        {
          name: 'Midnight',
          primary: '#1E3A8A',
          secondary: '#3B82F6',
          accent: '#60A5FA',
        },
        {
          name: 'Coral',
          primary: '#F97316',
          secondary: '#FB923C',
          accent: '#FDBA74',
        },
        {
          name: 'Electric',
          primary: '#37AFE1',
          secondary: '#06B6D4',
          accent: '#22D3EE',
        },
        {
          name: 'Amber',
          primary: '#F59E0B',
          secondary: '#FBBF24',
          accent: '#FCD34D',
        },
      ],
      // Font options - editable from dashboard
      fonts: [
        { name: 'Modern', family: 'Inter, sans-serif' },
        { name: 'Classic', family: 'Georgia, serif' },
        { name: 'Tech', family: 'Fira Code, monospace' },
        { name: 'Elegant', family: 'Montserrat, sans-serif' },
      ],
    },
  },
  {
    page: 'services-webdesign',
    section: 'responsivePreview',
    content: {
      eyebrow: 'Responsive',
      title: 'Responsive Across',
      titleHighlight: 'All Devices',
      subtitle: 'Your design adapts seamlessly from mobile to desktop.',
    },
  },
  {
    page: 'services-webdesign',
    section: 'caseStudies',
    content: {
      eyebrow: 'Design Success Stories',
      title: 'Designs That',
      titleHighlight: 'Inspire',
      subtitle:
        "See how we've helped businesses transform their digital presence with stunning designs.",
      studies: [
        {
          img: '/media/services/web-design/case-studies/saas-landing.jpg',
          title: 'SaaS Landing Page',
          desc: 'High-converting landing page with 65% increase in sign-ups and stunning animations.',
          sliderName: 'saas',
        },
        {
          img: '/media/services/web-design/case-studies/corporate-rebrand.jpg',
          title: 'Corporate Rebrand',
          desc: 'Complete visual identity overhaul with modern design system and brand guidelines.',
          sliderName: 'corporate',
        },
        {
          img: '/media/services/web-design/case-studies/creative-portfolio.jpg',
          title: 'Creative Portfolio',
          desc: 'Award-winning portfolio site with immersive animations and 3D interactions.',
          sliderName: 'portfolio',
        },
        {
          img: '/media/services/web-design/case-studies/mobile-app-ui.jpg',
          title: 'Mobile App UI',
          desc: 'User-centered mobile design with 4.9 star rating and 50% improved task completion.',
          sliderName: 'mobile',
        },
      ],
    },
  },
  {
    page: 'services-webdesign',
    section: 'cta',
    content: {
      title: 'Ready to Transform Your Digital Presence?',
      subtitle:
        "Let's create a design that sets you apart from the competition",
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-webdesign',
    section: 'techStack',
    content: {
      eyebrow: '✨ Our Tech Stack',
      title: 'Build Your',
      titleHighlight: 'Digital Empire',
      subtitle:
        'We leverage cutting-edge technologies to deliver scalable, high-performance solutions that drive your business forward.',
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
      secondaryCtaText: 'View Our Work',
      secondaryCtaHref: '/portfolio',
    },
  },

  // ==================== N8N AUTOMATIONS SERVICE PAGE ====================
  {
    page: 'services-n8n',
    section: 'hero',
    content: {
      eyebrow: 'Workflow Automation',
      title: 'N8N Automation, Efficiency Amplified',
      highlightedWord: 'N8N',
      highlightedWord2: 'Efficiency',
      subtitle:
        'Transform manual workflows into intelligent automation systems. Connect apps, sync data, and automate repetitive tasks with powerful N8N workflows.',
      ctaButton: {
        label: 'Start Automating',
        href: '/contact',
      },
      // Hero cards for FluxCardHero component - Requirements: 1.2
      cards: [
        {
          bgColor: 'bg-[#37AFE1]',
          content: {
            greeting: 'Automate your workflows with N8N',
            subtitle: 'Connect apps and services seamlessly',
          },
        },
        {
          bgColor: 'bg-[#31A4DB]',
          content: {
            type: 'analytics',
            greeting: 'Performance Analytics',
            subtitle: 'Automation Usage This Month',
          },
        },
        {
          bgColor: 'bg-[#F58122]',
          content: {
            type: 'projects',
            title: 'Active Workflows',
            subtitle: 'Your Automation Pipelines',
          },
        },
        {
          bgColor: 'bg-[#37AFE1]',
          content: {
            type: 'chat-history',
          },
        },
      ],
    },
  },
  {
    page: 'services-n8n',
    section: 'video',
    content: {
      eyebrow: 'See Automation In Action',
      title: 'Watch How We Build',
      titleHighlight: 'Powerful Workflows',
      subtitle:
        'Experience our automation process and see the intelligent N8N workflows we create for our clients.',
      videoSrc: '/media/services/n8n-automations/video/hero-video.mp4',
      ctaText: 'Start Automating',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-n8n',
    section: 'workflowBuilder',
    content: {
      eyebrow: 'Visual Builder',
      title: 'Interactive Workflow',
      titleHighlight: 'Builder',
      subtitle:
        'Design and visualize your automation workflows with our intuitive builder.',
      // Workflow nodes configuration - Requirements: 2.4
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          label: 'Webhook Trigger',
          x: 100,
          y: 200,
          connections: ['action-1'],
        },
        {
          id: 'action-1',
          type: 'action',
          label: 'Process Data',
          x: 300,
          y: 200,
          connections: ['condition-1'],
        },
        {
          id: 'condition-1',
          type: 'condition',
          label: 'Check Status',
          x: 500,
          y: 200,
          connections: ['output-1'],
        },
        {
          id: 'output-1',
          type: 'output',
          label: 'Send Email',
          x: 700,
          y: 200,
          connections: [],
        },
      ],
      // Node type color mapping - Requirements: 2.4
      nodeColors: {
        trigger: '#2563EB',
        action: '#37AFE1',
        condition: '#F59E0B',
        output: '#31A4DB',
      },
    },
  },
  {
    page: 'services-n8n',
    section: 'beforeAfter',
    content: {
      eyebrow: 'Comparison',
      title: 'Manual vs',
      titleHighlight: 'Automated',
      subtitle:
        'See the dramatic difference between manual processes and automated workflows.',
      // Manual process configuration - Requirements: 3.4
      manualProcess: {
        title: 'Manual Process',
        steps: [
          { step: 1, text: 'Receive email notification', time: '5 min' },
          { step: 2, text: 'Copy data to spreadsheet', time: '10 min' },
          { step: 3, text: 'Validate information', time: '8 min' },
          { step: 4, text: 'Update CRM manually', time: '12 min' },
          { step: 5, text: 'Send confirmation email', time: '5 min' },
        ],
        totalTime: '40 minutes',
        summary: 'High error rate, manual effort',
      },
      // Automated process configuration - Requirements: 3.4
      automatedProcess: {
        title: 'Automated Process',
        steps: [
          { step: 1, text: 'Webhook receives data', time: '< 1 sec' },
          { step: 2, text: 'Auto-validate & parse', time: '< 1 sec' },
          { step: 3, text: 'Update CRM via API', time: '< 1 sec' },
          { step: 4, text: 'Send confirmation', time: '< 1 sec' },
          { step: 5, text: 'Log to analytics', time: '< 1 sec' },
        ],
        totalTime: '5 seconds',
        summary: 'Zero errors, fully automated',
      },
    },
  },
  {
    page: 'services-n8n',
    section: 'performanceMetrics',
    content: {
      eyebrow: 'Analytics',
      title: 'Performance',
      titleHighlight: 'Impact',
      subtitle:
        'Track the measurable impact of automation on your business operations.',
      metrics: [
        {
          label: 'Time Saved',
          value: '95',
          target: 95,
          unit: '%',
          color: '#31A4DB',
          icon: '⏱️',
        },
        {
          label: 'Cost Reduction',
          value: '80',
          target: 80,
          unit: '%',
          color: '#2563EB',
          icon: '💰',
        },
        {
          label: 'Error Reduction',
          value: '99',
          target: 99,
          unit: '%',
          color: '#37AFE1',
          icon: '✓',
        },
        {
          label: 'Scalability',
          value: '10',
          target: 10,
          unit: 'x',
          color: '#31A4DB',
          icon: '📈',
        },
      ],
      benefits: [
        {
          title: '24/7 Automation',
          description: 'Workflows run continuously without human intervention',
        },
        {
          title: 'Zero Human Error',
          description: 'Consistent execution eliminates manual mistakes',
        },
        {
          title: 'Instant Scalability',
          description: 'Handle 10x volume without additional resources',
        },
        {
          title: 'Real-time Monitoring',
          description: 'Track performance and identify issues instantly',
        },
      ],
      benefitsTitle: 'Key Benefits',
    },
  },
  {
    page: 'services-n8n',
    section: 'apiIntegration',
    content: {
      eyebrow: 'Connectivity',
      title: 'API',
      titleHighlight: 'Integration',
      subtitle: 'Connect any system with our powerful REST API integrations.',
      // API integration component configuration - Requirements: 4.4
      circleText: 'N8N',
      badgeTexts: {
        first: 'Trigger',
        second: 'Process',
        third: 'Transform',
        fourth: 'Deliver',
      },
      buttonTexts: {
        first: 'Rising Dot',
        second: 'Workflows',
      },
      boxTitle: 'Data exchange using a customized REST API',
      lightColor: '#F58122',
    },
  },
  {
    page: 'services-n8n',
    section: 'caseStudies',
    content: {
      eyebrow: 'Automation Success Stories',
      title: 'Workflows That',
      titleHighlight: 'Scale',
      subtitle:
        "See how we've helped businesses automate repetitive tasks and boost efficiency.",
      studies: [
        {
          img: '/media/services/n8n-automations/case-studies/data-sync.jpg',
          title: 'Data Sync Automation',
          desc: 'Multi-system integration saving 200+ hours monthly with 95% error reduction.',
          sliderName: 'datasync',
        },
        {
          img: '/media/services/n8n-automations/case-studies/lead-processing.jpg',
          title: 'Lead Processing',
          desc: 'Automated lead qualification and routing with 450% ROI and instant response times.',
          sliderName: 'leads',
        },
        {
          img: '/media/services/n8n-automations/case-studies/report-generation.jpg',
          title: 'Report Generation',
          desc: 'Automated daily reports from 10+ data sources, saving 40 hours per week.',
          sliderName: 'reports',
        },
        {
          img: '/media/services/n8n-automations/case-studies/ecommerce-workflows.jpg',
          title: 'E-Commerce Workflows',
          desc: 'Order processing automation handling 1000+ orders daily with zero manual intervention.',
          sliderName: 'ecommerce',
        },
      ],
    },
  },
  {
    page: 'services-n8n',
    section: 'cta',
    content: {
      title: 'Ready to Automate Your Workflows?',
      subtitle:
        "Let's build powerful N8N automations that save time and boost efficiency",
      ctaText: 'Start Automating',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-n8n',
    section: 'techStack',
    content: {
      eyebrow: '✨ Our Tech Stack',
      title: 'Build Your',
      titleHighlight: 'Digital Empire',
      subtitle:
        'We leverage cutting-edge technologies to deliver scalable, high-performance solutions that drive your business forward.',
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
      secondaryCtaText: 'View Our Work',
      secondaryCtaHref: '/portfolio',
    },
  },

  // ==================== SAAS SERVICE PAGE ====================
  {
    page: 'services-saas',
    section: 'hero',
    content: {
      badge: 'Custom Software Solutions',
      titleHighlight: 'SaaS',
      title: 'for Your Business',
      description:
        'Custom software solutions that scale with your business and streamline operations. From CRM to inventory management, we build what you need.',
      primaryCta: { text: 'Start Your Project', href: '/contact' },
      secondaryCta: { text: 'View Our Work', href: '/portfolio' },
      image: '/media/services/saas/hero/saas-dashboard.jpg',
      imageAlt: 'SaaS Dashboard',
    },
  },
  {
    page: 'services-saas',
    section: 'video',
    content: {
      eyebrow: 'See SaaS In Action',
      title: 'Watch How We Build',
      titleHighlight: 'Custom Software',
      subtitle:
        'Experience our development process and see the scalable SaaS solutions we create for our clients.',
      videoSrc: '/media/services/saas/video/hero-video.mp4',
      ctaText: 'Start Your SaaS Project',
      ctaHref: '/contact',
    },
  },
  {
    page: 'services-saas',
    section: 'features',
    content: {
      eyebrow: 'Why Choose Us',
      title: 'Why Choose Our',
      titleHighlight: 'SaaS Solutions?',
      subtitle:
        'We build scalable, secure, and user-friendly software tailored to your needs.',
      features: [
        {
          title: 'Scalable Architecture',
          desc: 'Built to grow with your business from day one',
          icon: '🚀',
          borderColor: '#37AFE1',
        },
        {
          title: 'Cloud-Native',
          desc: 'Deployed on modern cloud infrastructure for reliability',
          icon: '☁️',
          borderColor: '#2563EB',
        },
        {
          title: 'API-First Design',
          desc: 'Seamless integrations with your existing tools',
          icon: '🔗',
          borderColor: '#F97316',
        },
        {
          title: 'Real-Time Analytics',
          desc: 'Data-driven insights to make informed decisions',
          icon: '📊',
          borderColor: '#31A4DB',
        },
        {
          title: 'Enterprise Security',
          desc: 'Bank-level security to protect your data',
          icon: '🔒',
          borderColor: '#F58122',
        },
        {
          title: '24/7 Support',
          desc: 'Round-the-clock support when you need it',
          icon: '💬',
          borderColor: '#37AFE1',
        },
      ],
    },
  },
  {
    page: 'services-saas',
    section: 'solutions',
    content: {
      eyebrow: 'Solutions',
      title: 'Our SaaS',
      titleHighlight: 'Solutions',
      subtitle:
        'From CRM to inventory management, we build what your business needs.',
      solutions: [
        {
          title: 'CRM Systems',
          desc: 'Manage customer relationships and sales pipelines effectively',
          gradientFrom: '#F58122',
          gradientTo: '#37AFE1',
          borderColor: '#37AFE1',
        },
        {
          title: 'Inventory Management',
          desc: 'Track stock levels, orders, and suppliers in real-time',
          gradientFrom: '#37AFE1',
          gradientTo: '#2563EB',
          borderColor: '#2563EB',
        },
        {
          title: 'Project Management',
          desc: 'Collaborate with teams and track project progress',
          gradientFrom: '#2563EB',
          gradientTo: '#31A4DB',
          borderColor: '#31A4DB',
        },
        {
          title: 'HR & Payroll',
          desc: 'Streamline employee management and payroll processing',
          gradientFrom: '#31A4DB',
          gradientTo: '#F97316',
          borderColor: '#F97316',
        },
      ],
    },
  },
  {
    page: 'services-saas',
    section: 'caseStudies',
    content: {
      eyebrow: 'SaaS Success Stories',
      title: 'Software That',
      titleHighlight: 'Scales',
      subtitle:
        "See how we've helped businesses build custom software solutions that drive growth.",
      studies: [
        {
          img: '/media/services/saas/case-studies/project-management.jpg',
          title: 'CRM Platform',
          desc: 'Custom CRM serving 500+ users with real-time analytics and 99.9% uptime.',
          sliderName: 'crm',
        },
        {
          img: '/media/services/saas/case-studies/inventory-system.jpg',
          title: 'Inventory System',
          desc: 'Real-time inventory management tracking 50,000+ SKUs across multiple warehouses.',
          sliderName: 'inventory',
        },
        {
          img: '/media/services/saas/case-studies/project-management.jpg',
          title: 'Project Management',
          desc: 'Team collaboration platform with 10,000+ daily active users and advanced reporting.',
          sliderName: 'project',
        },
        {
          img: '/media/services/saas/case-studies/hr-payroll.jpg',
          title: 'HR & Payroll',
          desc: 'Automated payroll processing for 2,000+ employees with compliance management.',
          sliderName: 'hr',
        },
      ],
    },
  },
  {
    page: 'services-saas',
    section: 'liveDashboard',
    content: {
      eyebrow: 'Live Preview',
      title: 'See Your Dashboard',
      titleHighlight: 'In Action',
      subtitle:
        'Experience a live preview of what your custom SaaS dashboard could look like.',
      metrics: [
        {
          label: 'Total Revenue',
          value: 124500,
          prefix: '$',
          change: 12.5,
          color: '#37AFE1',
          icon: 'dollar',
        },
        {
          label: 'Active Users',
          value: 8420,
          change: 8.3,
          color: '#2563EB',
          icon: 'users',
        },
        {
          label: 'Orders Today',
          value: 342,
          change: -2.1,
          color: '#F97316',
          icon: 'cart',
        },
        {
          label: 'Growth Rate',
          value: 23.5,
          suffix: '%',
          change: 5.7,
          color: '#31A4DB',
          icon: 'trending',
        },
      ],
      chartData: [
        { label: 'Mon', value: 65 },
        { label: 'Tue', value: 78 },
        { label: 'Wed', value: 52 },
        { label: 'Thu', value: 91 },
        { label: 'Fri', value: 84 },
        { label: 'Sat', value: 67 },
        { label: 'Sun', value: 95 },
      ],
      notifications: [
        { message: 'New user registered', time: '2 min ago', type: 'success' },
        { message: 'Order #1234 completed', time: '5 min ago', type: 'info' },
        { message: 'Server load at 85%', time: '10 min ago', type: 'warning' },
      ],
      dashboardTitle: 'Analytics Dashboard',
      chartTitle: 'Weekly Performance',
      notificationsTitle: 'Recent Activity',
    },
  },
  {
    page: 'services-saas',
    section: 'howItWorks',
    content: {
      eyebrow: 'Our Process',
      title: 'How We Build Your',
      titleHighlight: 'SaaS',
      subtitle: 'A proven methodology that delivers results every time.',
      steps: [
        {
          title: 'Discovery',
          description: 'Understanding your needs',
          details:
            'We dive deep into your business requirements, analyze workflows, and identify opportunities for automation and improvement.',
          icon: 'search',
          color: '#37AFE1',
        },
        {
          title: 'Design',
          description: 'Crafting the solution',
          details:
            'Our designers create intuitive interfaces and user experiences that align with your brand and delight your users.',
          icon: 'palette',
          color: '#2563EB',
        },
        {
          title: 'Development',
          description: 'Building your platform',
          details:
            'Our engineers build scalable, secure, and performant applications using cutting-edge technologies and best practices.',
          icon: 'code',
          color: '#F97316',
        },
        {
          title: 'Testing',
          description: 'Ensuring quality',
          details:
            'Rigorous testing across devices and scenarios ensures your application is bug-free and performs flawlessly.',
          icon: 'test',
          color: '#31A4DB',
        },
        {
          title: 'Launch',
          description: 'Going live',
          details:
            'We handle deployment, monitoring, and provide ongoing support to ensure your SaaS succeeds in the market.',
          icon: 'rocket',
          color: '#F58122',
        },
      ],
    },
  },
  {
    page: 'services-saas',
    section: 'roiCalculator',
    content: {
      eyebrow: 'Calculate Your Savings',
      title: 'ROI',
      titleHighlight: 'Calculator',
      subtitle:
        'See how much you could save by automating your workflows with a custom SaaS solution.',
      sliders: [
        {
          label: 'Manual Hours Per Week',
          min: 5,
          max: 100,
          default: 40,
          suffix: ' hrs',
        },
        {
          label: 'Hourly Employee Cost',
          min: 20,
          max: 200,
          default: 50,
          prefix: '$',
        },
        { label: 'Number of Employees', min: 1, max: 50, default: 5 },
      ],
      savingsMultiplier: 0.7,
      ctaText: 'Get Custom Quote',
      ctaHref: '/contact',
      resultLabels: {
        currentCost: 'Current Yearly Cost',
        estimatedSavings: 'Estimated Yearly Savings',
        roi: 'Return on Investment',
        paybackPeriod: 'Payback Period',
      },
      accentColor: '#37AFE1',
    },
  },
  {
    page: 'services-saas',
    section: 'featureRequest',
    content: {
      eyebrow: 'Tell Us Your Vision',
      title: 'Feature',
      titleHighlight: 'Request',
      subtitle:
        'Share your ideas and let us help you build the perfect SaaS solution for your business.',
      featureOptions: [
        { label: 'User Dashboard', value: 'dashboard' },
        { label: 'Analytics & Reports', value: 'analytics' },
        { label: 'User Management', value: 'user-management' },
        { label: 'Payment Integration', value: 'payments' },
        { label: 'API Access', value: 'api' },
        { label: 'Mobile App', value: 'mobile' },
        { label: 'Notifications', value: 'notifications' },
        { label: 'Integrations', value: 'integrations' },
      ],
      budgetOptions: [
        { label: '$5,000 - $15,000', value: '5k-15k' },
        { label: '$15,000 - $30,000', value: '15k-30k' },
        { label: '$30,000 - $50,000', value: '30k-50k' },
        { label: '$50,000+', value: '50k+' },
        { label: 'Not sure yet', value: 'unsure' },
      ],
      submitButtonText: 'Submit Request',
      successMessage: 'Request Submitted!',
      successSubtext: "We'll get back to you within 24 hours.",
      placeholders: {
        name: 'Your name',
        email: 'your@email.com',
        company: 'Company name (optional)',
        description: 'Describe your ideal SaaS solution...',
      },
      accentColor: '#37AFE1',
    },
  },
  {
    page: 'services-saas',
    section: 'techStack',
    content: {
      eyebrow: '✨ Our Tech Stack',
      title: 'Build Your',
      titleHighlight: 'Digital Empire',
      subtitle:
        'We leverage cutting-edge technologies to deliver scalable, high-performance solutions that drive your business forward.',
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
      secondaryCtaText: 'View Our Work',
      secondaryCtaHref: '/portfolio',
    },
  },
  {
    page: 'services-saas',
    section: 'cta',
    content: {
      eyebrow: 'SaaS Experts',
      title: 'Ready to Transform',
      titleHighlight: 'Your Business?',
      subtitle:
        "Let's build a custom SaaS solution that drives your business forward",
      ctaText: 'Get Started Today',
      ctaHref: '/contact',
    },
  },
  // ==================== BLOG PAGE ====================
  {
    page: 'blog',
    section: 'hero',
    content: {
      eyebrow: 'Our Blog',
      title: 'Insights & Ideas',
      subtitle:
        'Discover the latest trends, tips, and insights in web development, design, and digital marketing.',
      ctaLabel: 'Latest Posts',
      ctaHref: '#posts',
    },
  },
  {
    page: 'blog',
    section: 'filter',
    content: {
      categories: [
        'All',
        'Development',
        'Design',
        'Marketing',
        'Technology',
        'Business',
        'Tutorial',
      ],
      activeColor: '#37AFE1',
    },
  },
  {
    page: 'blog',
    section: 'emptyState',
    content: {
      title: 'No blog posts found in this category.',
      subtitle: 'Check back soon for new content!',
    },
  },
];

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');
    const collection = db.collection('siteContent');

    // Check for force parameter to re-seed
    const url = new URL(request.url);
    const force = url.searchParams.get('force') === 'true';

    // Check if content already exists
    const existingCount = await collection.countDocuments();
    if (existingCount > 0 && !force) {
      return NextResponse.json({
        message: 'Content already seeded. Use ?force=true to re-seed.',
        count: existingCount,
      });
    }

    // Delete existing content if force re-seed
    if (existingCount > 0 && force) {
      await collection.deleteMany({});
    }

    // Add timestamps to all content
    const now = new Date();
    const contentWithTimestamps = initialContent.map((item) => ({
      ...item,
      createdAt: now,
      updatedAt: now,
    }));

    // Insert all content
    const result = await collection.insertMany(contentWithTimestamps);

    return NextResponse.json({
      message: force
        ? 'Content re-seeded successfully'
        : 'Content seeded successfully',
      count: result.insertedCount,
    });
  } catch (error) {
    console.error('Error seeding content:', error);
    return NextResponse.json(
      { error: 'Failed to seed content' },
      { status: 500 }
    );
  }
}
