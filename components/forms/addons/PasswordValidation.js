import React from "react";
import styled from "styled-components";
import { Typography, Space } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
const { Text } = Typography;

const PasswordValidationWrapper = styled.div`
    margin-top: -10px;
    margin-bottom: 10px;
`;

function PasswordValidation({ passwordValidationObject }) {
  const { specialCharacter, number, minLength, lowerCaseRE, upperCaseRE } =
    passwordValidationObject.requirements;

    
  return (
    <PasswordValidationWrapper>
      <Space direction="vertical">
        <Text>{specialCharacter ? <CheckCircleFilled style={{color: "#52c41a"}}/> : <CloseCircleFilled style={{color: "#c0392b"}} />} Have at least one special character (!@#$%^&*)</Text>
        <Text>{number ? <CheckCircleFilled style={{color: "#52c41a"}}/> : <CloseCircleFilled style={{color: "#c0392b"}} />} Have at least one number</Text>
        <Text>{minLength ? <CheckCircleFilled style={{color: "#52c41a"}}/> : <CloseCircleFilled style={{color: "#c0392b"}} />} Be at least 7 characters long</Text>
        <Text>{lowerCaseRE ? <CheckCircleFilled style={{color: "#52c41a"}}/> : <CloseCircleFilled style={{color: "#c0392b"}} />} Have at least one lowercase letter</Text>
        <Text>{upperCaseRE ? <CheckCircleFilled style={{color: "#52c41a"}}/> : <CloseCircleFilled style={{color: "#c0392b"}} />} Have at least one uppercase letter</Text>
      </Space>
    </PasswordValidationWrapper>
  );
}

export default PasswordValidation;
