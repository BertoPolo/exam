import mongoose from "mongoose"

const { Schema, model } = mongoose

const favoritesSchema = new Schema(
  {
    name: { type: String, required: true },

    type: { type: String, required: true },

    username: [{ type: Schema.Types.ObjectId, ref: "User" }],

    image: { type: String, required: true },

    description: { type: String },
  },
  { timestamps: true }
)
export default model("Favorite", favoritesSchema)
