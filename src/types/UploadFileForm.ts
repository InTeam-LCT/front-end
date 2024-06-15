import { UploadFile } from "antd";

export type UploadFileFormValues = {
  fileList: UploadFile[];
  numberSheet: number;
  skipRow: number;
  DocumentType: string;
};
