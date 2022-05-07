import mongoose from "mongoose"
const { Schema, model } = mongoose

const usersSchema = new Schema(
  {
    firstName: { type: String, required: true },

    lastName: { type: String, required: true },

    username: { type: String, required: true, unique: true },

    favorites: [{ type: Schema.Types.ObjectId, ref: "Favorite" }],
  },
  { timestamps: true }
)
export default model("User", usersSchema)
