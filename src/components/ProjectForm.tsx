import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { createProject, updateProject } from '../api/projects';

const ProjectForm = ({ project, onSuccess }: any) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: {
    name: string;
    description: string;
  }) => {
    try {
      if (project) {
        await updateProject(project.id, values);
        message.success('Project updated successfully');
      } else {
        await createProject(values);
        message.success('Project created successfully');
      }
      onSuccess();
    } catch (error) {
      message.error('An error occurred');
    }
  };

  return (
    <Form size='small' form={form} initialValues={project} onFinish={handleSubmit}>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {project ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProjectForm;
