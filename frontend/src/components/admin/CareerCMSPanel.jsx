import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { AdminSidebar } from './AdminSidebar';
import { motion } from 'motion/react';
const mockCareers = [
    {
        id: 'CAR001',
        title: 'Customer Support Executive',
        department: 'Support',
        location: 'Noida, India',
        type: 'Full-time',
        experience: '0-2 years',
        description: 'Join our customer support team and help delivery partners succeed.',
        requirements: 'Good communication skills, Problem-solving ability',
        postedDate: '2024-01-10',
        status: 'open',
    },
];
export const CareerCMSPanel = ({ onNavigate }) => {
    const [careers, setCareers] = useState(mockCareers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCareer, setEditingCareer] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        experience: '',
        description: '',
        requirements: '',
        status: 'open',
    });
    const handleSubmit = () => {
        if (editingCareer) {
            setCareers(careers.map(career => career.id === editingCareer.id ? { ...career, ...formData } : career));
            alert('Career post updated successfully!');
        }
        else {
            const newCareer = {
                ...formData,
                id: `CAR${String(careers.length + 1).padStart(3, '0')}`,
                postedDate: new Date().toISOString().split('T')[0],
            };
            setCareers([...careers, newCareer]);
            alert('Career post created successfully!');
        }
        setIsModalOpen(false);
        setEditingCareer(null);
        resetForm();
    };
    const resetForm = () => {
        setFormData({
            title: '',
            department: '',
            location: '',
            type: 'Full-time',
            experience: '',
            description: '',
            requirements: '',
            status: 'open',
        });
    };
    const handleEdit = (career) => {
        setEditingCareer(career);
        setFormData({
            title: career.title,
            department: career.department,
            location: career.location,
            type: career.type,
            experience: career.experience,
            description: career.description,
            requirements: career.requirements,
            status: career.status,
        });
        setIsModalOpen(true);
    };
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this career post?')) {
            setCareers(careers.filter(career => career.id !== id));
            alert('Career post deleted successfully!');
        }
    };
    return (<div className="min-h-screen bg-gray-50">
      <AdminSidebar currentPage="admin-careers" onNavigate={onNavigate}/>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 p-6 space-y-6 min-h-screen" style={{ marginLeft: 'var(--admin-sidebar-width, 280px)', transition: 'margin-left 0.3s' }}>
        <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Career CMS</h2>
          <p className="text-gray-500">Manage job openings and applications</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingCareer(null); setIsModalOpen(true); }} className="bg-red-500 hover:bg-red-600">
          <Plus className="w-4 h-4 mr-2"/>
          New Job Opening
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careers.map(career => (<Card key={career.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="mb-1">{career.title}</h3>
                  <p className="text-sm text-gray-600">{career.department}</p>
                </div>
                <Badge className={career.status === 'open' ? 'bg-green-500' : 'bg-gray-500'}>
                  {career.status}
                </Badge>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">📍 {career.location}</p>
                <p className="text-sm text-gray-600">💼 {career.type}</p>
                <p className="text-sm text-gray-600">📅 Posted: {career.postedDate}</p>
                <p className="text-sm text-gray-600">⏱️ Experience: {career.experience}</p>
              </div>
              <p className="text-sm text-gray-700 mb-4">{career.description}</p>
              <div className="flex items-center gap-2">
                <Button onClick={() => alert('Preview: ' + career.title)} variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1"/>
                  View
                </Button>
                <Button onClick={() => handleEdit(career)} variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1"/>
                  Edit
                </Button>
                <Button onClick={() => handleDelete(career.id)} variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4"/>
                </Button>
              </div>
            </CardContent>
          </Card>))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCareer ? 'Edit Career Post' : 'Create New Job Opening'}</DialogTitle>
            <DialogDescription>
              {editingCareer ? 'Update the job posting details' : 'Create a new job opening for the KWICK careers page'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Job Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Customer Support Executive"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Department</Label>
                <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g., Support"/>
              </div>
              <div>
                <Label>Location</Label>
                <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g., Noida, India"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Job Type</Label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full p-2 border rounded-lg">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <Label>Experience Required</Label>
                <Input value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} placeholder="e.g., 0-2 years"/>
              </div>
            </div>
            <div>
              <Label>Job Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the role..." rows={5}/>
            </div>
            <div>
              <Label>Requirements</Label>
              <Textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="List key requirements..." rows={5}/>
            </div>
            <div>
              <Label>Status</Label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full p-2 border rounded-lg">
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1 bg-red-500 hover:bg-red-600">
                {editingCareer ? 'Update' : 'Create'} Job Opening
              </Button>
              <Button onClick={() => { setIsModalOpen(false); setEditingCareer(null); resetForm(); }} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </motion.div>
    </div>);
};
