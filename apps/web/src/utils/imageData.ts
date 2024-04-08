export type ImageUncompressedData = Uint8ClampedArray;
export type ImageUncompressed = {
  width: number;
  height: number;
  data: ImageUncompressedData;
};

export type ImageCompressedData = Blob;
export type ImageCompressed = {
  width: number;
  height: number;
  data: ImageCompressedData;
};
