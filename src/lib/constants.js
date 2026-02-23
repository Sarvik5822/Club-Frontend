// Legacy hardcoded list - kept for backward compatibility
// New code should use ClubSport API to get club-specific sports
export const SPORTS_TYPES = [
    'Basketball',
    'Tennis',
    'Swimming',
    'Yoga',
    'Pilates',
    'CrossFit',
    'Boxing',
    'Cycling',
    'Running',
    'Zumba',
    'Martial Arts',
    'Volleyball',
    'Badminton',
    'Table Tennis',
    'Gym Training',
];

// Predefined sports catalog with categories (for admin setup)
export const PREDEFINED_SPORTS_CATALOG = [
    { name: 'Swimming', category: 'Aquatics' },
    { name: 'Water Polo', category: 'Aquatics' },
    { name: 'Karate', category: 'Martial Arts' },
    { name: 'Kung Fu', category: 'Martial Arts' },
    { name: 'Taekwondo', category: 'Martial Arts' },
    { name: 'Judo', category: 'Martial Arts' },
    { name: 'Brazilian Jiu-Jitsu', category: 'Martial Arts' },
    { name: 'Boxing', category: 'Martial Arts' },
    { name: 'Kickboxing', category: 'Martial Arts' },
    { name: 'Wrestling', category: 'Martial Arts' },
    { name: 'Badminton', category: 'Racket Sports' },
    { name: 'Table Tennis', category: 'Racket Sports' },
    { name: 'Squash', category: 'Racket Sports' },
    { name: 'Tennis', category: 'Racket Sports' },
    { name: 'Gym Workout', category: 'Gym & Fitness' },
    { name: 'Weightlifting', category: 'Gym & Fitness' },
    { name: 'Cross-training', category: 'Gym & Fitness' },
    { name: 'Calisthenics', category: 'Gym & Fitness' },
    { name: 'Bodybuilding', category: 'Gym & Fitness' },
    { name: 'CrossFit', category: 'Gym & Fitness' },
    { name: 'Indoor Shooting', category: 'Skill & Precision' },
    { name: 'Archery', category: 'Skill & Precision' },
    { name: 'Billiards', category: 'Skill & Precision' },
    { name: 'Chess', category: 'Skill & Precision' },
    { name: 'Yoga', category: 'Mind & Body' },
    { name: 'Pilates', category: 'Mind & Body' },
    { name: 'Meditation', category: 'Mind & Body' },
    { name: 'Basketball', category: 'Team Sports' },
    { name: 'Volleyball', category: 'Team Sports' },
    { name: 'Football', category: 'Team Sports' },
    { name: 'Cricket', category: 'Team Sports' },
    { name: 'Running', category: 'Cardio' },
    { name: 'Cycling', category: 'Cardio' },
    { name: 'Zumba', category: 'Dance' },
];

// Sport categories with icons and colors
export const SPORT_CATEGORIES = [
    { value: 'Aquatics', label: 'Aquatics', color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700', textColor: 'text-blue-700 dark:text-blue-300' },
    { value: 'Martial Arts', label: 'Martial Arts', color: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700', textColor: 'text-red-700 dark:text-red-300' },
    { value: 'Racket Sports', label: 'Racket Sports', color: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700', textColor: 'text-green-700 dark:text-green-300' },
    { value: 'Gym & Fitness', label: 'Gym & Fitness', color: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700', textColor: 'text-purple-700 dark:text-purple-300' },
    { value: 'Skill & Precision', label: 'Skill & Precision', color: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700', textColor: 'text-orange-700 dark:text-orange-300' },
    { value: 'Mind & Body', label: 'Mind & Body', color: 'bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700', textColor: 'text-teal-700 dark:text-teal-300' },
    { value: 'Team Sports', label: 'Team Sports', color: 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700', textColor: 'text-indigo-700 dark:text-indigo-300' },
    { value: 'Cardio', label: 'Cardio', color: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700', textColor: 'text-yellow-700 dark:text-yellow-300' },
    { value: 'Dance', label: 'Dance', color: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700', textColor: 'text-pink-700 dark:text-pink-300' },
    { value: 'Other', label: 'Other', color: 'bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700', textColor: 'text-gray-700 dark:text-gray-300' },
];

// Facility Types - Keep in sync with backend Facility.model.js
export const FACILITY_TYPES = [
    { value: 'studio', label: 'Yoga/Dance Studio' },
    { value: 'pool', label: 'Swimming Pool' },
    { value: 'gym', label: 'Gym Floor' },
    { value: 'court', label: 'Sports Court' },
    { value: 'track', label: 'Running Track' },
    { value: 'field', label: 'Sports Field' },
    { value: 'arena', label: 'Indoor Arena' },
    { value: 'outdoor', label: 'Outdoor Area' },
];

// Facility Status Options
export const FACILITY_STATUS = [
    { value: 'available', label: 'Available' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'closed', label: 'Closed' },
];

export const MEMBERSHIP_TYPES = {
    Basic: {
        name: 'Basic',
        color: 'bg-gray-500',
        features: ['Access to gym', '2 classes per week'],
    },
    Silver: {
        name: 'Silver',
        color: 'bg-gray-400',
        features: ['Access to gym', '5 classes per week', 'Locker access'],
    },
    Gold: {
        name: 'Gold',
        color: 'bg-yellow-500',
        features: ['Unlimited gym access', 'Unlimited classes', 'Personal locker', '1 PT session/month'],
    },
    Platinum: {
        name: 'Platinum',
        color: 'bg-purple-500',
        features: ['All Gold features', '4 PT sessions/month', 'Spa access', 'Priority booking'],
    },
};

export const ROLES = {
    member: {
        name: 'Member',
        color: 'bg-blue-500',
        icon: '👤',
    },
    coach: {
        name: 'Coach',
        color: 'bg-green-500',
        icon: '🏋️',
    },
    admin: {
        name: 'Admin',
        color: 'bg-orange-500',
        icon: '⚙️',
    },
    superadmin: {
        name: 'Superadmin',
        color: 'bg-red-500',
        icon: '👑',
    },
};

export const NOTIFICATION_TYPES = {
    info: { color: 'bg-blue-500', icon: 'ℹ️' },
    success: { color: 'bg-green-500', icon: '✓' },
    warning: { color: 'bg-yellow-500', icon: '⚠️' },
    error: { color: 'bg-red-500', icon: '✕' },
};

export const STATUS_COLORS = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};