import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
  pact: { type: mongoose.Schema.Types.ObjectId, ref: "Pact", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  text: { type: String, required: true },
  isAI: { type: Boolean, default: false },
  isWorkout: { type: Boolean, default: false },
  photoUrl: { type: String, default: null },
}, { timestamps: true })

export default mongoose.models.Message || mongoose.model("Message", MessageSchema)