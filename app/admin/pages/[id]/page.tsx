'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Edit,
  Save,
  X,
  RefreshCw,
  Image as ImageIcon,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import Link from 'next/link';

interface PageSection {
  _id: string;
  page: string;
  section: string;
  content: Record<string, any>;
  visible?: boolean;
  updatedAt: string;
}

// Default content for sections (matches frontend fallback values)
const defaultSectionContent: Record<
  string,
  Record<string, Record<string, any>>
> = {
  about: {
    hero: {
      eyebrow: 'Who We Are',
      title: 'About Rising Dot',
      subtitle:
        "We're a team of passionate developers, designers, and strategists dedicated to creating exceptional digital experiences that drive results.",
      ctaLabel: 'Meet Our Team',
      ctaHref: '#team',
    },
    showreel: {
      videoUrl: '/media/about/agency-showreel/videos/showreel.mp4',
      caption: 'OUR VISION',
      heading: 'Rising Together in the World of Digital Dots',
      paragraphs: [
        'We transform ideas into exceptional digital experiences that drive real business results.',
        "From stunning web designs to powerful automations, we're your partner in digital growth.",
      ],
    },
    team: {
      eyebrow: 'Meet the Team',
      title: 'The Minds Behind',
      titleHighlight: 'Rising Dot',
      socialText: 'Follow us on social media',
    },
    skills: {
      eyebrow: 'What We Do Best',
      title: 'Our',
      titleHighlight: 'Expertise',
    },
    timeline: {
      eyebrow: 'Our Story',
      title: 'Our',
      titleHighlight: 'Journey',
    },
    officeTour: {
      eyebrow: 'Virtual Experience',
      title: '360°',
      titleHighlight: 'Office Tour',
    },
    testimonials: {
      eyebrow: 'Client Stories',
      title: 'What Our Clients',
      titleHighlight: 'Say',
    },
    cta: {
      eyebrow: 'Start a Project',
      title: "Let's Build Something",
      titleHighlight: 'Amazing',
      subtitle:
        "Ready to transform your digital presence? Let's discuss your project.",
      ctaText: 'Get in Touch',
      ctaLink: '/contact',
    },
  },
  home: {
    hero: {
      eyebrow: 'Digital Excellence Delivered',
      title: 'Rising Dot Agency',
      subtitle:
        'We craft stunning websites, powerful automations, and intelligent chatbots that transform your digital presence.',
      ctaText: 'Get Started',
      ctaLink: '/contact',
      scrollText: 'Scroll to explore',
    },
    valueProposition: {
      eyebrow: 'Digital Excellence',
      title: 'Transform Your',
      titleHighlight: 'Digital Presence',
      subtitle: 'Premium digital solutions powered by cutting-edge technology',
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
    serviceCards: {
      eyebrow: 'Solutions',
      title: 'Our',
      titleHighlight: 'Services',
      subtitle: 'Comprehensive digital solutions tailored to your needs',
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
    connect: {
      title: 'Any questions about your project?',
      subtitle: 'Feel free to reach out to us!',
      ctaText: 'Book a call',
      ctaLink: '/contact',
      email: 'contact@risingdot.agency',
      whatsapp: '+1234567890',
      services: ['Chatbots', 'N8N Automation', 'Web Development', 'Shopify'],
    },
    testimonials: {
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
    },
    cta: {
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
    stackFeature: {
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
  contact: {
    cta: {
      eyebrow: 'Ready to Start?',
      title: "Let's Work",
      titleHighlight: 'Together',
      subtitle: 'Have a project in mind? We would love to hear from you.',
      ctaText: 'Get in Touch',
      ctaLink: '/contact',
    },
  },
  portfolio: {
    cta: {
      eyebrow: 'Ready to Start?',
      title: "Let's Work",
      titleHighlight: 'Together',
      subtitle: 'Have a project in mind? We would love to hear from you.',
      ctaText: 'Get in Touch',
      ctaLink: '/contact',
    },
  },
  'services-n8n': {
    hero: {
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
    workflowBuilder: {
      eyebrow: 'Visual Builder',
      title: 'Interactive Workflow',
      titleHighlight: 'Builder',
      subtitle:
        'Design and visualize your automation workflows with our intuitive builder.',
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
      nodeColors: {
        trigger: '#2563EB',
        action: '#37AFE1',
        condition: '#F59E0B',
        output: '#31A4DB',
      },
    },
    beforeAfter: {
      eyebrow: 'Comparison',
      title: 'Manual vs',
      titleHighlight: 'Automated',
      subtitle:
        'See the dramatic difference between manual processes and automated workflows.',
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
    apiIntegration: {
      eyebrow: 'Connectivity',
      title: 'API',
      titleHighlight: 'Integration',
      subtitle: 'Connect any system with our powerful REST API integrations.',
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
    performanceMetrics: {
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
          color: '#F97316',
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
  'services-webdesign': {
    wireframeMorph: {
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
    designTimeline: {
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
        },
        {
          id: 'wireframe',
          name: 'Wireframe',
          description: 'Structure & Layout',
          color: '#2563EB',
          position: 25,
        },
        {
          id: 'design',
          name: 'Design',
          description: 'Visual Identity',
          color: '#37AFE1',
          position: 50,
        },
        {
          id: 'development',
          name: 'Development',
          description: 'Build & Test',
          color: '#F97316',
          position: 75,
        },
        {
          id: 'launch',
          name: 'Launch',
          description: 'Deploy & Monitor',
          color: '#31A4DB',
          position: 100,
        },
      ],
    },
    styleShowcase: {
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
      fonts: [
        { name: 'Modern', family: 'Inter, sans-serif' },
        { name: 'Classic', family: 'Georgia, serif' },
        { name: 'Tech', family: 'Fira Code, monospace' },
        { name: 'Elegant', family: 'Montserrat, sans-serif' },
      ],
    },
  },
  'services-chatbot': {
    hero: {
      titleHighlight: 'AI-Powered',
      title: 'Chatbots',
      subtitle:
        'Intelligent conversational AI that connects with your customers 24/7 across all platforms. From WhatsApp to Slack, we build chatbots that convert.',
      ctaText: 'Build Your Chatbot',
      ctaHref: '/contact',
    },
    video: {
      eyebrow: 'See AI In Action',
      title: 'Watch How We Build',
      titleHighlight: 'Intelligent Chatbots',
      subtitle:
        'Experience our AI development process and see the conversational bots we create for our clients.',
      videoSrc: '/media/services/chatbot-development/video/hero-video.mp4',
      ctaText: 'Build Your Chatbot',
      ctaHref: '/contact',
    },
    chatDemo: {
      eyebrow: 'Interactive Demo',
      title: 'Live Chat',
      titleHighlight: 'Demo',
      subtitle:
        'Experience our AI chatbot in action with this interactive demonstration.',
      initialMessage: "Hello! I'm an AI assistant. How can I help you today?",
      inputPlaceholder: 'Type your message...',
      sendButtonText: 'Send',
      typingIndicatorText: 'AI is typing...',
      aiResponses: [
        "That's a great question! Let me help you with that.",
        "I understand. Here's what I can tell you...",
        'Interesting! Based on my analysis...',
        "I'd be happy to assist you with that.",
        'Let me process that information for you.',
      ],
      userMessageColor: '#2563EB',
      aiMessageColor: '#37AFE1',
    },
    learningAnimation: {
      eyebrow: 'Neural Networks',
      title: 'AI Learning',
      titleHighlight: 'Process',
      subtitle:
        'See how our neural networks process and understand your conversations.',
      layers: [
        { nodes: 4, label: 'Input', sublabel: 'User Query' },
        { nodes: 6, label: 'Hidden 1', sublabel: 'Understanding' },
        { nodes: 8, label: 'Hidden 2', sublabel: 'Processing' },
        { nodes: 6, label: 'Hidden 3', sublabel: 'Reasoning' },
        { nodes: 4, label: 'Output', sublabel: 'Response' },
      ],
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
      stageLabels: {
        input: 'Receiving Input...',
        processing: 'Processing Data...',
        output: 'Generating Response...',
      },
    },
    accuracyChart: {
      eyebrow: 'Analytics',
      title: 'Performance',
      titleHighlight: 'Improvement',
      subtitle:
        'Track the continuous improvement of your AI chatbot over time.',
      metrics: [
        { label: 'Current Accuracy', color: '#37AFE1', suffix: '%' },
        { label: 'Improvement', color: '#F97316', prefix: '+', suffix: '%' },
        { label: 'Training Epochs', color: '#31A4DB', suffix: '' },
        { label: 'Response Time', color: '#2563EB', value: '<100ms' },
      ],
      chartConfig: {
        xAxisLabel: 'Training Epochs',
        yAxisLabel: 'Accuracy (%)',
        lineColor: '#37AFE1',
        gridColor: '#64748B',
      },
    },
    caseStudies: {
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
    cta: {
      title: 'Ready to Build Your AI Chatbot?',
      subtitle:
        "Let's create an intelligent chatbot that engages your customers 24/7",
      ctaText: 'Start Your Project',
      ctaHref: '/contact',
    },
    techStack: {
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
  'services-wordpress': {
    metrics: {
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
    pluginConstellation: {
      eyebrow: 'Integrations',
      title: 'Plugin',
      titleHighlight: 'Ecosystem',
      subtitle:
        'Explore our curated selection of WordPress plugins and their relationships.',
      plugins: [
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
  'services-saas': {
    hero: {
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
    video: {
      eyebrow: 'See SaaS In Action',
      title: 'Watch How We Build',
      titleHighlight: 'Custom Software',
      subtitle:
        'Experience our development process and see the scalable SaaS solutions we create for our clients.',
      videoSrc: '/media/services/saas/video/hero-video.mp4',
      ctaText: 'Start Your SaaS Project',
      ctaHref: '/contact',
    },
    features: {
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
    solutions: {
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
    caseStudies: {
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
    liveDashboard: {
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
    howItWorks: {
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
    roiCalculator: {
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
    featureRequest: {
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
    techStack: {
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
    cta: {
      eyebrow: 'SaaS Experts',
      title: 'Ready to Transform',
      titleHighlight: 'Your Business?',
      subtitle:
        "Let's build a custom SaaS solution that drives your business forward",
      ctaText: 'Get Started Today',
      ctaHref: '/contact',
    },
  },
  blog: {
    hero: {
      eyebrow: 'Our Blog',
      title: 'Insights & Ideas',
      subtitle:
        'Discover the latest trends, tips, and insights in web development, design, and digital marketing.',
      ctaLabel: 'Latest Posts',
      ctaHref: '#posts',
    },
    filter: {
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
    emptyState: {
      title: 'No blog posts found in this category.',
      subtitle: 'Check back soon for new content!',
    },
  },
};

// Page structure with sections and their editable fields
const pageStructure: Record<
  string,
  {
    label: string;
    sections: {
      key: string;
      label: string;
      imagePath?: string;
      note?: string;
    }[];
  }
> = {
  home: {
    label: 'Homepage',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        imagePath: 'public/scene.splinecode (3D model)',
      },
      {
        key: 'showreel',
        label: 'Cinematic Showreel',
        imagePath: 'public/videos/showreel_desktop_16-9.mp4',
      },
      {
        key: 'featuredServices',
        label: 'Featured Services',
        imagePath: 'public/media/home/featured-services/*.jpg',
      },
      {
        key: 'valueProposition',
        label: 'Value Proposition',
        note: 'Services grid with colors and icons',
      },
      {
        key: 'serviceCards',
        label: 'Service Cards',
        note: 'Service cards with colors and features',
      },
      {
        key: 'stackFeature',
        label: 'Stack Feature (Orbit Animation)',
        note: 'Tech stack with orbiting icons - icons, colors, center text',
      },
      {
        key: 'techStack',
        label: 'Tech Stack Marquee',
        imagePath: 'public/media/home/tech-stack-marquee/*.svg',
      },
      {
        key: 'caseStudies',
        label: 'Case Studies Carousel',
        imagePath: 'public/media/home/case-studies/*.jpg',
      },
      {
        key: 'testimonials',
        label: 'Testimonials (headings only)',
        note: 'Testimonial items → /admin/testimonials',
      },
      {
        key: 'blog',
        label: 'Blog Section (headings only)',
        note: 'Blog posts → /admin/blogs',
      },
      { key: 'connect', label: 'Connect Section' },
      {
        key: 'team',
        label: 'Team Section (headings only)',
        note: 'Team members → /admin/team',
      },
      { key: 'contact', label: 'Contact Form Section' },
      { key: 'cta', label: 'CTA Section' },
    ],
  },
  about: {
    label: 'About Page',
    sections: [
      { key: 'hero', label: 'Hero Section' },
      {
        key: 'showreel',
        label: 'Agency Showreel',
        imagePath: 'public/media/about/agency-showreel/videos/showreel.mp4',
      },
      {
        key: 'team',
        label: 'Team Section (headings only)',
        note: 'Team members → /admin/team',
      },
      { key: 'skills', label: 'Skills Visualization' },
      { key: 'timeline', label: 'Company Timeline' },
      {
        key: 'officeTour',
        label: 'Office Tour',
        imagePath: 'public/media/about/office/*.jpg',
      },
      {
        key: 'testimonials',
        label: 'Testimonials (headings only)',
        note: 'Testimonial items → /admin/testimonials',
      },
      {
        key: 'cta',
        label: 'CTA Section',
        note: 'Call-to-action with social links at bottom',
      },
    ],
  },
  contact: {
    label: 'Contact Page',
    sections: [
      { key: 'hero', label: 'Hero Section' },
      { key: 'form', label: 'Contact Form Section' },
      {
        key: 'info',
        label: 'Contact Information',
        note: 'Email, phone, address, and hours',
      },
      { key: 'map', label: 'Map Section' },
      {
        key: 'cta',
        label: 'CTA Section',
        note: 'Call-to-action with social links at bottom',
      },
    ],
  },
  portfolio: {
    label: 'Portfolio Page',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        imagePath: 'public/media/portfolio/hero/*.jpg',
      },
      {
        key: 'featuredWork',
        label: 'Featured Work Carousel',
        imagePath: 'public/media/portfolio/featured-projects/*.jpg',
      },
      { key: 'filters', label: 'Skills & Technologies' },
      { key: 'grid', label: 'All Projects Grid' },
      {
        key: 'projects',
        label: 'Projects Data',
        imagePath: 'public/media/portfolio/all-projects/*.jpg',
        note: 'Project items as JSON array',
      },
      {
        key: 'caseStudies',
        label: 'Case Studies Carousel',
        imagePath: 'public/media/portfolio/case-studies/*.jpg',
      },
      { key: 'advantages', label: 'Our Advantages Section' },
      {
        key: 'cta',
        label: 'CTA Section',
        note: 'Call-to-action with social links at bottom',
      },
    ],
  },
  blog: {
    label: 'Blog Page',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        note: 'eyebrow, title, subtitle, ctaLabel, ctaHref',
      },
      {
        key: 'filter',
        label: 'Category Filter',
        note: 'categories (JSON array), activeColor',
      },
      {
        key: 'emptyState',
        label: 'Empty State',
        note: 'title, subtitle - shown when no posts found',
      },
    ],
  },
  'services-chatbot': {
    label: 'Chatbot Development',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        note: 'titleHighlight, title, subtitle, ctaText, ctaHref',
      },
      {
        key: 'video',
        label: 'Video Section',
        imagePath: 'public/media/services/chatbot/video.mp4',
        note: 'eyebrow, title, titleHighlight, subtitle, videoSrc, ctaText, ctaHref',
      },
      {
        key: 'chatDemo',
        label: 'Chat Demo Section',
        note: 'eyebrow, title, titleHighlight, subtitle, initialMessage, inputPlaceholder, sendButtonText, typingIndicatorText, aiResponses (JSON array), userMessageColor, aiMessageColor',
      },
      {
        key: 'learningAnimation',
        label: 'Learning Animation Section',
        note: 'eyebrow, title, titleHighlight, subtitle, layers (JSON array), processSteps (JSON array), stageLabels (JSON object)',
      },
      {
        key: 'accuracyChart',
        label: 'Accuracy Chart Section',
        note: 'eyebrow, title, titleHighlight, subtitle, metrics (JSON array), chartConfig (JSON object)',
      },
      {
        key: 'caseStudies',
        label: 'Case Studies',
        imagePath: 'public/media/services/chatbot/case-studies/*.jpg',
        note: 'eyebrow, title, titleHighlight, subtitle, studies (JSON array)',
      },
      {
        key: 'techStack',
        label: 'Tech Stack Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref, secondaryCtaText, secondaryCtaHref',
      },
      {
        key: 'cta',
        label: 'CTA Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref',
      },
    ],
  },
  'services-seo': {
    label: 'SEO Services',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        note: 'title, highlightedText, subtitle, ctaButton (label, href)',
      },
      {
        key: 'video',
        label: 'Video Section',
        imagePath: 'public/media/services/seo/video.mp4',
        note: 'eyebrow, title, titleHighlight, subtitle, videoSrc, ctaText, ctaHref',
      },
      {
        key: 'serpRanking',
        label: 'SERP Ranking Section',
        note: 'eyebrow, title, titleHighlight, subtitle',
      },
      {
        key: 'keywordCloud',
        label: 'Keyword Cloud Section',
        note: 'eyebrow, title, titleHighlight, subtitle',
      },
      {
        key: 'trafficGrowth',
        label: 'Traffic Growth Section',
        note: 'eyebrow, title, titleHighlight, subtitle',
      },
      {
        key: 'competitorAnalysis',
        label: 'Competitor Analysis Section',
        note: 'eyebrow, title, titleHighlight, subtitle',
      },
      {
        key: 'caseStudies',
        label: 'Case Studies',
        imagePath: 'public/media/services/seo/case-studies/*.jpg',
        note: 'eyebrow, title, titleHighlight, subtitle, studies (JSON array)',
      },
      {
        key: 'techStack',
        label: 'Tech Stack Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref, secondaryCtaText, secondaryCtaHref',
      },
      {
        key: 'cta',
        label: 'CTA Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref',
      },
    ],
  },
  'services-shopify': {
    label: 'Shopify Services',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        imagePath: 'public/media/services/shopify/services/*.jpg',
        note: 'eyebrow, title, highlightedWord, highlightedWord2, subtitle, services (JSON array), ctaLabel, ctaHref',
      },
      {
        key: 'video',
        label: 'Video Section',
        imagePath: 'public/media/services/shopify/video.mp4',
        note: 'eyebrow, title, titleHighlight, subtitle, videoSrc, ctaText, ctaHref',
      },
      {
        key: 'conversionFunnel',
        label: 'Conversion Funnel Section',
        note: 'eyebrow, title, titleHighlight, subtitle',
      },
      {
        key: 'productPreview',
        label: 'Product Preview Section',
        note: 'eyebrow, title, titleHighlight, subtitle',
      },
      {
        key: 'dashboard',
        label: 'Dashboard Section',
        note: 'eyebrow, title, titleHighlight, subtitle',
      },
      {
        key: 'mobileExperience',
        label: 'Mobile Experience Section',
        note: 'eyebrow, title, titleHighlight, subtitle',
      },
      {
        key: 'caseStudies',
        label: 'Case Studies',
        imagePath: 'public/media/services/shopify/case-studies/*.jpg',
        note: 'eyebrow, title, titleHighlight, subtitle, studies (JSON array)',
      },
      {
        key: 'techStack',
        label: 'Tech Stack Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref, secondaryCtaText, secondaryCtaHref',
      },
      {
        key: 'cta',
        label: 'CTA Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref',
      },
    ],
  },
  'services-wordpress': {
    label: 'WordPress Services',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        imagePath: 'public/media/services/wordpress/services/*.jpg',
        note: 'eyebrow, title, highlightedWord, highlightedWord2, subtitle, services (JSON array), ctaLabel, ctaHref',
      },
      {
        key: 'video',
        label: 'Video Section',
        imagePath: 'public/media/services/wordpress/video.mp4',
        note: 'eyebrow, title, titleHighlight, subtitle, videoSrc, ctaText, ctaHref',
      },
      {
        key: 'modularGrid',
        label: 'Modular Grid Section',
        note: 'eyebrow, title, titleHighlight, subtitle, modules (JSON array), successMessage',
      },
      {
        key: 'metrics',
        label: 'Metrics Section',
        note: 'eyebrow, title, titleHighlight, subtitle, metrics (JSON array with label, before, after, unit, format, inverse)',
      },
      {
        key: 'pluginConstellation',
        label: 'Plugin Constellation Section',
        note: 'eyebrow, title, titleHighlight, subtitle, plugins (JSON array), categoryColors (JSON array), legendTitle, instructionText',
      },
      {
        key: 'caseStudies',
        label: 'Case Studies',
        imagePath: 'public/media/services/wordpress/case-studies/*.jpg',
        note: 'eyebrow, title, titleHighlight, subtitle, studies (JSON array)',
      },
      {
        key: 'techStack',
        label: 'Tech Stack Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref, secondaryCtaText, secondaryCtaHref',
      },
      {
        key: 'cta',
        label: 'CTA Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref',
      },
    ],
  },
  'services-webdesign': {
    label: 'Web Design Services',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        imagePath: 'public/media/services/webdesign/services/*.jpg',
        note: 'eyebrow, title, highlightedWord, highlightedWord2, subtitle, services (JSON array), ctaLabel, ctaHref',
      },
      {
        key: 'video',
        label: 'Video Section',
        imagePath: 'public/media/services/webdesign/video.mp4',
        note: 'eyebrow, title, titleHighlight, subtitle, videoSrc, ctaText, ctaHref',
      },
      {
        key: 'wireframeMorph',
        label: 'Wireframe Morph Section',
        note: 'eyebrow, title, titleHighlight, subtitle, logoText, navItems (JSON array), heroTitle, heroSubtitle',
      },
      {
        key: 'designTimeline',
        label: 'Design Timeline Section',
        note: 'eyebrow, title, titleHighlight, subtitle, phases (JSON array)',
      },
      {
        key: 'styleShowcase',
        label: 'Style Showcase Section',
        note: 'eyebrow, title, titleHighlight, subtitle, featureCards (JSON array), brandTitle, brandDescription, ctaText, colorSchemes (JSON array), fonts (JSON array)',
      },
      {
        key: 'responsivePreview',
        label: 'Responsive Preview Section',
        note: 'eyebrow, title, titleHighlight, subtitle',
      },
      {
        key: 'caseStudies',
        label: 'Case Studies',
        imagePath: 'public/media/services/webdesign/case-studies/*.jpg',
        note: 'eyebrow, title, titleHighlight, subtitle, studies (JSON array)',
      },
      {
        key: 'techStack',
        label: 'Tech Stack Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref, secondaryCtaText, secondaryCtaHref',
      },
      {
        key: 'cta',
        label: 'CTA Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref',
      },
    ],
  },
  'services-n8n': {
    label: 'N8N Automations',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        note: 'eyebrow, title, highlightedWord, highlightedWord2, subtitle, ctaButton (label, href), cards (JSON array)',
      },
      {
        key: 'video',
        label: 'Video Section',
        imagePath: 'public/media/services/n8n/video.mp4',
        note: 'eyebrow, title, titleHighlight, subtitle, videoSrc, ctaText, ctaHref',
      },
      {
        key: 'workflowBuilder',
        label: 'Workflow Builder Section',
        note: 'eyebrow, title, titleHighlight, subtitle, nodes (JSON array), nodeColors (JSON object)',
      },
      {
        key: 'beforeAfter',
        label: 'Before/After Section',
        note: 'eyebrow, title, titleHighlight, subtitle, manualProcess (JSON object), automatedProcess (JSON object)',
      },
      {
        key: 'performanceMetrics',
        label: 'Performance Metrics Section',
        note: 'eyebrow, title, titleHighlight, subtitle, metrics (JSON array), benefits (JSON array), benefitsTitle',
      },
      {
        key: 'apiIntegration',
        label: 'API Integration Section',
        note: 'eyebrow, title, titleHighlight, subtitle, circleText, badgeTexts (JSON object), buttonTexts (JSON object), boxTitle, lightColor',
      },
      {
        key: 'caseStudies',
        label: 'Case Studies',
        imagePath: 'public/media/services/n8n/case-studies/*.jpg',
        note: 'eyebrow, title, titleHighlight, subtitle, studies (JSON array)',
      },
      {
        key: 'techStack',
        label: 'Tech Stack Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref, secondaryCtaText, secondaryCtaHref',
      },
      {
        key: 'cta',
        label: 'CTA Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref',
      },
    ],
  },
  'services-saas': {
    label: 'SaaS Solutions',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        imagePath: 'public/media/services/saas/hero/*.jpg',
        note: 'badge, titleHighlight, title, description, primaryCta (JSON object), secondaryCta (JSON object), image, imageAlt',
      },
      {
        key: 'video',
        label: 'Video Section',
        imagePath: 'public/media/services/saas/video.mp4',
        note: 'eyebrow, title, titleHighlight, subtitle, videoSrc, ctaText, ctaHref',
      },
      {
        key: 'features',
        label: 'Features Section',
        note: 'eyebrow, title, titleHighlight, subtitle, features (JSON array with title, desc, icon, borderColor)',
      },
      {
        key: 'solutions',
        label: 'Solutions Section',
        note: 'eyebrow, title, titleHighlight, subtitle, solutions (JSON array with title, desc, gradientFrom, gradientTo, borderColor)',
      },
      {
        key: 'liveDashboard',
        label: 'Live Dashboard Demo',
        note: 'eyebrow, title, titleHighlight, subtitle, metrics (JSON array), chartData (JSON array), notifications (JSON array), dashboardTitle, chartTitle, notificationsTitle',
      },
      {
        key: 'howItWorks',
        label: 'How It Works',
        note: 'eyebrow, title, titleHighlight, subtitle, steps (JSON array with title, description, details, icon, color)',
      },
      {
        key: 'caseStudies',
        label: 'Case Studies',
        imagePath: 'public/media/services/saas/case-studies/*.jpg',
        note: 'eyebrow, title, titleHighlight, subtitle, studies (JSON array)',
      },
      {
        key: 'roiCalculator',
        label: 'ROI Calculator',
        note: 'eyebrow, title, titleHighlight, subtitle, sliders (JSON array), savingsMultiplier, ctaText, ctaHref, resultLabels (JSON object), accentColor',
      },
      {
        key: 'techStack',
        label: 'Tech Stack Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref, secondaryCtaText, secondaryCtaHref',
      },
      {
        key: 'featureRequest',
        label: 'Feature Request Form',
        note: 'eyebrow, title, titleHighlight, subtitle, featureOptions (JSON array), budgetOptions (JSON array), submitButtonText, successMessage, successSubtext, placeholders (JSON object), accentColor',
      },
      {
        key: 'cta',
        label: 'CTA Section',
        note: 'eyebrow, title, titleHighlight, subtitle, ctaText, ctaHref',
      },
    ],
  },
};

export default function PageEditorPage() {
  const params = useParams();
  const pageId = params.id as string;

  const [content, setContent] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(
    null
  );
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const pageData = pageStructure[pageId];

  useEffect(() => {
    if (pageId && pageData) {
      fetchContent();
    } else {
      setLoading(false);
    }
  }, [pageId]);

  const fetchContent = async (showRefreshNotification = false) => {
    if (showRefreshNotification) setRefreshing(true);
    try {
      const res = await fetch(`/api/admin/content?page=${pageId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setContent(Array.isArray(data) ? data : []);
      if (showRefreshNotification) {
        setMessage({
          type: 'success',
          text: 'Content refreshed successfully!',
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setContent([]);
      if (showRefreshNotification) {
        setMessage({ type: 'error', text: 'Failed to refresh content' });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getSectionContent = (section: string) => {
    return content.find((c) => c.page === pageId && c.section === section);
  };

  const openEditModal = (sectionKey: string) => {
    const sectionContent = getSectionContent(sectionKey);
    // Get default content for this page/section if available
    const defaultContent = defaultSectionContent[pageId]?.[sectionKey] || {};

    if (sectionContent) {
      setEditingSection(sectionContent);
      // Merge default content with saved content (saved takes priority)
      setEditFormData({ ...defaultContent, ...sectionContent.content });
    } else {
      setEditingSection({
        _id: '',
        page: pageId,
        section: sectionKey,
        content: defaultContent,
        updatedAt: new Date().toISOString(),
      });
      // Use default content as initial form data
      setEditFormData(defaultContent);
    }
  };

  const closeModal = () => {
    setEditingSection(null);
    setEditFormData({});
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveSection = async () => {
    if (!editingSection) return;
    setSaving(true);

    try {
      const url = editingSection._id
        ? `/api/admin/content/${editingSection._id}`
        : '/api/admin/content';
      const method = editingSection._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: editingSection.page,
          section: editingSection.section,
          content: editFormData,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Section saved successfully!' });
        await fetchContent();
        closeModal();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save section' });
    } finally {
      setSaving(false);
    }
  };

  const toggleSectionVisibility = async (
    sectionKey: string,
    visible: boolean
  ) => {
    try {
      const res = await fetch('/api/admin/content/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: pageId,
          section: sectionKey,
          visible,
        }),
      });

      if (res.ok) {
        setMessage({
          type: 'success',
          text: `Section ${visible ? 'shown' : 'hidden'} successfully!`,
        });
        await fetchContent();
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Failed to toggle visibility');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to toggle section visibility',
      });
    }
  };

  const renderFieldEditor = (
    field: string,
    value: any,
    onChange: (val: any) => void
  ) => {
    if (Array.isArray(value)) {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium capitalize text-slate-300">
            {field.replace(/([A-Z])/g, ' $1')}
          </label>
          <textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                onChange(JSON.parse(e.target.value));
              } catch {
                // Invalid JSON
              }
            }}
            rows={6}
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 font-mono text-sm text-white focus:border-[#37AFE1] focus:outline-none"
          />
          <p className="text-xs text-slate-500">Edit as JSON array</p>
        </div>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium capitalize text-slate-300">
            {field.replace(/([A-Z])/g, ' $1')}
          </label>
          <textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                onChange(JSON.parse(e.target.value));
              } catch {
                // Invalid JSON
              }
            }}
            rows={4}
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 font-mono text-sm text-white focus:border-[#37AFE1] focus:outline-none"
          />
        </div>
      );
    }

    const isLongText = typeof value === 'string' && value.length > 100;

    if (
      isLongText ||
      field.includes('description') ||
      field.includes('subtitle') ||
      field.includes('text')
    ) {
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium capitalize text-slate-300">
            {field.replace(/([A-Z])/g, ' $1')}
          </label>
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
          />
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium capitalize text-slate-300">
          {field.replace(/([A-Z])/g, ' $1')}
        </label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
        />
      </div>
    );
  };

  if (!pageData) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center">
        <p className="mb-4 text-slate-400">Page not found: {pageId}</p>
        <Link href="/admin/pages" className="text-[#37AFE1] hover:underline">
          ← Back to Pages
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/admin/pages"
            className="mb-2 flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Link>
          <h1 className="text-3xl font-bold text-white">{pageData.label}</h1>
          <p className="mt-1 text-slate-400">Edit sections for this page</p>
        </div>
        <button
          onClick={() => fetchContent(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
          />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 flex items-center justify-between rounded-lg p-4 transition-all ${
            message.type === 'success'
              ? 'border border-green-500/30 bg-green-500/20 text-green-400'
              : 'border border-red-500/30 bg-red-500/20 text-red-400'
          }`}
        >
          <span className="flex items-center gap-2">
            {message.type === 'success' && <span>✓</span>}
            {message.text}
          </span>
          <button
            onClick={() => setMessage(null)}
            className="text-xl leading-none hover:opacity-70"
          >
            &times;
          </button>
        </div>
      )}

      {/* Sections List */}
      <div className="grid gap-4">
        {pageData.sections.map((section) => {
          const sectionContent = getSectionContent(section.key);
          const hasContent = !!sectionContent;
          const isVisible = sectionContent?.visible !== false;

          return (
            <div
              key={section.key}
              className={`flex items-center gap-4 rounded-xl border border-slate-700/50 bg-[#1E293B] p-4 ${!isVisible ? 'opacity-60' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="font-semibold text-white">{section.label}</h3>
                  {hasContent ? (
                    <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                      Configured
                    </span>
                  ) : (
                    <span className="rounded bg-slate-600/50 px-2 py-0.5 text-xs text-slate-400">
                      Not set
                    </span>
                  )}
                  {!isVisible && (
                    <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                      Hidden
                    </span>
                  )}
                </div>
                {section.imagePath && (
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <ImageIcon className="h-3 w-3" />
                    <span>{section.imagePath}</span>
                  </div>
                )}
                {section.note && (
                  <div className="mt-1 text-xs text-amber-400">
                    ⚠️ {section.note}
                  </div>
                )}
              </div>

              <button
                onClick={() => toggleSectionVisibility(section.key, !isVisible)}
                className={`rounded-lg p-2 transition-colors ${
                  isVisible
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-slate-700 text-slate-400 hover:text-red-400'
                }`}
                title={isVisible ? 'Hide section' : 'Show section'}
              >
                {isVisible ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => openEditModal(section.key)}
                className="rounded-lg bg-slate-700 p-2 text-slate-300 transition-colors hover:bg-[#37AFE1] hover:text-white"
              >
                <Edit className="h-5 w-5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[#1E293B]">
            <div className="flex items-center justify-between border-b border-slate-700 p-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Edit{' '}
                  {pageData.sections.find(
                    (s) => s.key === editingSection.section
                  )?.label || editingSection.section}
                </h2>
                <p className="text-sm text-slate-400">
                  {pageData.label} / {editingSection.section}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 hover:bg-slate-700"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Image path info */}
              {pageData.sections.find((s) => s.key === editingSection.section)
                ?.imagePath && (
                <div className="mb-6 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                  <ImageIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                  <div className="text-sm text-amber-400">
                    <span className="font-medium">Images location: </span>
                    <code className="rounded bg-amber-500/20 px-1">
                      {
                        pageData.sections.find(
                          (s) => s.key === editingSection.section
                        )?.imagePath
                      }
                    </code>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Common fields */}
                {renderFieldEditor('eyebrow', editFormData.eyebrow, (val) =>
                  handleFieldChange('eyebrow', val)
                )}
                {renderFieldEditor('title', editFormData.title, (val) =>
                  handleFieldChange('title', val)
                )}
                {renderFieldEditor(
                  'titleHighlight',
                  editFormData.titleHighlight,
                  (val) => handleFieldChange('titleHighlight', val)
                )}
                {renderFieldEditor('subtitle', editFormData.subtitle, (val) =>
                  handleFieldChange('subtitle', val)
                )}

                {/* Service hero highlighted words */}
                {editingSection.section === 'hero' &&
                  pageId.startsWith('services-') && (
                    <>
                      {renderFieldEditor(
                        'highlightedWord',
                        editFormData.highlightedWord,
                        (val) => handleFieldChange('highlightedWord', val)
                      )}
                      {renderFieldEditor(
                        'highlightedWord2',
                        editFormData.highlightedWord2,
                        (val) => handleFieldChange('highlightedWord2', val)
                      )}
                      {renderFieldEditor(
                        'highlightedText',
                        editFormData.highlightedText,
                        (val) => handleFieldChange('highlightedText', val)
                      )}
                    </>
                  )}

                {/* CTA fields */}
                {(editingSection.section === 'hero' ||
                  editingSection.section === 'cta' ||
                  editingSection.section === 'video' ||
                  editingSection.section === 'techStack') && (
                  <>
                    {renderFieldEditor('ctaText', editFormData.ctaText, (val) =>
                      handleFieldChange('ctaText', val)
                    )}
                    {renderFieldEditor('ctaHref', editFormData.ctaHref, (val) =>
                      handleFieldChange('ctaHref', val)
                    )}
                    {renderFieldEditor(
                      'ctaLabel',
                      editFormData.ctaLabel,
                      (val) => handleFieldChange('ctaLabel', val)
                    )}
                  </>
                )}

                {/* Tech Stack secondary CTA */}
                {editingSection.section === 'techStack' && (
                  <>
                    {renderFieldEditor(
                      'secondaryCtaText',
                      editFormData.secondaryCtaText,
                      (val) => handleFieldChange('secondaryCtaText', val)
                    )}
                    {renderFieldEditor(
                      'secondaryCtaHref',
                      editFormData.secondaryCtaHref,
                      (val) => handleFieldChange('secondaryCtaHref', val)
                    )}
                  </>
                )}

                {/* CTA Button object for some heroes */}
                {editingSection.section === 'hero' &&
                  renderFieldEditor(
                    'ctaButton',
                    editFormData.ctaButton || { label: '', href: '' },
                    (val) => handleFieldChange('ctaButton', val)
                  )}

                {/* Video section */}
                {editingSection.section === 'video' &&
                  renderFieldEditor('videoSrc', editFormData.videoSrc, (val) =>
                    handleFieldChange('videoSrc', val)
                  )}

                {/* Case studies */}
                {editingSection.section === 'caseStudies' &&
                  renderFieldEditor(
                    'studies',
                    editFormData.studies || [],
                    (val) => handleFieldChange('studies', val)
                  )}

                {/* Performance Metrics section */}
                {editingSection.section === 'performanceMetrics' && (
                  <>
                    {renderFieldEditor(
                      'benefitsTitle',
                      editFormData.benefitsTitle,
                      (val) => handleFieldChange('benefitsTitle', val)
                    )}
                    {renderFieldEditor(
                      'metrics',
                      editFormData.metrics || [],
                      (val) => handleFieldChange('metrics', val)
                    )}
                    {renderFieldEditor(
                      'benefits',
                      editFormData.benefits || [],
                      (val) => handleFieldChange('benefits', val)
                    )}
                  </>
                )}

                {/* Services array for service hero sections */}
                {editingSection.section === 'hero' &&
                  pageId.startsWith('services-') &&
                  renderFieldEditor(
                    'services',
                    editFormData.services || [],
                    (val) => handleFieldChange('services', val)
                  )}

                {/* Floating icons */}
                {editingSection.section === 'hero' &&
                  renderFieldEditor(
                    'floatingIcons',
                    editFormData.floatingIcons || [],
                    (val) => handleFieldChange('floatingIcons', val)
                  )}

                {/* N8N Hero Cards - Requirements: 1.1 */}
                {editingSection.section === 'hero' &&
                  pageId === 'services-n8n' &&
                  renderFieldEditor('cards', editFormData.cards || [], (val) =>
                    handleFieldChange('cards', val)
                  )}

                {/* N8N Workflow Builder Section - Requirements: 2.1 */}
                {editingSection.section === 'workflowBuilder' &&
                  pageId === 'services-n8n' && (
                    <>
                      {renderFieldEditor(
                        'nodes',
                        editFormData.nodes || [],
                        (val) => handleFieldChange('nodes', val)
                      )}
                      {renderFieldEditor(
                        'nodeColors',
                        editFormData.nodeColors || {},
                        (val) => handleFieldChange('nodeColors', val)
                      )}
                    </>
                  )}

                {/* N8N Before/After Section - Requirements: 3.1, 3.2, 3.3 */}
                {editingSection.section === 'beforeAfter' &&
                  pageId === 'services-n8n' && (
                    <>
                      {renderFieldEditor(
                        'manualProcess',
                        editFormData.manualProcess || {},
                        (val) => handleFieldChange('manualProcess', val)
                      )}
                      {renderFieldEditor(
                        'automatedProcess',
                        editFormData.automatedProcess || {},
                        (val) => handleFieldChange('automatedProcess', val)
                      )}
                    </>
                  )}

                {/* N8N API Integration Section - Requirements: 4.1, 4.2, 4.3 */}
                {editingSection.section === 'apiIntegration' &&
                  pageId === 'services-n8n' && (
                    <>
                      {renderFieldEditor(
                        'circleText',
                        editFormData.circleText,
                        (val) => handleFieldChange('circleText', val)
                      )}
                      {renderFieldEditor(
                        'badgeTexts',
                        editFormData.badgeTexts || {},
                        (val) => handleFieldChange('badgeTexts', val)
                      )}
                      {renderFieldEditor(
                        'buttonTexts',
                        editFormData.buttonTexts || {},
                        (val) => handleFieldChange('buttonTexts', val)
                      )}
                      {renderFieldEditor(
                        'boxTitle',
                        editFormData.boxTitle,
                        (val) => handleFieldChange('boxTitle', val)
                      )}
                      {renderFieldEditor(
                        'lightColor',
                        editFormData.lightColor,
                        (val) => handleFieldChange('lightColor', val)
                      )}
                    </>
                  )}

                {/* Chatbot Chat Demo Section */}
                {editingSection.section === 'chatDemo' &&
                  pageId === 'services-chatbot' && (
                    <>
                      {renderFieldEditor(
                        'initialMessage',
                        editFormData.initialMessage,
                        (val) => handleFieldChange('initialMessage', val)
                      )}
                      {renderFieldEditor(
                        'inputPlaceholder',
                        editFormData.inputPlaceholder,
                        (val) => handleFieldChange('inputPlaceholder', val)
                      )}
                      {renderFieldEditor(
                        'sendButtonText',
                        editFormData.sendButtonText,
                        (val) => handleFieldChange('sendButtonText', val)
                      )}
                      {renderFieldEditor(
                        'typingIndicatorText',
                        editFormData.typingIndicatorText,
                        (val) => handleFieldChange('typingIndicatorText', val)
                      )}
                      {renderFieldEditor(
                        'aiResponses',
                        editFormData.aiResponses || [],
                        (val) => handleFieldChange('aiResponses', val)
                      )}
                      {renderFieldEditor(
                        'userMessageColor',
                        editFormData.userMessageColor,
                        (val) => handleFieldChange('userMessageColor', val)
                      )}
                      {renderFieldEditor(
                        'aiMessageColor',
                        editFormData.aiMessageColor,
                        (val) => handleFieldChange('aiMessageColor', val)
                      )}
                    </>
                  )}

                {/* Chatbot Learning Animation Section */}
                {editingSection.section === 'learningAnimation' &&
                  pageId === 'services-chatbot' && (
                    <>
                      {renderFieldEditor(
                        'layers',
                        editFormData.layers || [],
                        (val) => handleFieldChange('layers', val)
                      )}
                      {renderFieldEditor(
                        'processSteps',
                        editFormData.processSteps || [],
                        (val) => handleFieldChange('processSteps', val)
                      )}
                      {renderFieldEditor(
                        'stageLabels',
                        editFormData.stageLabels || {},
                        (val) => handleFieldChange('stageLabels', val)
                      )}
                    </>
                  )}

                {/* Chatbot Accuracy Chart Section */}
                {editingSection.section === 'accuracyChart' &&
                  pageId === 'services-chatbot' && (
                    <>
                      {renderFieldEditor(
                        'metrics',
                        editFormData.metrics || [],
                        (val) => handleFieldChange('metrics', val)
                      )}
                      {renderFieldEditor(
                        'chartConfig',
                        editFormData.chartConfig || {},
                        (val) => handleFieldChange('chartConfig', val)
                      )}
                    </>
                  )}

                {/* Web Design Style Showcase Section */}
                {editingSection.section === 'styleShowcase' &&
                  pageId === 'services-webdesign' && (
                    <>
                      {renderFieldEditor(
                        'featureCards',
                        editFormData.featureCards || [],
                        (val) => handleFieldChange('featureCards', val)
                      )}
                      {renderFieldEditor(
                        'brandTitle',
                        editFormData.brandTitle,
                        (val) => handleFieldChange('brandTitle', val)
                      )}
                      {renderFieldEditor(
                        'brandDescription',
                        editFormData.brandDescription,
                        (val) => handleFieldChange('brandDescription', val)
                      )}
                      {renderFieldEditor(
                        'colorSchemes',
                        editFormData.colorSchemes || [],
                        (val) => handleFieldChange('colorSchemes', val)
                      )}
                      {renderFieldEditor(
                        'fonts',
                        editFormData.fonts || [],
                        (val) => handleFieldChange('fonts', val)
                      )}
                    </>
                  )}

                {/* WordPress Metrics Section */}
                {editingSection.section === 'metrics' &&
                  pageId === 'services-wordpress' && (
                    <>
                      {renderFieldEditor(
                        'metrics',
                        editFormData.metrics || [],
                        (val) => handleFieldChange('metrics', val)
                      )}
                    </>
                  )}

                {/* WordPress Plugin Constellation Section */}
                {editingSection.section === 'pluginConstellation' &&
                  pageId === 'services-wordpress' && (
                    <>
                      {renderFieldEditor(
                        'plugins',
                        editFormData.plugins || [],
                        (val) => handleFieldChange('plugins', val)
                      )}
                      {renderFieldEditor(
                        'categoryColors',
                        editFormData.categoryColors || [],
                        (val) => handleFieldChange('categoryColors', val)
                      )}
                      {renderFieldEditor(
                        'legendTitle',
                        editFormData.legendTitle,
                        (val) => handleFieldChange('legendTitle', val)
                      )}
                      {renderFieldEditor(
                        'instructionText',
                        editFormData.instructionText,
                        (val) => handleFieldChange('instructionText', val)
                      )}
                    </>
                  )}

                {/* SaaS Hero Section */}
                {editingSection.section === 'hero' &&
                  pageId === 'services-saas' && (
                    <>
                      {renderFieldEditor('badge', editFormData.badge, (val) =>
                        handleFieldChange('badge', val)
                      )}
                      {renderFieldEditor(
                        'description',
                        editFormData.description,
                        (val) => handleFieldChange('description', val)
                      )}
                      {renderFieldEditor(
                        'primaryCta',
                        editFormData.primaryCta || { text: '', href: '' },
                        (val) => handleFieldChange('primaryCta', val)
                      )}
                      {renderFieldEditor(
                        'secondaryCta',
                        editFormData.secondaryCta || { text: '', href: '' },
                        (val) => handleFieldChange('secondaryCta', val)
                      )}
                      {renderFieldEditor('image', editFormData.image, (val) =>
                        handleFieldChange('image', val)
                      )}
                      {renderFieldEditor(
                        'imageAlt',
                        editFormData.imageAlt,
                        (val) => handleFieldChange('imageAlt', val)
                      )}
                    </>
                  )}

                {/* SaaS Features Section */}
                {editingSection.section === 'features' &&
                  pageId === 'services-saas' && (
                    <>
                      {renderFieldEditor(
                        'features',
                        editFormData.features || [],
                        (val) => handleFieldChange('features', val)
                      )}
                    </>
                  )}

                {/* SaaS Solutions Section */}
                {editingSection.section === 'solutions' &&
                  pageId === 'services-saas' && (
                    <>
                      {renderFieldEditor(
                        'solutions',
                        editFormData.solutions || [],
                        (val) => handleFieldChange('solutions', val)
                      )}
                    </>
                  )}

                {/* Homepage Value Proposition Section */}
                {editingSection.section === 'valueProposition' &&
                  pageId === 'home' && (
                    <>
                      {renderFieldEditor(
                        'colors',
                        editFormData.colors || {
                          cardBackground: '#1E293B',
                          cardAccentColor: '#37AFE1',
                          cardHoverAccentColor: '#F58122',
                          particleColor: '#37AFE1',
                          connectionLineStart: '#37AFE1',
                          connectionLineEnd: '#F58122',
                        },
                        (val) => handleFieldChange('colors', val)
                      )}
                      {renderFieldEditor(
                        'services',
                        editFormData.services || [],
                        (val) => handleFieldChange('services', val)
                      )}
                    </>
                  )}

                {/* Homepage Service Cards Section */}
                {editingSection.section === 'serviceCards' &&
                  pageId === 'home' && (
                    <>
                      {renderFieldEditor(
                        'colors',
                        editFormData.colors || {
                          cardBackground: '#1E293B',
                          cardAccentColor: '#37AFE1',
                          cardHoverAccentColor: '#F58122',
                          particleColor: '#37AFE1',
                          featureDotColor: '#37AFE1',
                          linkColor: '#37AFE1',
                          linkHoverColor: '#F58122',
                          borderColor: '#334155',
                        },
                        (val) => handleFieldChange('colors', val)
                      )}
                      {renderFieldEditor(
                        'cards',
                        editFormData.cards || [],
                        (val) => handleFieldChange('cards', val)
                      )}
                    </>
                  )}

                {/* Homepage Featured Services Section */}
                {editingSection.section === 'featuredServices' &&
                  pageId === 'home' && (
                    <>
                      {renderFieldEditor(
                        'services',
                        editFormData.services || [],
                        (val) => handleFieldChange('services', val)
                      )}
                    </>
                  )}

                {/* Homepage Connect Section */}
                {editingSection.section === 'connect' && pageId === 'home' && (
                  <>
                    {renderFieldEditor('email', editFormData.email, (val) =>
                      handleFieldChange('email', val)
                    )}
                    {renderFieldEditor(
                      'whatsapp',
                      editFormData.whatsapp,
                      (val) => handleFieldChange('whatsapp', val)
                    )}
                    {renderFieldEditor(
                      'services',
                      editFormData.services || [],
                      (val) => handleFieldChange('services', val)
                    )}
                  </>
                )}

                {/* Homepage Testimonials Section */}
                {editingSection.section === 'testimonials' &&
                  pageId === 'home' && (
                    <>
                      {renderFieldEditor(
                        'stats',
                        editFormData.stats || [],
                        (val) => handleFieldChange('stats', val)
                      )}
                    </>
                  )}

                {/* Homepage CTA Section */}
                {editingSection.section === 'cta' && pageId === 'home' && (
                  <>
                    {renderFieldEditor(
                      'secondaryCtaText',
                      editFormData.secondaryCtaText,
                      (val) => handleFieldChange('secondaryCtaText', val)
                    )}
                    {renderFieldEditor(
                      'secondaryCtaLink',
                      editFormData.secondaryCtaLink,
                      (val) => handleFieldChange('secondaryCtaLink', val)
                    )}
                    {renderFieldEditor(
                      'stats',
                      editFormData.stats || [],
                      (val) => handleFieldChange('stats', val)
                    )}
                  </>
                )}

                {/* Homepage Stack Feature Section (Orbit Animation) */}
                {editingSection.section === 'stackFeature' &&
                  pageId === 'home' && (
                    <>
                      {renderFieldEditor(
                        'ctaText',
                        editFormData.ctaText,
                        (val) => handleFieldChange('ctaText', val)
                      )}
                      {renderFieldEditor(
                        'ctaHref',
                        editFormData.ctaHref,
                        (val) => handleFieldChange('ctaHref', val)
                      )}
                      {renderFieldEditor(
                        'secondaryCtaText',
                        editFormData.secondaryCtaText,
                        (val) => handleFieldChange('secondaryCtaText', val)
                      )}
                      {renderFieldEditor(
                        'secondaryCtaHref',
                        editFormData.secondaryCtaHref,
                        (val) => handleFieldChange('secondaryCtaHref', val)
                      )}
                      {renderFieldEditor(
                        'centerText',
                        editFormData.centerText,
                        (val) => handleFieldChange('centerText', val)
                      )}
                      {renderFieldEditor(
                        'colors',
                        editFormData.colors || {
                          borderColor: '#37AFE1',
                          orbitBorderColor: '#37AFE1',
                          iconBgColor: '#0F172A',
                          iconBorderColor: '#37AFE1',
                          gradientStart: '#F58122',
                          gradientEnd: '#37AFE1',
                        },
                        (val) => handleFieldChange('colors', val)
                      )}
                      {renderFieldEditor(
                        'icons',
                        editFormData.icons || [],
                        (val) => handleFieldChange('icons', val)
                      )}
                    </>
                  )}

                {/* Any other fields */}
                {Object.entries(editFormData)
                  .filter(
                    ([key]) =>
                      ![
                        'eyebrow',
                        'title',
                        'titleHighlight',
                        'subtitle',
                        'ctaText',
                        'ctaHref',
                        'ctaLink',
                        'ctaLabel',
                        'videoSrc',
                        'studies',
                        'services',
                        'floatingIcons',
                        'highlightedWord',
                        'highlightedWord2',
                        'highlightedText',
                        'ctaButton',
                        'secondaryCtaText',
                        'secondaryCtaHref',
                        'metrics',
                        'benefits',
                        'benefitsTitle',
                        // N8N-specific fields
                        'cards',
                        'nodes',
                        'nodeColors',
                        'manualProcess',
                        'automatedProcess',
                        'circleText',
                        'badgeTexts',
                        'buttonTexts',
                        'boxTitle',
                        'lightColor',
                        // Chatbot-specific fields
                        'initialMessage',
                        'inputPlaceholder',
                        'sendButtonText',
                        'typingIndicatorText',
                        'aiResponses',
                        'userMessageColor',
                        'aiMessageColor',
                        'layers',
                        'processSteps',
                        'stageLabels',
                        'chartConfig',
                        // Web Design Style Showcase fields
                        'featureCards',
                        'brandTitle',
                        'brandDescription',
                        'colorSchemes',
                        'fonts',
                        // WordPress-specific fields
                        'plugins',
                        'categoryColors',
                        'legendTitle',
                        'instructionText',
                        // SaaS-specific fields
                        'badge',
                        'description',
                        'primaryCta',
                        'secondaryCta',
                        'image',
                        'imageAlt',
                        'features',
                        'solutions',
                        // Homepage-specific fields
                        'colors',
                        'email',
                        'whatsapp',
                        'stats',
                        'secondaryCtaLink',
                        'centerText',
                        'icons',
                      ].includes(key)
                  )
                  .map(([key, value]) => (
                    <div key={key}>
                      {renderFieldEditor(key, value, (val) =>
                        handleFieldChange(key, val)
                      )}
                    </div>
                  ))}

                {/* Add new field */}
                <div className="border-t border-slate-700 pt-4">
                  <p className="mb-2 text-sm text-slate-500">
                    Add custom field:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Field name"
                      id="newFieldName"
                      className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white focus:border-[#37AFE1] focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(
                          'newFieldName'
                        ) as HTMLInputElement;
                        if (input.value) {
                          handleFieldChange(input.value, '');
                          input.value = '';
                        }
                      }}
                      className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-700 p-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-slate-400 transition-colors hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveSection}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-6 py-2 text-white transition-colors hover:bg-[#37AFE1]/80 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
