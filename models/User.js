import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    streak: { type: Number, default: 0 },
    strikes: { type: Number, default: 0 },
    restDayUsed: { type: Boolean, default: false },
    lastWorkout: { type: Date, default: null },
    weeklyGoal: { type: Number, default: 6 },
    pact: { type: mongoose.Schema.Types.ObjectId, ref: "Pact", default: null },
},{ timestamps: true })

export default mongoose.models.User || mongoose.model("User", UserSchema)