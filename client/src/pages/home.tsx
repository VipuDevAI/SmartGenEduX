import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Brain, ClipboardCheck, School, MessageCircle, Globe, Zap, Users, Shield, Sparkles, Linkedin, Twitter, Facebook, Instagram, Mail, Phone, MapPin, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import logoImage from "@assets/SmartGenEduX_1766967657455.jpg";
import parikshanLogo from "@assets/Black_White_Simple_Minimal_Flat_AI_Robot_Technology_Logo_20251_1766969823581.png";
import connectoLogo from "@assets/20251211_070350_0000_1766969807619.png";

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme(theme === "light" ? "dark" : "light");
  return { theme, toggle };
}

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-card shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <a href="#home" className="flex items-center gap-2" data-testid="link-home-logo">
            <img src={logoImage} alt="SmartGenEduX" className="h-10 w-10 rounded-md object-cover" />
            <span className="font-heading font-bold text-xl text-brand-text dark:text-white hidden sm:block">
              SmartGenEduX
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-medium text-brand-text/80 dark:text-white/80 hover:text-brand-blue dark:hover:text-brand-blue transition-colors"
                data-testid={`link-nav-${link.name.toLowerCase()}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggle}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <a href="#">
              <Button variant="outline" className="hidden sm:flex" data-testid="button-login">
                Login
              </Button>
            </a>
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 rounded-md font-medium text-brand-text dark:text-white hover:bg-brand-blue/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                  data-testid={`link-mobile-nav-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </a>
              ))}
              <a href="#" className="mt-2">
                <Button variant="outline" className="w-full" data-testid="button-mobile-login">
                  Login
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-slide-up">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-brand-text dark:text-white leading-tight mb-6">
              <span className="gradient-text">SmartGenEduX</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl">Smart Automation for Schools</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Happy Automation. Better Outcomes.
              <br />
              Transform your school with AI-powered solutions that make education smarter, faster, and more efficient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#products">
                <Button
                  size="lg"
                  className="gradient-blue-orange text-white border-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  data-testid="button-get-started"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#products">
                <Button
                  size="lg"
                  className="gradient-green-blue text-white border-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  data-testid="button-explore-products"
                >
                  Explore Products
                </Button>
              </a>
            </div>
          </div>

          <div className="relative animate-float hidden lg:block">
            <div className="relative">
              <img
                src={logoImage}
                alt="SmartGenEduX AI Education"
                className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-brand-orange rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: "0.3s" }}>
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: "0.6s" }}>
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  icon: typeof Brain;
  title: string;
  description: string;
  features: string[];
  isActive: boolean;
  appLink?: string;
  logoImage?: string;
}

function ProductCard({ icon: Icon, title, description, features, isActive, appLink, logoImage }: ProductCardProps) {
  return (
    <Card className="glass-card p-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 overflow-hidden ${
        isActive ? "gradient-blue-orange" : "bg-muted"
      }`}>
        {logoImage ? (
          <img src={logoImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Icon className={`h-8 w-8 ${isActive ? "text-white" : "text-muted-foreground"}`} />
        )}
      </div>
      
      <h3 className="font-heading font-bold text-xl text-brand-text dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-4 text-sm">
        {description}
      </p>
      
      <ul className="space-y-1 mb-6">
        {features.slice(0, 3).map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-brand-green" : "bg-muted-foreground/50"}`} />
            {feature}
          </li>
        ))}
        {features.length > 3 && (
          <li className="text-sm text-brand-blue dark:text-brand-blue">+{features.length - 3} more features</li>
        )}
      </ul>
      
      <div className="flex flex-col gap-2">
        {isActive ? (
          <>
            <a href={appLink || "#"}>
              <Button 
                className="w-full gradient-blue-orange text-white border-0 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                data-testid={`button-open-${title.toLowerCase().replace(/\s/g, "-")}`}
              >
                Open App
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </a>
            <a href="#">
              <Button 
                variant="outline" 
                className="w-full rounded-full font-semibold"
                data-testid={`button-learn-${title.toLowerCase().replace(/\s/g, "-")}`}
              >
                Learn More
              </Button>
            </a>
          </>
        ) : (
          <>
            <Button 
              disabled 
              className="w-full rounded-full font-semibold opacity-60 cursor-not-allowed"
              data-testid={`button-coming-soon-${title.toLowerCase().replace(/\s/g, "-")}`}
            >
              Coming Soon
            </Button>
            <Button 
              variant="outline" 
              disabled 
              className="w-full rounded-full font-semibold opacity-60 cursor-not-allowed"
              data-testid={`button-learn-disabled-${title.toLowerCase().replace(/\s/g, "-")}`}
            >
              Learn More
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

function Products() {
  const products = [
    {
      icon: Brain,
      title: "ParikshanAI",
      description: "AI-powered school management with intelligent automation for daily operations.",
      features: [
        "Smart Timetable Generation",
        "Auto Substitution Management",
        "Discipline AI Monitoring",
        "Attendance Tracking",
        "Uniform Compliance Check",
        "Mood Detection System",
        "Teacher-less Classroom Support",
        "Multi-tenancy Architecture"
      ],
      isActive: true,
      appLink: "https://parikshan-ai.onrender.com/",
      logoImage: parikshanLogo
    },
    {
      icon: ClipboardCheck,
      title: "School SAFAL",
      description: "Comprehensive CBSE SAFAL mock test platform with detailed analytics.",
      features: [
        "CBSE SAFAL Mock Tests",
        "Performance Analytics",
        "Multi-tenancy Support",
        "Student Progress Tracking"
      ],
      isActive: true,
      appLink: "https://school-safal.onrender.com/"
    },
    {
      icon: Globe,
      title: "SiteForgeAI",
      description: "AI-powered website builder designed specifically for schools and colleges.",
      features: [
        "AI-Generated School Websites",
        "Drag & Drop Builder",
        "Mobile Responsive Design",
        "Custom Domain Support",
        "SEO Optimization"
      ],
      isActive: false
    },
    {
      icon: School,
      title: "Patashala ERP",
      description: "Complete school ERP solution with 18+ integrated modules.",
      features: [
        "Student Management",
        "Fee Management",
        "Exam Management",
        "Library Management",
        "Transport Management",
        "HR & Payroll",
        "18+ Modules"
      ],
      isActive: false
    },
    {
      icon: MessageCircle,
      title: "Connecto",
      description: "Real-time communication platform designed for school communities.",
      features: [
        "Live Chat for Schools",
        "Parent-Teacher Connect",
        "Group Messaging",
        "Announcement System"
      ],
      isActive: false,
      logoImage: connectoLogo
    }
  ];

  return (
    <section id="products" className="py-20 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-text dark:text-white mb-4">
            Our <span className="gradient-text">Products</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our suite of AI-powered solutions designed to transform how schools operate and educate.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <div key={product.title} className="animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySmartGenEduX() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Automation",
      description: "Leverage cutting-edge AI to automate routine tasks and focus on what matters most - education."
    },
    {
      icon: Users,
      title: "Multi-Tenancy Support",
      description: "Deploy once, serve multiple schools. Our architecture scales with your needs efficiently."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security ensures your data is protected with industry-leading standards."
    },
    {
      icon: Sparkles,
      title: "Modern Interface",
      description: "Beautiful, intuitive design that makes complex operations simple for everyone."
    }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-brand-text dark:text-white mb-4">
            Why <span className="gradient-text">SmartGenEduX</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine innovation with reliability to deliver solutions that schools can trust.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={feature.title}
              className="glass-card p-6 rounded-2xl text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="w-14 h-14 mx-auto rounded-2xl gradient-green-blue flex items-center justify-center mb-4">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-brand-text dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" }
  ];
  
  const products = [
    { name: "ParikshanAI", href: "https://parikshan-ai.onrender.com/" },
    { name: "School SAFAL", href: "https://school-safal.onrender.com/" },
    { name: "SiteForgeAI", href: "#", comingSoon: true },
    { name: "Patashala ERP", href: "#", comingSoon: true },
    { name: "Connecto", href: "#", comingSoon: true }
  ];

  return (
    <footer id="contact" className="bg-brand-text dark:bg-card py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImage} alt="SmartGenEduX" className="h-10 w-10 rounded-md" />
              <span className="font-heading font-bold text-xl text-white">SmartGenEduX</span>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Happy Automation. Better Outcomes.
              <br />
              Transforming education with AI-powered solutions.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors" data-testid="link-social-linkedin">
                <Linkedin className="h-4 w-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors" data-testid="link-social-twitter">
                <Twitter className="h-4 w-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors" data-testid="link-social-facebook">
                <Facebook className="h-4 w-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors" data-testid="link-social-instagram">
                <Instagram className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/70 hover:text-white transition-colors text-sm" data-testid={`link-footer-${link.name.toLowerCase()}`}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2">
              {products.map((product) => (
                <li key={product.name} className="flex items-center gap-2">
                  <a href={product.href} className="text-white/70 hover:text-white transition-colors text-sm" data-testid={`link-footer-${product.name.toLowerCase().replace(/\s/g, "-")}`}>
                    {product.name}
                  </a>
                  {product.comingSoon && (
                    <span className="text-xs bg-brand-orange/20 text-brand-orange px-2 py-0.5 rounded-full">Soon</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Mail className="h-4 w-4 text-brand-blue" />
                vipulabalaji2022@gmail.com
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Phone className="h-4 w-4 text-brand-green" />
                +91 99529 12772
              </li>
              <li className="flex items-start gap-2 text-white/70 text-sm">
                <MapPin className="h-4 w-4 text-brand-orange mt-0.5 flex-shrink-0" />
                <span>12/47, Brindavanam Flats, F2, NGO Colony, Kamakoti Street, Chromepet, Chennai - 600044, Tamil Nadu</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/50 text-xs">
                MSME Reg: UDYAM-TN-34-0088173
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/50 text-sm">
            &copy; {currentYear} SmartGenEduX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Products />
      <WhySmartGenEduX />
      <Footer />
    </div>
  );
}