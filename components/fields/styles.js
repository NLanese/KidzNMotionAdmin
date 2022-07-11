import styled from "styled-components";
import {  Form, Typography } from "antd";

const { Text } = Typography;

export const FormItem = styled(Form.Item)`
  position: relative;
  margin-bottom: 18px;
`;

export const FormLabel = styled(Text)`
  display: block;
  margin-bottom: 4px;
  & span {
    padding-left: 2px;
    color: ${(props) => props.theme.colors.danger};
  }
`;

export const ErrorText = styled(Text)`
  display: block;
  position: absolute;
  color: ${(props) => props.theme.colors.danger};
`;
