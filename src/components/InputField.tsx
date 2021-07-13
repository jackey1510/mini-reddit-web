import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import _ from "lodash";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  label: string;
  textarea?:boolean
};



export const InputField: React.FC<InputFieldProps> = ({
	label,
	textarea,
  size = _,
  ...props
}) => {
	const [field, { error }] = useField(props);
	let InputOrTextArea :typeof Input| typeof Textarea  = Input;
	if (textarea) {
		InputOrTextArea = Textarea;
	}
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextArea
        {...field}
		{...props}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error?<FormErrorMessage>{error}</FormErrorMessage>:null}
    </FormControl>
  );
};
export default InputField;
