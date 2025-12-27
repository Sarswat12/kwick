import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, FileDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { AdminSidebar } from './AdminSidebar';
import { useBlog } from '../../contexts/BlogContext';
import { motion } from 'motion/react';
export const BlogCMSPanel = ({ onNavigate }) => {
    const { blogs, addBlog, updateBlog, deleteBlog } = useBlog();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        category: '',
        image: '',
        readTime: '',
        status: 'draft',
        featured: false,
    });
    const handleSubmit = () => {
        if (editingBlog) {
            const updatedBlog = {
                ...editingBlog,
                ...formData,
            };
            updateBlog(editingBlog.id, updatedBlog);
            alert('Blog updated successfully!');
        }
        else {
            const newBlog = {
                id: `BLOG${String(blogs.length + 1).padStart(3, '0')}`,
                date: new Date().toISOString().split('T')[0],
                ...formData,
            };
            addBlog(newBlog);
            alert('Blog created successfully!');
        }
        setIsModalOpen(false);
        setEditingBlog(null);
        resetForm();
    };
    const resetForm = () => {
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            author: '',
            category: '',
            image: '',
            readTime: '',
            status: 'draft',
            featured: false,
        });
    };
    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            author: blog.author,
            category: blog.category,
            image: blog.image,
            readTime: blog.readTime || '',
            status: blog.status,
            featured: blog.featured || false,
        });
        setIsModalOpen(true);
    };
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this blog post?')) {
            deleteBlog(id);
            alert('Blog deleted successfully!');
        }
    };
    const handleView = (blogId) => {
        onNavigate(`blog-detail-${blogId}`);
    };
    const exportBlogs = () => {
        const dataStr = JSON.stringify(blogs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `kwick-blogs-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        alert('Blogs exported successfully!');
    };
    return (<div className="min-h-screen bg-gray-50">
      <AdminSidebar currentPage="admin-blog" onNavigate={onNavigate}/>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 p-6 space-y-6 min-h-screen" style={{ marginLeft: 'var(--admin-sidebar-width, 280px)', transition: 'margin-left 0.3s' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl">Blog CMS</h2>
            <p className="text-gray-500">Create and manage blog posts ({blogs.length} total)</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportBlogs} variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
              <FileDown className="w-4 h-4 mr-2"/>
              Export Blogs
            </Button>
            <Button onClick={() => { resetForm(); setEditingBlog(null); setIsModalOpen(true); }} className="bg-red-500 hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2"/>
              New Blog Post
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (<Card key={blog.id} className="hover:shadow-xl transition-all">
              <CardContent className="p-0">
                <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover rounded-t-lg"/>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2">
                      <Badge className={blog.status === 'published' ? 'bg-green-500' : 'bg-gray-500'}>
                        {blog.status}
                      </Badge>
                      {blog.featured && (<Badge className="bg-yellow-500">Featured</Badge>)}
                    </div>
                    <span className="text-xs text-gray-500">{blog.date}</span>
                  </div>
                  <h3 className="mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{blog.excerpt}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    <span>{blog.category}</span> • <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleView(blog.id)} variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1"/>
                      View
                    </Button>
                    <Button onClick={() => handleEdit(blog)} variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1"/>
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(blog.id)} variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4"/>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>))}
        </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
            <DialogDescription>
              {editingBlog ? 'Update the blog post details' : 'Create a new blog post for the KWICK platform'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter blog title" required/>
            </div>
            <div>
              <Label>Excerpt *</Label>
              <Input value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Short description" required/>
            </div>
            <div>
              <Label>Content (Supports Markdown) *</Label>
              <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Full blog content... Use # for headers, > for quotes, - for bullets" rows={15} required/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Author *</Label>
                <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} placeholder="Author name" required/>
              </div>
              <div>
                <Label>Category *</Label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded-lg" required>
                  <option value="">Select Category</option>
                  <option value="Earnings Guide">Earnings Guide</option>
                  <option value="Success Story">Success Story</option>
                  <option value="Tips & Tricks">Tips & Tricks</option>
                  <option value="Environment">Environment</option>
                  <option value="Legal">Legal</option>
                  <option value="Guide">Guide</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Image URL *</Label>
                <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://images.unsplash.com/..." required/>
              </div>
              <div>
                <Label>Read Time</Label>
                <Input value={formData.readTime} onChange={(e) => setFormData({ ...formData, readTime: e.target.value })} placeholder="5 min read"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status *</Label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full p-2 border rounded-lg">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4"/>
                <Label htmlFor="featured" className="cursor-pointer">Mark as Featured</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1 bg-red-500 hover:bg-red-600" disabled={!formData.title || !formData.excerpt || !formData.content}>
                {editingBlog ? 'Update' : 'Create'} Blog Post
              </Button>
              <Button onClick={() => { setIsModalOpen(false); setEditingBlog(null); resetForm(); }} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </motion.div>
    </div>);
};
