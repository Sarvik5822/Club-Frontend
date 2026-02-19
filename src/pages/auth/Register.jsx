import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Dumbbell, CheckCircle, Upload, Waves, Swords, Trophy, Weight, Target } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({
    // Basic Personal Details
    name: '',
    dob: '',
    gender: '',
    mobileNumber: '',
    email: '',
    address: '',
    avatar: '',
    password: '',
    confirmPassword: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyRelation: '',
    emergencyContactNumber: '',
    
    // Health & Medical Information - General Health Declaration
    chronicIllness: '',
    chronicIllnessDetails: '',
    faintingSpells: '',
    regularMedication: '',
    medicationDetails: '',
    allergies: '',
    allergyDetails: '',
    
    // Injury History
    majorInjury: '',
    injuryDetails: '',
    jointInjury: '',
    jointInjuryDetails: '',
    fractureHistory: '',
    fractureDetails: '',
    
    // Sports Selection
    selectedSports: [],
    
    // Fitness Level & Experience
    fitnessLevel: '',
    priorTraining: '',
    trainingYears: '',
    competitionExperience: '',
    
    agreeToTerms: false,
  });

  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  ];

  const sportsOptions = [
    { 
      category: 'Swimming', 
      value: 'swimming',
      icon: Waves,
      color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
    },
    { 
      category: 'Martial Arts', 
      icon: Swords,
      color: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700',
      options: [
        { name: 'Karate', value: 'karate' },
        { name: 'Kung Fu', value: 'kung-fu' },
        { name: 'Taekwondo', value: 'taekwondo' },
        { name: 'Judo', value: 'judo' },
        { name: 'Brazilian Jiu-Jitsu', value: 'bjj' },
        { name: 'Boxing', value: 'boxing' },
        { name: 'Kickboxing', value: 'kickboxing' },
        { name: 'Wrestling', value: 'wrestling' }
      ]
    },
    { 
      category: 'Racket Sports',
      icon: Trophy,
      color: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
      options: [
        { name: 'Badminton', value: 'badminton' },
        { name: 'Table Tennis', value: 'table-tennis' },
        { name: 'Squash', value: 'squash' },
        { name: 'Racquetball', value: 'racquetball' }
      ]
    },
    { 
      category: 'Gym & Training',
      icon: Weight,
      color: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
      options: [
        { name: 'Gym Workout', value: 'gym-workout' },
        { name: 'Weightlifting', value: 'weightlifting' },
        { name: 'Cross-training', value: 'cross-training' },
        { name: 'Calisthenics', value: 'calisthenics' },
        { name: 'Bodybuilding', value: 'bodybuilding' }
      ]
    },
    { 
      category: 'Skill & Precision',
      icon: Target,
      color: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
      options: [
        { name: 'Indoor Shooting (Air Rifle/Pistol)', value: 'indoor-shooting' },
        { name: 'Archery', value: 'archery' },
        { name: 'Billiards/Pool/Snooker', value: 'billiards' },
        { name: 'Chess', value: 'chess' }
      ]
    }
  ];

  const handleChangeAvatar = () => {
    setSelectedAvatar(formData.avatar || avatarOptions[0]);
    setUploadedImage(null);
    setShowAvatarModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setSelectedAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully');
    }
  };

  const confirmAvatarChange = () => {
    setFormData({ ...formData, avatar: selectedAvatar });
    toast.success('Avatar updated successfully!');
    setShowAvatarModal(false);
  };

  const handleSportToggle = (sport) => {
    const currentSports = formData.selectedSports;
    if (currentSports.includes(sport)) {
      setFormData({
        ...formData,
        selectedSports: currentSports.filter(s => s !== sport)
      });
    } else {
      setFormData({
        ...formData,
        selectedSports: [...currentSports, sport]
      });
    }
  };

  const validateStep = (currentStep) => {
    switch(currentStep) {
      case 1:
        if (!formData.name || !formData.dob || !formData.gender || !formData.mobileNumber || 
            !formData.email || !formData.address || !formData.password || !formData.confirmPassword) {
          toast.error('Please fill in all required fields in Basic Personal Details');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return false;
        }
        if (formData.password.length < 8) {
          toast.error('Password must be at least 8 characters long');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.emergencyContactName || !formData.emergencyRelation || !formData.emergencyContactNumber) {
          toast.error('Please fill in all emergency contact details');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.chronicIllness || !formData.faintingSpells || !formData.regularMedication || !formData.allergies) {
          toast.error('Please answer all general health questions');
          return false;
        }
        if (!formData.majorInjury || !formData.jointInjury || !formData.fractureHistory) {
          toast.error('Please answer all injury history questions');
          return false;
        }
        return true;
      
      case 4:
        if (formData.selectedSports.length === 0) {
          toast.error('Please select at least one sport');
          return false;
        }
        return true;
      
      case 5:
        if (!formData.fitnessLevel || !formData.priorTraining || !formData.competitionExperience) {
          toast.error('Please fill in all fitness level information');
          return false;
        }
        if (formData.priorTraining === 'yes' && !formData.trainingYears) {
          toast.error('Please specify years of training');
          return false;
        }
        if (!formData.agreeToTerms) {
          toast.error('Please agree to the terms and conditions');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(5)) {
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Registration successful! Please login to continue.');
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-950 dark:to-gray-900 p-4 py-8">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900">
              <Dumbbell className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>Complete your registration to join our fitness community</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-6 overflow-x-auto">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                    step >= num ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > num ? <CheckCircle className="h-5 w-5" /> : num}
                  </div>
                  {num < 5 && (
                    <div className={`w-8 h-1 ${step > num ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Labels */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold">
              {step === 1 && 'Basic Personal Details'}
              {step === 2 && 'Emergency Contact'}
              {step === 3 && 'Health & Medical Information'}
              {step === 4 && 'Select Sports'}
              {step === 5 && 'Fitness Level & Experience'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Basic Personal Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={formData.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full"
                  />
                  <Button type="button" variant="outline" onClick={handleChangeAvatar}>
                    Change Avatar
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <Input
                      id="mobileNumber"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters long
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleNext}>
                  Continue to Emergency Contact
                </Button>
              </div>
            )}

            {/* Step 2: Emergency Contact */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Contact Name *</Label>
                  <Input
                    id="emergencyContactName"
                    placeholder="Enter emergency contact name"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyRelation">Relation *</Label>
                  <Input
                    id="emergencyRelation"
                    placeholder="e.g., Father, Mother, Spouse, Sibling"
                    value={formData.emergencyRelation}
                    onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactNumber">Contact Number *</Label>
                  <Input
                    id="emergencyContactNumber"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.emergencyContactNumber}
                    onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="w-full" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleNext}>
                    Continue to Health Info
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Health & Medical Information */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">A. General Health Declaration</h4>
                  
                  <div className="space-y-2">
                    <Label>Do you have any chronic illness? (Asthma, Diabetes, High BP, Heart Problem, etc.) *</Label>
                    <RadioGroup
                      value={formData.chronicIllness}
                      onValueChange={(value) => setFormData({ ...formData, chronicIllness: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="chronicIllness-yes" />
                        <Label htmlFor="chronicIllness-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="chronicIllness-no" />
                        <Label htmlFor="chronicIllness-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {formData.chronicIllness === 'yes' && (
                      <Textarea
                        placeholder="Please specify details"
                        value={formData.chronicIllnessDetails}
                        onChange={(e) => setFormData({ ...formData, chronicIllnessDetails: e.target.value })}
                        rows={2}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Do you experience fainting spells or dizziness? *</Label>
                    <RadioGroup
                      value={formData.faintingSpells}
                      onValueChange={(value) => setFormData({ ...formData, faintingSpells: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="fainting-yes" />
                        <Label htmlFor="fainting-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="fainting-no" />
                        <Label htmlFor="fainting-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Are you taking any regular medication? *</Label>
                    <RadioGroup
                      value={formData.regularMedication}
                      onValueChange={(value) => setFormData({ ...formData, regularMedication: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="medication-yes" />
                        <Label htmlFor="medication-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="medication-no" />
                        <Label htmlFor="medication-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {formData.regularMedication === 'yes' && (
                      <Textarea
                        placeholder="Please specify medication details"
                        value={formData.medicationDetails}
                        onChange={(e) => setFormData({ ...formData, medicationDetails: e.target.value })}
                        rows={2}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Do you have any allergies? *</Label>
                    <RadioGroup
                      value={formData.allergies}
                      onValueChange={(value) => setFormData({ ...formData, allergies: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="allergies-yes" />
                        <Label htmlFor="allergies-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="allergies-no" />
                        <Label htmlFor="allergies-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {formData.allergies === 'yes' && (
                      <Textarea
                        placeholder="Please specify allergy details"
                        value={formData.allergyDetails}
                        onChange={(e) => setFormData({ ...formData, allergyDetails: e.target.value })}
                        rows={2}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">B. Injury History</h4>
                  
                  <div className="space-y-2">
                    <Label>Have you had any major injury or surgery in the past 6-12 months? *</Label>
                    <RadioGroup
                      value={formData.majorInjury}
                      onValueChange={(value) => setFormData({ ...formData, majorInjury: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="majorInjury-yes" />
                        <Label htmlFor="majorInjury-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="majorInjury-no" />
                        <Label htmlFor="majorInjury-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {formData.majorInjury === 'yes' && (
                      <Textarea
                        placeholder="Please specify details"
                        value={formData.injuryDetails}
                        onChange={(e) => setFormData({ ...formData, injuryDetails: e.target.value })}
                        rows={2}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>History of knee, shoulder, back or neck injury? *</Label>
                    <RadioGroup
                      value={formData.jointInjury}
                      onValueChange={(value) => setFormData({ ...formData, jointInjury: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="jointInjury-yes" />
                        <Label htmlFor="jointInjury-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="jointInjury-no" />
                        <Label htmlFor="jointInjury-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {formData.jointInjury === 'yes' && (
                      <Textarea
                        placeholder="Please specify details"
                        value={formData.jointInjuryDetails}
                        onChange={(e) => setFormData({ ...formData, jointInjuryDetails: e.target.value })}
                        rows={2}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Any history of fracture or ligament tears? *</Label>
                    <RadioGroup
                      value={formData.fractureHistory}
                      onValueChange={(value) => setFormData({ ...formData, fractureHistory: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="fracture-yes" />
                        <Label htmlFor="fracture-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="fracture-no" />
                        <Label htmlFor="fracture-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {formData.fractureHistory === 'yes' && (
                      <Textarea
                        placeholder="Please specify details"
                        value={formData.fractureDetails}
                        onChange={(e) => setFormData({ ...formData, fractureDetails: e.target.value })}
                        rows={2}
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="w-full" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleNext}>
                    Continue to Sports Selection
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Select Sports */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-4">
                  <Label>Select Sports (Click on the sport icon to select) *</Label>
                  
                  {sportsOptions.map((category, idx) => {
                    const IconComponent = category.icon;
                    return (
                      <div key={idx} className="space-y-3">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <IconComponent className="h-5 w-5" />
                          {category.category}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {category.options ? (
                            category.options.map((sport) => {
                              const isSelected = formData.selectedSports.includes(sport.value);
                              return (
                                <div
                                  key={sport.value}
                                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105 ${
                                    isSelected 
                                      ? `${category.color} border-emerald-600 shadow-md` 
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                  onClick={() => handleSportToggle(sport.value)}
                                >
                                  <div className="flex flex-col items-center gap-2 text-center">
                                    <IconComponent className={`h-8 w-8 ${isSelected ? 'text-emerald-600' : 'text-gray-600'}`} />
                                    <span className="text-sm font-medium">{sport.name}</span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div
                              className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105 ${
                                formData.selectedSports.includes(category.value)
                                  ? `${category.color} border-emerald-600 shadow-md`
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => handleSportToggle(category.value)}
                            >
                              <div className="flex flex-col items-center gap-2 text-center">
                                <IconComponent className={`h-8 w-8 ${formData.selectedSports.includes(category.value) ? 'text-emerald-600' : 'text-gray-600'}`} />
                                <span className="text-sm font-medium">{category.category}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {formData.selectedSports.length > 0 && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p className="text-sm font-medium">Selected Sports ({formData.selectedSports.length}):</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.selectedSports.map((sport) => (
                        <span key={sport} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 rounded-full text-xs font-medium">
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="w-full" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleNext}>
                    Continue to Fitness Level
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Fitness Level & Experience */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Fitness Level *</Label>
                  <RadioGroup
                    value={formData.fitnessLevel}
                    onValueChange={(value) => setFormData({ ...formData, fitnessLevel: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="level-beginner" />
                      <Label htmlFor="level-beginner" className="font-normal cursor-pointer">Beginner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="level-intermediate" />
                      <Label htmlFor="level-intermediate" className="font-normal cursor-pointer">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="level-advanced" />
                      <Label htmlFor="level-advanced" className="font-normal cursor-pointer">Advanced</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Have you had prior training? *</Label>
                  <RadioGroup
                    value={formData.priorTraining}
                    onValueChange={(value) => setFormData({ ...formData, priorTraining: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="training-yes" />
                      <Label htmlFor="training-yes" className="font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="training-no" />
                      <Label htmlFor="training-no" className="font-normal cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.priorTraining === 'yes' && (
                  <div className="space-y-2">
                    <Label htmlFor="trainingYears">How many years of training? *</Label>
                    <Input
                      id="trainingYears"
                      type="number"
                      min="0"
                      placeholder="Enter number of years"
                      value={formData.trainingYears}
                      onChange={(e) => setFormData({ ...formData, trainingYears: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="competitionExperience">Competition Experience *</Label>
                  <Textarea
                    id="competitionExperience"
                    placeholder="Describe any competition experience (or write 'None' if no experience)"
                    value={formData.competitionExperience}
                    onChange={(e) => setFormData({ ...formData, competitionExperience: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex items-start gap-2 p-3 border rounded-lg">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, agreeToTerms: checked })
                    }
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    I agree to the{' '}
                    <a href="#" className="text-emerald-600 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-emerald-600 hover:underline">
                      Privacy Policy
                    </a>. I confirm that all the information provided is accurate and complete.
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="w-full" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-emerald-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Change Avatar Modal */}
      <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Change Avatar</DialogTitle>
            <DialogDescription>
              Select a new avatar or upload your own image
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-4 gap-4">
              {avatarOptions.map((avatar, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-emerald-600 ${
                    selectedAvatar === avatar ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setUploadedImage(null);
                  }}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 border-2 border-dashed rounded-lg text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Or upload your own image
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="avatar-upload"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('avatar-upload').click()}
              >
                Upload Image
              </Button>
              {uploadedImage && (
                <div className="mt-4">
                  <img src={uploadedImage} alt="Uploaded" className="w-24 h-24 rounded-full mx-auto" />
                  <p className="text-sm text-emerald-600 mt-2">Image uploaded successfully</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvatarModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAvatarChange}>
              Save Avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}