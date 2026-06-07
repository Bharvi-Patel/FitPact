import mongoose from 'mongoose';

const WorkoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pact: { type: mongoose.Schema.Types.ObjectId, ref: 'Pact', required: true },
    photoUrl: {type: String, required: true },
    note:{ type: String, default: "" },
    date: { type: Date, default: Date.now },
},{timestamps: true})

export default mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema)