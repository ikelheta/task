import mongoose from "mongoose"
const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    level: {
      type: String,
      enum: ['junior', 'midlevel', 'senior'],
      required: [true, 'Please provide your experience level'],
    },
    requirments: {
      type: String,
      required: [true, "please provide requirments"],
      maxlength: 500
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'Employeer',
      required: [true, 'Please provide user'],
    },
    applications: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
      default: []
    },
    accepted: {
      type: mongoose.Types.ObjectId || null,
      ref: "Employee",
      default: null
    },
    rejected: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
      default: []
    },
  },
  { timestamps: true }
)


export default mongoose.model('Job', JobSchema)