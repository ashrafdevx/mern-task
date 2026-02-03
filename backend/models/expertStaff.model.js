const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s\-+()]{10,15}$/;

const expertStaffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    image: {
      type: String,
      default: 'placeholder.jpg',
    },
    experience: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
      default: 0,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => !v || emailRegex.test(v),
        message: 'Invalid email format',
      },
    },
    phone: {
      type: String,
      validate: {
        validator: (v) => !v || phoneRegex.test(v),
        message: 'Invalid phone format (10-15 digits)',
      },
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      github: String,
    },
    specialization: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

expertStaffSchema.index({ name: 1 });
expertStaffSchema.index({ isActive: 1 });

expertStaffSchema.virtual('experienceText').get(function () {
  const years = this.experience;
  return years === 1 ? '1 year' : `${years} years`;
});

const ExpertStaff = mongoose.model('ExpertStaff', expertStaffSchema);

module.exports = { ExpertStaff };
