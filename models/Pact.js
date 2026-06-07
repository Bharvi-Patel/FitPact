import mongoose from "mongoose"

const PactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    inviteCode: { type: String, required: true, unique: true },
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    weeklyGoal: { type: Number, default: 6 },
},{ timestamps: true })

export default mongoose.models.Pact || mongoose.model("Pact", PactSchema)