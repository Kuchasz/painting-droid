import type { ImageCompressed } from "@/utils/imageData";
import type { BaseModel } from "./baseModel";
import type {
  CustomFieldsSchema,
  CustomFieldsSchemaValues,
} from "@/utils/customFieldsSchema";

export type TextToImageSection<TSchema extends CustomFieldsSchema> = {
  optionsSchema: TSchema;
  execute: (
    modelId: string,
    text: string,
    options: CustomFieldsSchemaValues<TSchema>
  ) => Promise<ImageCompressed>;
};

export const createTextToImageSection = <TSchema extends CustomFieldsSchema>(
  section: TextToImageSection<TSchema>
) => section;

export type TextToImageModel = BaseModel & {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  textToImage: TextToImageSection<any>;
};

