import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useBlog } from '../contexts/BlogContext';
export const BlogDetailPage = ({ blogId, onNavigate }) => {
    const { getBlogById, getPublishedBlogs } = useBlog();
    const blog = getBlogById(blogId);
    const relatedBlogs = getPublishedBlogs().filter(b => b.id !== blogId).slice(0, 3);
    if (!blog) {
        return (<div className="min-h-screen bg-white pt-24 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl mb-4">Blog Post Not Found</h1>
          <Button onClick={() => onNavigate('blog')} className="bg-red-500 hover:bg-red-600">
            <ArrowLeft className="mr-2 w-4 h-4"/>
            Back to Blog
          </Button>
        </div>
      </div>);
    }
    const handleShare = (platform) => {
        const url = window.location.href;
        const text = blog.title;
        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
                break;
        }
    };
    return (<div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Button onClick={() => onNavigate('blog')} variant="ghost" className="group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform"/>
            Back to All Posts
          </Button>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Badge className="mb-4 bg-red-500 text-white">{blog.category}</Badge>
            <h1 className="text-5xl md:text-6xl text-black mb-6">{blog.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{blog.excerpt}</p>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 border-b">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5"/>
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5"/>
                <span>{new Date(blog.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</span>
              </div>
              {blog.readTime && (<div className="flex items-center gap-2">
                  <Clock className="w-5 h-5"/>
                  <span>{blog.readTime}</span>
                </div>)}
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mb-12">
            <img src={blog.image} alt={blog.title} className="w-full h-96 object-cover rounded-2xl shadow-2xl"/>
          </motion.div>

          {/* Content */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="prose prose-lg max-w-none mb-12">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {blog.content.split('\n').map((line, index) => {
            // Handle markdown-style headers
            if (line.startsWith('# ')) {
                return <h1 key={index} className="text-4xl mt-8 mb-4 text-black">{line.substring(2)}</h1>;
            }
            else if (line.startsWith('## ')) {
                return <h2 key={index} className="text-3xl mt-6 mb-3 text-black">{line.substring(3)}</h2>;
            }
            else if (line.startsWith('### ')) {
                return <h3 key={index} className="text-2xl mt-4 mb-2 text-black">{line.substring(4)}</h3>;
            }
            else if (line.startsWith('> ')) {
                return (<blockquote key={index} className="border-l-4 border-red-500 pl-4 italic my-4 text-gray-600 bg-gray-50 py-2">
                      {line.substring(2)}
                    </blockquote>);
            }
            else if (line.startsWith('- ') || line.startsWith('* ')) {
                return <li key={index} className="ml-4">{line.substring(2)}</li>;
            }
            else if (line.startsWith('✅ ') || line.startsWith('❌ ')) {
                return <li key={index} className="ml-4">{line}</li>;
            }
            else if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                return <p key={index} className="my-2"><strong>{line.replace(/\*\*/g, '')}</strong></p>;
            }
            else if (line.trim() === '') {
                return <br key={index}/>;
            }
            else if (line.trim() === '---') {
                return <hr key={index} className="my-8 border-gray-300"/>;
            }
            else {
                return <p key={index} className="my-3">{line}</p>;
            }
        })}
            </div>
          </motion.div>

          {/* Share Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="border-t border-b py-6 mb-12">
            <div className="flex items-center gap-4">
              <Share2 className="w-5 h-5 text-gray-600"/>
              <span className="text-gray-600">Share this article:</span>
              <Button onClick={() => handleShare('facebook')} variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                <Facebook className="w-4 h-4 mr-2"/>
                Facebook
              </Button>
              <Button onClick={() => handleShare('twitter')} variant="outline" size="sm" className="hover:bg-sky-50 hover:text-sky-600">
                <Twitter className="w-4 h-4 mr-2"/>
                Twitter
              </Button>
              <Button onClick={() => handleShare('linkedin')} variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-700">
                <Linkedin className="w-4 h-4 mr-2"/>
                LinkedIn
              </Button>
            </div>
          </motion.div>

          {/* Author Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-gradient-to-br from-red-50 to-white border-2 border-red-100 mb-12">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center text-2xl">
                    {blog.author.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl text-black mb-1">Written by {blog.author}</h3>
                    <p className="text-gray-600">
                      Part of the KWICK team dedicated to helping delivery partners succeed and earn more.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <h2 className="text-3xl text-black mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (<Card key={relatedBlog.id} className="hover:shadow-xl transition-all cursor-pointer border hover:border-red-500" onClick={() => onNavigate(`blog-detail-${relatedBlog.id}`)}>
                    <div className="h-40 bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `url(${relatedBlog.image})` }}/>
                    <CardContent className="p-4">
                      <Badge className="mb-2 bg-gray-100 text-gray-700 text-xs">
                        {relatedBlog.category}
                      </Badge>
                      <h3 className="text-lg text-black mb-2 line-clamp-2">{relatedBlog.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{relatedBlog.excerpt}</p>
                    </CardContent>
                  </Card>))}
              </div>
            </motion.div>)}

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-12">
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl mb-4">Ready to Start Earning with KWICK?</h2>
                <p className="text-lg mb-6 text-white/90">
                  Join thousands of delivery partners earning ₹15,000-₹50,000 monthly
                </p>
                <Button onClick={() => onNavigate('rent-vehicle')} className="bg-white text-red-500 hover:bg-gray-100" size="lg">
                  Get Started Today
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>);
};
