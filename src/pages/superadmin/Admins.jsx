import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Shield, Edit, Trash2, Key, Loader2, RefreshCw, Eye, User, Mail, Phone, Building, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import superadminService from '@/services/superadminService';
import { toast } from 'sonner';

const AVAILABLE_PERMISSIONS = [
  { id: 'manage_members', label: 'Manage Members' },
  { id: 'manage_coaches', label: 'Manage Coaches' },
  { id: 'manage_facilities', label: 'Manage Facilities' },
  { id: 'view_reports', label: 'View Reports' },
  { id: 'manage_attendance', label: 'Manage Attendance' },
  { id: 'manage_payments', label: 'Manage Payments' },
  { id: 'manage_announcements', label: 'Manage Announcements' },
  { id: 'manage_complaints', label: 'Manage Complaints' },
  { id: 'manage_training_plans', label: 'Manage Training Plans' },
];

export default function Admins() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [admins, setAdmins] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Form state for adding/editing admin
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    branchId: '',
    permissions: [],
    status: 'active',
  });

  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchAdmins();
    fetchBranches();
  }, [pagination.page, searchTerm, statusFilter]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };

      const response = await superadminService.getAllAdmins(params);

      if (response.status === 'success') {
        setAdmins(response.data.admins || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      toast.error('Failed to load admins');
      // Use mock data as fallback
      setAdmins([
        {
          _id: '1',
          email: 'admin@test.com',
          name: 'Mike Admin',
          phone: '+1234567892',
          role: 'admin',
          permissions: ['manage_members', 'manage_coaches', 'manage_facilities', 'view_reports'],
          status: 'active',
          lastLogin: '2026-01-22T10:30:00Z',
          twoFactorEnabled: true,
          branchId: { _id: '1', name: 'Downtown Sports Hub' },
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
          createdAt: '2025-06-15T08:00:00Z',
        },
        {
          _id: '2',
          email: 'sarah@test.com',
          name: 'Sarah Johnson',
          phone: '+1234567893',
          role: 'admin',
          permissions: ['manage_members', 'view_reports', 'manage_payments'],
          status: 'active',
          lastLogin: '2026-01-21T14:45:00Z',
          twoFactorEnabled: false,
          branchId: { _id: '2', name: 'Westside Fitness Center' },
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          createdAt: '2025-08-20T10:30:00Z',
        },
        {
          _id: '3',
          email: 'john@test.com',
          name: 'John Smith',
          phone: '+1234567894',
          role: 'admin',
          permissions: ['manage_coaches', 'manage_attendance'],
          status: 'suspended',
          lastLogin: '2026-01-10T09:15:00Z',
          twoFactorEnabled: true,
          branchId: { _id: '3', name: 'Eastside Club' },
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          createdAt: '2025-03-10T12:00:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await superadminService.getAllBranches();
      if (response.status === 'success') {
        setBranches(response.data.branches || []);
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      // Use mock data as fallback
      setBranches([
        { _id: '1', name: 'Downtown Sports Hub' },
        { _id: '2', name: 'Westside Fitness Center' },
        { _id: '3', name: 'Eastside Club' },
      ]);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      branchId: '',
      permissions: [],
      status: 'active',
    });
  };

  const handleAddAdmin = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await superadminService.createAdmin(formData);

      if (response.status === 'success') {
        toast.success('Admin created successfully');
        setShowAddModal(false);
        resetForm();
        fetchAdmins();
      }
    } catch (error) {
      console.error('Failed to create admin:', error);
      toast.error(error.message || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      setSubmitting(true);
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        branchId: formData.branchId || undefined,
        permissions: formData.permissions,
        status: formData.status,
      };

      const response = await superadminService.updateAdmin(selectedAdmin._id, updateData);

      if (response.status === 'success') {
        toast.success('Admin updated successfully');
        setShowEditModal(false);
        setSelectedAdmin(null);
        resetForm();
        fetchAdmins();
      }
    } catch (error) {
      console.error('Failed to update admin:', error);
      toast.error(error.message || 'Failed to update admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedAdmin || !newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    try {
      setSubmitting(true);
      const response = await superadminService.resetAdminPassword(selectedAdmin._id, newPassword);

      if (response.status === 'success') {
        toast.success('Password reset successfully');
        setShowResetPasswordModal(false);
        setSelectedAdmin(null);
        setNewPassword('');
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    const newStatus = admin.status === 'active' ? 'suspended' : 'active';

    try {
      const response = await superadminService.toggleAdminStatus(admin._id, newStatus);

      if (response.status === 'success') {
        toast.success(`Admin ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
        fetchAdmins();
      }
    } catch (error) {
      console.error('Failed to toggle admin status:', error);
      toast.error(error.message || 'Failed to update admin status');
    }
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      setSubmitting(true);
      const response = await superadminService.deleteAdmin(selectedAdmin._id);

      if (response.status === 'success') {
        toast.success('Admin deleted successfully');
        setShowDeleteModal(false);
        setSelectedAdmin(null);
        fetchAdmins();
      }
    } catch (error) {
      console.error('Failed to delete admin:', error);
      toast.error(error.message || 'Failed to delete admin');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      phone: admin.phone || '',
      password: '',
      branchId: admin.branchId?._id || '',
      permissions: admin.permissions || [],
      status: admin.status || 'active',
    });
    setShowEditModal(true);
  };

  const openViewModal = (admin) => {
    setSelectedAdmin(admin);
    setShowViewModal(true);
  };

  const handlePermissionChange = (permissionId, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId),
    }));
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admins & Roles</h1>
          <p className="text-muted-foreground mt-1">Manage system administrators and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAdmins} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Administrator</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new administrator account.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      placeholder="John Admin"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      placeholder="+1234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password *</Label>
                    <Input
                      type="password"
                      placeholder="Min 6 chars, uppercase, lowercase, number"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assign to Branch</Label>
                  <Select
                    value={formData.branchId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, branchId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch._id} value={branch._id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 p-4 border rounded-lg">
                    {AVAILABLE_PERMISSIONS.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                        />
                        <label htmlFor={permission.id} className="text-sm cursor-pointer">
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={handleAddAdmin} disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Admin
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search administrators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-2 text-muted-foreground">Loading admins...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Admin</th>
                    <th className="text-left p-3 font-semibold">Branch</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Last Login</th>
                    <th className="text-left p-3 font-semibold">Permissions</th>
                    <th className="text-right p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-muted-foreground">
                        No admins found
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <tr
                        key={admin._id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => openViewModal(admin)}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={admin.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.email}`}
                              alt={admin.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium">{admin.name}</p>
                              <p className="text-sm text-muted-foreground">{admin.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm">
                            {admin.branchId?.name || 'Not assigned'}
                          </span>
                        </td>
                        <td className="p-3">
                          <Badge variant={admin.status === 'active' ? 'default' : 'secondary'}>
                            {admin.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">
                          {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1 flex-wrap">
                            {admin.permissions?.slice(0, 2).map((perm, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {perm.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                            {admin.permissions?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{admin.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openViewModal(admin)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(admin)}
                              title="Edit Admin"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setShowResetPasswordModal(true);
                              }}
                              title="Reset Password"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(admin)}
                              title={admin.status === 'active' ? 'Suspend Admin' : 'Activate Admin'}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setShowDeleteModal(true);
                              }}
                              title="Delete Admin"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredAdmins.length} of {pagination.total} admins
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Admin Details Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Admin Details
            </DialogTitle>
            <DialogDescription>
              View complete information about this administrator.
            </DialogDescription>
          </DialogHeader>
          {selectedAdmin && (
            <div className="py-4">
              {/* Admin Profile Header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                <img
                  src={selectedAdmin.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAdmin.email}`}
                  alt={selectedAdmin.name}
                  className="w-20 h-20 rounded-full border-4 border-primary/20"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedAdmin.name}</h3>
                  <p className="text-muted-foreground">{selectedAdmin.role || 'Administrator'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={selectedAdmin.status === 'active' ? 'default' : 'secondary'}>
                      {selectedAdmin.status === 'active' ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
                      ) : (
                        <><XCircle className="h-3 w-3 mr-1" /> {selectedAdmin.status}</>
                      )}
                    </Badge>
                    {selectedAdmin.twoFactorEnabled && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Shield className="h-3 w-3 mr-1" /> 2FA Enabled
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedAdmin.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedAdmin.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Branch</p>
                        <p className="font-medium">{selectedAdmin.branchId?.name || 'Not assigned'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Account Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Created On</p>
                        <p className="font-medium">{formatDate(selectedAdmin.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Login</p>
                        <p className="font-medium">{formatDateTime(selectedAdmin.lastLogin)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Permissions</h4>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {selectedAdmin.permissions?.length > 0 ? (
                    selectedAdmin.permissions.map((perm, i) => (
                      <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
                        {perm.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No permissions assigned</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>Close</Button>
            <Button onClick={() => {
              setShowViewModal(false);
              openEditModal(selectedAdmin);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Administrator</DialogTitle>
            <DialogDescription>
              Update the administrator details and permissions below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="John Admin"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assign to Branch</Label>
              <Select
                value={formData.branchId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, branchId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 p-4 border rounded-lg">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${permission.id}`}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                    />
                    <label htmlFor={`edit-${permission.id}`} className="text-sm cursor-pointer">
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleEditAdmin} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={showResetPasswordModal} onOpenChange={setShowResetPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter a new password for the administrator account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Reset password for <strong>{selectedAdmin?.name}</strong> ({selectedAdmin?.email})
            </p>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Min 6 chars, uppercase, lowercase, number"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Password must contain at least one uppercase letter, one lowercase letter, and one number.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetPasswordModal(false)}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Administrator</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The administrator account will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{selectedAdmin?.name}</strong>?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAdmin} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}