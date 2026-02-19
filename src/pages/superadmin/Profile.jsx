import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Phone, Shield, Upload, Eye, EyeOff, Loader2, Crown, Calendar, Clock, Camera, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function SuperadminProfile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
    });

    const avatarOptions = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Chief',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Director',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Executive',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Leader',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Boss',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/me');

            if (response.status === 'success') {
                const userData = response.data.user;
                setProfileData(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    avatar: userData.avatar || avatarOptions[0],
                });
                setSelectedAvatar(userData.avatar || avatarOptions[0]);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            toast.error('Failed to load profile. Please try again.');
            // Use fallback data from auth context
            if (user) {
                setProfileData({
                    _id: user._id,
                    name: user.name || 'Super Admin',
                    email: user.email || 'superadmin@example.com',
                    phone: user.phone || '',
                    role: 'superadmin',
                    status: 'active',
                    lastLogin: new Date().toISOString(),
                });
                setFormData({
                    name: user.name || 'Super Admin',
                    email: user.email || 'superadmin@example.com',
                    phone: user.phone || '',
                    avatar: user.avatar || avatarOptions[0],
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await api.put('/auth/profile', {
                name: formData.name,
                phone: formData.phone,
                avatar: formData.avatar,
            });

            if (response.status === 'success') {
                toast.success('Profile updated successfully!');
                setProfileData(prev => ({
                    ...prev,
                    ...response.data.user
                }));
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangeAvatar = () => {
        setSelectedAvatar(formData.avatar);
        setUploadedImage(null);
        setUploadPreview(null);
        setShowAvatarModal(true);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setUploadedImage(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadPreview(reader.result);
                setSelectedAvatar(reader.result); // Use the preview as selected avatar
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const clearUploadedImage = () => {
        setUploadedImage(null);
        setUploadPreview(null);
        setSelectedAvatar(formData.avatar || avatarOptions[0]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const confirmAvatarChange = async () => {
        try {
            setSaving(true);

            let avatarUrl = selectedAvatar;

            // If there's an uploaded image, we need to handle it
            if (uploadedImage && uploadPreview) {
                // For now, we'll use the base64 data URL directly
                // In a production environment, you would upload to a server/cloud storage
                avatarUrl = uploadPreview;
            }

            const response = await api.put('/auth/profile', {
                avatar: avatarUrl
            });

            if (response.status === 'success') {
                setFormData(prev => ({ ...prev, avatar: avatarUrl }));
                setProfileData(prev => ({ ...prev, avatar: avatarUrl }));
                toast.success('Avatar updated successfully!');
                setShowAvatarModal(false);
                setUploadedImage(null);
                setUploadPreview(null);
            }
        } catch (error) {
            console.error('Failed to update avatar:', error);
            toast.error('Failed to update avatar');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.error('Please enter both current and new password');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long');
            return;
        }

        try {
            setSaving(true);
            const response = await api.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (response.status === 'success') {
                toast.success('Password changed successfully!');
                setPasswordData({ currentPassword: '', newPassword: '' });
            }
        } catch (error) {
            console.error('Failed to change password:', error);
            toast.error(error.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                <span className="ml-2 text-muted-foreground">Loading profile...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">SuperAdmin Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
                </div>
                <Button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        isEditing ? 'Save Changes' : 'Edit Profile'
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Summary Card */}
                <Card className="lg:col-span-1">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative">
                                <img
                                    src={formData.avatar || avatarOptions[0]}
                                    alt={profileData?.name}
                                    className="w-32 h-32 rounded-full mb-4 border-4 border-primary-100 object-cover"
                                />
                                <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-2">
                                    <Crown className="h-4 w-4 text-white" />
                                </div>
                                <button
                                    onClick={handleChangeAvatar}
                                    className="absolute bottom-2 right-0 bg-primary-600 hover:bg-primary-700 rounded-full p-2 transition-colors"
                                >
                                    <Camera className="h-4 w-4 text-white" />
                                </button>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleChangeAvatar} className="mb-4">
                                Change Avatar
                            </Button>
                            <h2 className="text-2xl font-bold">{profileData?.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Shield className="h-4 w-4 text-yellow-500" />
                                <span className="text-yellow-600 font-medium">Super Administrator</span>
                            </div>

                            <div className="w-full mt-6 space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="truncate">{profileData?.email}</span>
                                </div>
                                {profileData?.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{profileData.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Status: <span className={`font-medium ${profileData?.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                        {profileData?.status === 'active' ? 'Active' : 'Inactive'}
                                    </span></span>
                                </div>
                            </div>

                            <div className="w-full mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Super Admin Access</span>
                                    <Crown className="h-5 w-5 text-yellow-500" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Full system access enabled
                                </p>
                            </div>

                            {profileData?.lastLogin && (
                                <div className="w-full mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>Last login: {new Date(profileData.lastLogin).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Information */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="personal">Personal Information</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                            <TabsTrigger value="permissions">Permissions</TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email Address</Label>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                disabled
                                                className="bg-muted"
                                            />
                                            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Phone Number</Label>
                                            <Input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="+91-XXXXXXXXXX"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Role</Label>
                                            <Input
                                                value="Super Administrator"
                                                disabled
                                                className="bg-muted"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Bio / Notes</Label>
                                        <Textarea
                                            placeholder="Add notes about your role or responsibilities..."
                                            disabled={!isEditing}
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Change Password</Label>
                                            <div className="space-y-3 mt-2">
                                                <div className="relative">
                                                    <Input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        name="currentPassword"
                                                        value={passwordData.currentPassword}
                                                        onChange={handlePasswordChange}
                                                        placeholder="Enter current password"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    >
                                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                                <div className="relative">
                                                    <Input
                                                        type={showNewPassword ? "text" : "password"}
                                                        name="newPassword"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordChange}
                                                        placeholder="Enter new password"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                                <Button
                                                    onClick={handleChangePassword}
                                                    disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                                                >
                                                    {saving ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        'Update Password'
                                                    )}
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Password must be at least 6 characters and include uppercase, lowercase, and numbers.
                                            </p>
                                        </div>

                                        <div className="p-4 border rounded-lg bg-muted/50">
                                            <h4 className="font-semibold mb-2">Active Sessions</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Current session (this device)</span>
                                                    <span className="text-green-600 font-medium">Active</span>
                                                </div>
                                                {profileData?.lastLogin && (
                                                    <div className="flex justify-between text-muted-foreground">
                                                        <span>Last login: {new Date(profileData.lastLogin).toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="permissions" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Access Permissions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <p className="text-sm text-muted-foreground mb-4">
                                            As a Super Administrator, you have full system access:
                                        </p>

                                        {[
                                            {
                                                name: 'Manage All Admins',
                                                desc: 'Create, edit, and delete admin accounts'
                                            },
                                            {
                                                name: 'Manage All Branches',
                                                desc: 'Add, update, and configure branches'
                                            },
                                            {
                                                name: 'System Settings',
                                                desc: 'Access and configure global system settings'
                                            },
                                            {
                                                name: 'View Audit Logs',
                                                desc: 'Access all system activity logs'
                                            },
                                            {
                                                name: 'Analytics & Reports',
                                                desc: 'View all analytics and reporting data'
                                            },
                                            {
                                                name: 'Master Data Management',
                                                desc: 'Configure sports, facilities, and other master data'
                                            },
                                            {
                                                name: 'Membership Plans',
                                                desc: 'Create and manage membership plans'
                                            },
                                            {
                                                name: 'Payment Gateway',
                                                desc: 'Configure and manage payment gateway settings'
                                            },
                                        ].map((permission) => (
                                            <div key={permission.name} className="flex items-center gap-3 p-3 border rounded-lg">
                                                <Shield className="h-5 w-5 text-yellow-500" />
                                                <div>
                                                    <p className="font-medium">{permission.name}</p>
                                                    <p className="text-xs text-muted-foreground">{permission.desc}</p>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Note:</strong> As a Super Administrator, you have full access to all modules and features in the system.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Change Avatar Modal */}
            <Dialog open={showAvatarModal} onOpenChange={(open) => {
                if (!open) {
                    setUploadedImage(null);
                    setUploadPreview(null);
                }
                setShowAvatarModal(open);
            }}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Change Avatar</DialogTitle>
                        <DialogDescription>
                            Select a preset avatar or upload your own image. The currently selected avatar is highlighted.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {/* Show uploaded image preview if exists */}
                        {uploadPreview && (
                            <div className="mb-6">
                                <Label className="mb-2 block">Uploaded Image Preview</Label>
                                <div className="relative inline-block">
                                    <img
                                        src={uploadPreview}
                                        alt="Upload preview"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-primary-600"
                                    />
                                    <div className="absolute -top-2 -right-2 bg-primary-600 rounded-full p-1">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                    <button
                                        onClick={clearUploadedImage}
                                        className="absolute -bottom-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 transition-colors"
                                    >
                                        <X className="h-4 w-4 text-white" />
                                    </button>
                                </div>
                                <p className="text-sm text-green-600 mt-2">✓ Image selected</p>
                            </div>
                        )}

                        {/* Preset avatars */}
                        <div className="mb-4">
                            <Label className="mb-2 block">Or choose a preset avatar</Label>
                            <div className="grid grid-cols-4 gap-4">
                                {avatarOptions.map((avatar, index) => (
                                    <div
                                        key={index}
                                        className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-primary-600 hover:shadow-lg ${selectedAvatar === avatar && !uploadPreview
                                                ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 shadow-lg'
                                                : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                        onClick={() => {
                                            setSelectedAvatar(avatar);
                                            setUploadedImage(null);
                                            setUploadPreview(null);
                                        }}
                                    >
                                        <img
                                            src={avatar}
                                            alt={`Avatar ${index + 1}`}
                                            className="w-full h-full rounded-lg"
                                        />
                                        {selectedAvatar === avatar && !uploadPreview && (
                                            <div className="absolute -top-2 -right-2 bg-primary-600 rounded-full p-1">
                                                <Check className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                        {formData.avatar === avatar && selectedAvatar !== avatar && !uploadPreview && (
                                            <div className="absolute -top-2 -right-2 bg-gray-400 rounded-full px-2 py-1">
                                                <span className="text-white text-xs font-bold">Current</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upload section */}
                        <div className="mt-6 p-4 border-2 border-dashed rounded-lg text-center hover:border-primary-400 transition-colors">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                                Upload your own image (max 5MB)
                            </p>
                            <p className="text-xs text-muted-foreground mb-3">
                                Supported formats: JPG, PNG, GIF, WebP
                            </p>
                            <Button variant="outline" size="sm" onClick={handleUploadClick}>
                                <Upload className="h-4 w-4 mr-2" />
                                Choose File
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setShowAvatarModal(false);
                            setUploadedImage(null);
                            setUploadPreview(null);
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={confirmAvatarChange} disabled={saving || !selectedAvatar}>
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Avatar'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}