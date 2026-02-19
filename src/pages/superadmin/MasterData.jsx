import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Tag, Dumbbell, Building, Grid } from 'lucide-react';
import { toast } from 'sonner';

export default function MasterData() {
  const [showSportModal, setShowSportModal] = useState(false);
  const [showFacilityModal, setShowFacilityModal] = useState(false);

  const sports = [
    { id: '1', name: 'Yoga', category: 'Mind & Body', color: 'purple', sessions: 45 },
    { id: '2', name: 'Swimming', category: 'Aquatic', color: 'blue', sessions: 38 },
    { id: '3', name: 'Pilates', category: 'Mind & Body', color: 'pink', sessions: 32 },
    { id: '4', name: 'Boxing', category: 'Martial Arts', color: 'red', sessions: 28 },
    { id: '5', name: 'Tennis', category: 'Racquet Sports', color: 'green', sessions: 25 },
    { id: '6', name: 'Cycling', category: 'Cardio', color: 'orange', sessions: 22 },
  ];

  const facilityTypes = [
    { id: '1', name: 'Yoga Studio', capacity: 25, count: 3 },
    { id: '2', name: 'Swimming Pool', capacity: 20, count: 2 },
    { id: '3', name: 'Gym Floor', capacity: 50, count: 1 },
    { id: '4', name: 'Tennis Court', capacity: 4, count: 4 },
    { id: '5', name: 'Boxing Ring', capacity: 10, count: 2 },
  ];

  const categories = [
    { id: '1', name: 'Mind & Body', sports: 8, color: 'purple' },
    { id: '2', name: 'Aquatic', sports: 5, color: 'blue' },
    { id: '3', name: 'Martial Arts', sports: 6, color: 'red' },
    { id: '4', name: 'Cardio', sports: 7, color: 'orange' },
    { id: '5', name: 'Strength', sports: 9, color: 'gray' },
  ];

  const handleCreate = (type) => {
    toast.success(`${type} created successfully`);
    setShowSportModal(false);
    setShowFacilityModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Master Data Management</h1>
        <p className="text-muted-foreground mt-1">Manage sports types, facility types, tags, and categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Dumbbell className="h-12 w-12 mx-auto mb-3 text-primary-600" />
            <h3 className="font-semibold text-2xl">{sports.length}</h3>
            <p className="text-sm text-muted-foreground">Sports Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Building className="h-12 w-12 mx-auto mb-3 text-accent-600" />
            <h3 className="font-semibold text-2xl">{facilityTypes.length}</h3>
            <p className="text-sm text-muted-foreground">Facility Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Grid className="h-12 w-12 mx-auto mb-3 text-success" />
            <h3 className="font-semibold text-2xl">{categories.length}</h3>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sports Types</CardTitle>
          <Dialog open={showSportModal} onOpenChange={setShowSportModal}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Sport
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Sport</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Sport Name</Label>
                  <Input placeholder="e.g., Zumba" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input placeholder="e.g., Dance" />
                </div>
                <div className="space-y-2">
                  <Label>Color Tag</Label>
                  <Input type="color" defaultValue="#10b981" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSportModal(false)}>Cancel</Button>
                <Button onClick={() => handleCreate('Sport')}>Add Sport</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sports.map((sport) => (
              <div
                key={sport.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-${sport.color}-500`} />
                  <div>
                    <p className="font-medium">{sport.name}</p>
                    <p className="text-xs text-muted-foreground">{sport.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{sport.sessions}</Badge>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Facility Types</CardTitle>
          <Dialog open={showFacilityModal} onOpenChange={setShowFacilityModal}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Facility Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Facility Type</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Facility Name</Label>
                  <Input placeholder="e.g., Dance Studio" />
                </div>
                <div className="space-y-2">
                  <Label>Default Capacity</Label>
                  <Input type="number" placeholder="30" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowFacilityModal(false)}>Cancel</Button>
                <Button onClick={() => handleCreate('Facility Type')}>Add Facility</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {facilityTypes.map((facility) => (
              <div
                key={facility.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="font-medium">{facility.name}</p>
                    <p className="text-xs text-muted-foreground">Capacity: {facility.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{facility.count} locations</Badge>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 rounded-lg border text-center hover:border-primary-600 transition-colors"
              >
                <Tag className={`h-8 w-8 mx-auto mb-2 text-${category.color}-600`} />
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{category.sports} sports</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}