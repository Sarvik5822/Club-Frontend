import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Roles() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const roles = [
    { id: '1', name: 'Member', users: 1234, color: 'bg-blue-500' },
    { id: '2', name: 'Coach', users: 45, color: 'bg-green-500' },
    { id: '3', name: 'Admin', users: 12, color: 'bg-purple-500' },
    { id: '4', name: 'Superadmin', users: 3, color: 'bg-red-500' },
    { id: '5', name: 'Finance Admin', users: 5, color: 'bg-yellow-500' },
  ];

  const permissions = [
    { category: 'Members', items: ['View Members', 'Add Member', 'Edit Member', 'Delete Member', 'Approve Member'] },
    { category: 'Coaches', items: ['View Coaches', 'Add Coach', 'Edit Coach', 'Delete Coach', 'Approve Coach'] },
    { category: 'Sessions', items: ['View Sessions', 'Create Session', 'Edit Session', 'Cancel Session'] },
    { category: 'Payments', items: ['View Payments', 'Process Payment', 'Issue Refund', 'View Reports'] },
    { category: 'Facilities', items: ['View Facilities', 'Manage Facilities', 'Schedule Maintenance'] },
    { category: 'System', items: ['View Audit Logs', 'Manage Settings', 'System Configuration'] },
  ];

  const handleCreateRole = () => {
    toast.success('Role created successfully');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground mt-1">Configure roles and permissions with RBAC matrix</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input placeholder="e.g., Finance Admin" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Brief description of the role" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button onClick={handleCreateRole}>Create Role</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${role.color} bg-opacity-10`}>
                  <Shield className={`h-6 w-6 ${role.color.replace('bg-', 'text-')}`} />
                </div>
                <Button size="sm" variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-lg mb-1">{role.name}</h3>
              <p className="text-sm text-muted-foreground">{role.users} users</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Permission</th>
                  {roles.map((role) => (
                    <th key={role.id} className="text-center p-3 font-semibold">
                      <Badge variant="secondary">{role.name}</Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((category) => (
                  <>
                    <tr key={category.category} className="bg-gray-50 dark:bg-gray-900">
                      <td colSpan={roles.length + 1} className="p-3 font-semibold">
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((permission) => (
                      <tr key={permission} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="p-3 text-sm">{permission}</td>
                        {roles.map((role) => (
                          <td key={role.id} className="text-center p-3">
                            <Switch
                              defaultChecked={Math.random() > 0.3}
                              onCheckedChange={() => toast.success('Permission updated')}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}