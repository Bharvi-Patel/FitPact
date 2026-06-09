import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    streak: { type: Number, default: 0 },
    strikes: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    restDayUsed: { type: Boolean, default: false },
    lastWorkout: { type: Date, default: null },
    weeklyGoal: { type: Number, default: 6 },
    pact: { type: mongoose.Schema.Types.ObjectId, ref: "Pact", default: null },
    height: { type: Number, default: null },
    weight: { type: Number, default: null },
    age: { type: Number, default: null },
    bmi: { type: Number, default: null },
    goals: { type: [String], default: [] },
    workoutPlan: { type: String, default: null },
    fitnessLevel: { type: String, default: null },
},{ timestamps: true })

export default mongoose.models.User || mongoose.model("User", UserSchema)