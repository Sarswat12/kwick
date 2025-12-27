import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, User, ArrowRight, TrendingUp } from "lucide-react";
const blogPosts = [
    {
        id: 1,
        title: "How to Earn ₹50,000 Monthly with KWICK EV",
        excerpt: "Learn the strategies our top riders use to maximize their earnings through multiple delivery platforms.",
        category: "Earnings Guide",
        author: "KWICK Team",
        date: "Jan 15, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800",
        featured: true
    },
    {
        id: 2,
        title: "Battery Swapping 101: Everything You Need to Know",
        excerpt: "Complete guide to using KWICK's 50+ battery swap stations across Delhi NCR.",
        category: "Guide",
        author: "Tech Team",
        date: "Jan 12, 2025",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1660804369326-ead78d89b07d?w=800"
    },
    {
        id: 3,
        title: "Success Story: From ₹15K to ₹45K in 6 Months",
        excerpt: "Meet Rajesh Kumar who transformed his life with KWICK EV rental platform.",
        category: "Success Story",
        author: "Marketing Team",
        date: "Jan 10, 2025",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1607130232670-52123ba5be5c?w=800"
    },
    {
        id: 4,
        title: "Environmental Impact: 5000kg CO2 Saved Monthly",
        excerpt: "How KWICK riders are contributing to a cleaner, greener India every single day.",
        category: "Environment",
        author: "Sustainability Team",
        date: "Jan 8, 2025",
        readTime: "3 min read",
        image: "https://images.unsplash.com/photo-1675415782443-32685e238b1c?w=800"
    },
    {
        id: 5,
        title: "Top 10 Tips for New KWICK Riders",
        excerpt: "Essential advice for delivery partners just starting their journey with KWICK.",
        category: "Tips & Tricks",
        author: "Community Team",
        date: "Jan 5, 2025",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800"
    },
    {
        id: 6,
        title: "Understanding Your Rental Agreement",
        excerpt: "A comprehensive breakdown of KWICK's flexible rental plans and terms.",
        category: "Legal",
        author: "Legal Team",
        date: "Jan 3, 2025",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1583322319396-08178ea4f8b3?w=800"
    }
];
export function BlogPage({ onNavigate }) {
    const handleReadMore = (postId) => {
        // Build blog id in the same format used by BlogContext (e.g. BLOG001)
        const blogId = `BLOG${String(postId).padStart(3, '0')}`;
        // If parent provided onNavigate, use the app router convention 'blog-detail-<id>'
        if (onNavigate) {
            onNavigate(`blog-detail-${blogId}`);
            // Delay the scroll a bit so the new page can render before we scroll to top
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
            return;
        }
        // Fallback behavior
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
        console.log(`Read post ${blogId}`);
    };
    return (<div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <Badge className="mb-4 bg-red-100 text-red-600 border-red-200">
            📰 KWICK Blog
          </Badge>
          <h1 className="text-5xl md:text-6xl text-black mb-6">
            Stories, Tips & <span className="text-red-500">Insights</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert advice, success stories, and everything you need to maximize your earnings with KWICK
          </p>
        </motion.div>

        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map((post, index) => (<motion.div key={post.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16">
            <Card className="overflow-hidden border-2 hover:border-red-500 transition-all hover:shadow-2xl">
              <div className="grid md:grid-cols-2">
                <div className="h-64 md:h-auto bg-cover bg-center" style={{ backgroundImage: `url(${post.image})` }}/>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-red-500 text-white">{post.category}</Badge>
                  <h2 className="text-3xl text-black mb-4">{post.title}</h2>
                  <p className="text-gray-600 mb-6">{post.excerpt}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4"/>
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4"/>
                      {post.date}
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <Button className="w-fit bg-red-500 hover:bg-red-600" onClick={() => handleReadMore(post.id)}>
                    Read Full Article
                    <ArrowRight className="ml-2 w-4 h-4"/>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>))}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.filter(post => !post.featured).map((post, index) => (<motion.div key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}>
              <Card className="h-full hover:shadow-2xl transition-all overflow-hidden border hover:border-red-500">
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${post.image})` }}/>
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-gray-100 text-gray-700">{post.category}</Badge>
                  <h3 className="text-xl text-black mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3"/>
                      {post.date}
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <Button variant="ghost" className="w-full group" onClick={() => handleReadMore(post.id)}>
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>))}
        </div>

        {/* Categories */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 text-center">
          <h2 className="text-3xl text-black mb-8">Browse by Category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["All Posts", "Earnings Guide", "Success Stories", "Tips & Tricks", "Environment", "Legal"].map((category, index) => (<Button key={index} variant={index === 0 ? "default" : "outline"} className={index === 0 ? "bg-red-500 hover:bg-red-600" : ""}>
                {category}
              </Button>))}
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20">
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-6"/>
              <h2 className="text-3xl mb-4">Stay Updated with KWICK</h2>
              <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
                Get the latest tips, success stories, and earning strategies delivered to your inbox
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg text-black"/>
                <Button className="bg-white text-red-500 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>);
}
