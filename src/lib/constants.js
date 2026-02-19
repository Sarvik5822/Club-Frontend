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