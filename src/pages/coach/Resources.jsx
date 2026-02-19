import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Video, Image, Download, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function TrainingResources() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingResource, setViewingResource] = useState(null);

  const resources = [
    {
      id: 1,
      title: 'Beginner Yoga Guide',
      type: 'PDF',
      category: 'Yoga',
      size: '2.5 MB',
      uploadDate: '2026-01-15',
      downloads: 45,
      icon: FileText,
      description: 'Complete guide for beginners including basic poses and breathing techniques.',
    },
    {
      id: 2,
      title: 'Proper Swimming Technique',
      type: 'Video',
      category: 'Swimming',
      size: '15.8 MB',
      uploadDate: '2026-01-10',
      downloads: 32,
      icon: Video,
      description: 'Video tutorial demonstrating proper swimming form and technique.',
    },
    {
      id: 3,
      title: 'Pilates Exercise Chart',
      type: 'Image',
      category: 'Pilates',
      size: '1.2 MB',
      uploadDate: '2026-01-08',
      downloads: 28,
      icon: Image,
      description: 'Visual reference chart showing various Pilates exercises and positions.',
    },
  ];

  const handleUpload = () => {
    toast.success('Resource uploaded successfully!');
    setShowUploadModal(false);
  };

  const handleDelete = (title) => {
    toast.success(`Deleted: ${title}`);
  };

  const handleView = (resource) => {
    setViewingResource(resource);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Training Resources</h1>
          <p className="text-muted-foreground mt-1">Upload and manage training materials for your trainees</p>
        </div>
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Training Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Resource Title</Label>
                <Input placeholder="e.g., Beginner Yoga Guide" />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe what this resource covers..." rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input placeholder="e.g., Yoga, Swimming" />
                </div>
                <div className="space-y-2">
                  <Label>Resource Type</Label>
                  <Input placeholder="PDF, Video, Image" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload File</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Supported formats: PDF, DOC, MP4, JPG, PNG (Max 50MB)
                  </p>
                  <Button variant="outline">Choose File</Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="shareWithAll" className="rounded" />
                <Label htmlFor="shareWithAll" className="text-sm">
                  Share with all my trainees
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload}>Upload Resource</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resource Categories */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'Yoga', 'Swimming', 'Pilates', 'Meditation', 'Strength'].map((category) => (
          <Button
            key={category}
            variant={category === 'All' ? 'default' : 'outline'}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{resource.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {resource.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{resource.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span className="font-medium">{resource.uploadDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downloads:</span>
                    <span className="font-medium">{resource.downloads}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleView(resource)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(resource.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Resource Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resource Details</DialogTitle>
          </DialogHeader>
          {viewingResource && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-lg bg-primary-100 dark:bg-primary-900">
                  {viewingResource.icon && <viewingResource.icon className="h-8 w-8 text-primary-600" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{viewingResource.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{viewingResource.category}</Badge>
                    <Badge variant="outline">{viewingResource.type}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">File Size:</span>
                    <p className="font-medium">{viewingResource.size}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Upload Date:</span>
                    <p className="font-medium">{viewingResource.uploadDate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Downloads:</span>
                    <p className="font-medium">{viewingResource.downloads}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium">{viewingResource.type}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{viewingResource.description}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Recommended Content</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Exercise demonstrations and tutorials</li>
                <li>• Training schedules and workout plans</li>
                <li>• Nutrition guides and meal plans</li>
                <li>• Form and technique guides</li>
                <li>• Progress tracking templates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">File Requirements</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Maximum file size: 50MB</li>
                <li>• Supported formats: PDF, DOC, MP4, JPG, PNG</li>
                <li>• Clear, high-quality content</li>
                <li>• Proper naming conventions</li>
                <li>• Include relevant descriptions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}