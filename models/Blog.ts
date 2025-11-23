import { randomUUID } from "crypto";
import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

const BlogSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => randomUUID(),
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    publishedAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { timestamps: false, versionKey: false }
);

BlogSchema.index({ slug: 1 });

export type BlogSchemaType = InferSchemaType<typeof BlogSchema>;
export type BlogDocument = HydratedDocument<BlogSchemaType>;

const BlogModel: Model<BlogSchemaType> =
  (models.Blog as Model<BlogSchemaType>) || model("Blog", BlogSchema);

export default BlogModel;
