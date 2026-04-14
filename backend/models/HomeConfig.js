import mongoose from "mongoose";

const { Schema } = mongoose;

const homeConfigSchema = new Schema(
  {
    hero1Product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    hero2Product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    carouselProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    galleryProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("HomeConfig", homeConfigSchema);
