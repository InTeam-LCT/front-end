import {
  Modal,
  Button,
  Upload,
  Select,
  InputNumber,
  message,
  UploadFile,
  UploadProps,
  Form,
  Tooltip,
} from "antd";
import { UploadOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Api } from "../api";
import { UploadFileFormValues } from "../types/UploadFileForm";

const normalizeFile = (e: UploadFile[] | { fileList: UploadFile[] }) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const UploadButton = function () {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setUploading(false);
    setIsModalOpen(false);
  };

  const uploadFile = (values: UploadFileFormValues) => {
    const { numberSheet, skipRow, DocumentType } = values;
    const formData = new FormData();
    formData.append("file", values.fileList[0].originFileObj as File);

    setUploading(true);

    Api.uploadFile({ numberSheet, skipRow, DocumentType }, formData)
      .then(() => {
        message.success("Успешно");
        setIsModalOpen(false);
      })
      .catch(() => {
        message.error("Ошибка");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const uploadProps: UploadProps = {
    onRemove: () => {
      form.setFieldValue("fileList", []);
    },
    beforeUpload: (file: File) => {
      form.setFieldValue("fileList", [file]);
      return false;
    },
    fileList: form.getFieldsValue(),
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Импорт из XLS
      </Button>
      <Modal
        title="Импорт из XLS"
        transitionName=""
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        styles={{
          body: { minHeight: 100 },
        }}
        destroyOnClose
        modalRender={(slot) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            clearOnDestroy
            onFinish={uploadFile}
          >
            {slot}
          </Form>
        )}
      >
        <>
          <Form.Item
            label="Тип документа"
            name="DocumentType"
            rules={[{ required: true, message: "Заполните поле" }]}
            initialValue={"BTI"}
          >
            <Select
              style={{ minWidth: 200 }}
              options={[
                { value: "BTI", label: <span>Выгрузка БТИ</span> },
                { value: "EVENTS", label: <span>События</span> },
                { value: "ADDRESSES", label: <span>Адреса</span> },
                { value: "MOEK", label: <span>Схема подключений МОЭК</span> },
                { value: "ASURP", label: <span>Данные АСУПР с диспетчерскими ОДС</span> },
                { value: "CHARACTERISTIC", label: <span>Технико-экономические характеристики</span> },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Номер листа"
            name="numberSheet"
            rules={[{ required: true, message: "Заполните поле" }]}
            initialValue={1}
          >
            <InputNumber min={1} placeholder="1" />
          </Form.Item>
          <Form.Item
            label={
              <>
                Пропустить строк{" "}
                <Tooltip title="Количество строк без данных (названия столбцов и т.п.)">
                  <QuestionCircleOutlined
                    style={{ marginLeft: 6, color: "gray", fontSize: 14 }}
                  />
                </Tooltip>
              </>
            }
            name="skipRow"
            initialValue={1}
            rules={[{ required: true, message: "Заполните поле" }]}
          >
            <InputNumber min={1} placeholder="1" />
          </Form.Item>
          <Form.Item
            name="fileList"
            label="Загрузить файл"
            valuePropName="fileList"
            getValueFromEvent={normalizeFile}
            rules={[{ required: true, message: "Загрузите файл" }]}
          >
            <Upload {...uploadProps} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Button
            type="primary"
            loading={uploading}
            htmlType="submit"
            className="mt-4"
          >
            {uploading ? "Загружаем" : "Начать загрузку"}
          </Button>
        </>
      </Modal>
    </>
  );
};

export default UploadButton;
