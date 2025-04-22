import React, { useEffect, useMemo, useState } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import {
  createTranslationKey,
  updateTranslationKey,
} from '@api/translationKeys';
interface Translation {
  language: string;
  value: string;
}

interface TranslationKey {
  id?: number;
  keyName: string;
  description?: string;
  translations: Translation[];
}
const TranslationKeyForm = ({
  projectId,
  translationKey,
  onSuccess,
  projectList,
}: any) => {
  const [form] = Form.useForm();
  console.log(translationKey, 'translationKey');
  const initialValues: Record<string, string> = {
    keyName: translationKey?.keyName || '',
    description: translationKey?.description || '',
  };
  // const [initialValues, setInitialValues] = useState({
  //   keyName: translationKey?.keyName || "",
  //   description: translationKey?.description || "",
  // })
  // useEffect(()=>{
  //   if (translationKey) {
  //     const temp: any = []
  //     for (const element of translationKey.translations) {
  //       // console.log(element.language, element.value)
  //       temp.push([element.language, element.value]);
  //     }
  //     console.log(temp, 111)
  //     form.setFieldsValue([
  //       [temp]
  //     ])
  //     // setInitialValues({
  //     //   ...initialValues,
  //     //   ...temp
  //     // })
  //   }
  // }, [translationKey])
  const projectName = useMemo(() => {
    return projectList.find((project: any) => project.id === projectId)?.name;
  }, [projectId, projectList]);

  const handleSubmit = async (values: any) => {
    try {
      const { keyName, en, zh_cn, zh_hant, es, fr, it, ja, kr, description } =
        values;
      const params = {
        keyName,
        description,
        translations: [
          {
            language: 'en-US',
            value: values['en-US'],
          },
          {
            language: 'zh-CN',
            value: values['zh-CN'],
          },
          {
            language: 'zh-Hant',
            value: values['zh-Hant'],
          },
          {
            language: 'es',
            value: es,
          },
          {
            language: 'fr',
            value: fr,
          },
          {
            language: 'it',
            value: it,
          },
          {
            language: 'ja',
            value: ja,
          },
          {
            language: 'kr',
            value: kr,
          },
        ],
      };
      if (translationKey) {
        const res = await updateTranslationKey(
          projectId,
          translationKey.id,
          params,
        );
        if (res.code === 200) {
          message.success('Translation key updated successfully');
          onSuccess();
        }
      } else {
        const res = await createTranslationKey(projectId, params);
        if (res.code === 200) {
          message.success('Translation key updated successfully');
          onSuccess();
        }
      }
    } catch (error) {
      // message.error("An error occurred");
    }
  };
  if (translationKey) {
    for (const element of translationKey.translations) {
      console.log(element.language, element.value);
      // temp.push([element.language, element.value]);
      initialValues[element.language] = element.value;
    }
  }

  return (
    <Form
      size="small"
      form={form}
      initialValues={initialValues}
      onFinish={handleSubmit}
      clearOnDestroy
    >
      <Form.Item label="项目名称">{projectName}</Form.Item>
      <Form.Item name="keyName" label="Key Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="en-US" label="en-US" rules={[{ required: false }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="zh-CN" label="zh-CN" rules={[{ required: false }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="zh-Hant" label="zh-Hant" rules={[{ required: false }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="es" label="es" rules={[{ required: false }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="fr" label="fr" rules={[{ required: false }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="it" label="it" rules={[{ required: false }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="ja" label="ja" rules={[{ required: false }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="kr" label="kr" rules={[{ required: false }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {translationKey ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TranslationKeyForm;
