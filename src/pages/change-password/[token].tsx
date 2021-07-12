import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient, WithUrqlProps } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { creatUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

const ResetPassword: NextPage< {token:string}> = ({token}) =>{
	const [,changePassword] = useChangePasswordMutation();
	const router = useRouter();
	const [tokenError, setTokenError] = useState('');
	return (<Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: ""}}
        onSubmit={async (values, { setErrors }) => {
      
			const res = await changePassword({newPassword: values.newPassword, token})
         
          if (res.data?.changePassword.errors) {
			  const errorMap = toErrorMap(res.data.changePassword.errors);
			  if('token' in errorMap){
				setTokenError(errorMap.token);
			  }
            return setErrors(errorMap);
          }
          if (res.data?.changePassword.user) {
            router.push("/");
          } 
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new Password"
              label="New Password"
            ></InputField>
			{tokenError ? <Box color='red'>{tokenError}</Box> : null}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              reset password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>);
}

ResetPassword.getInitialProps= ({query}) =>{
	return{
		token:query.token as string
	}
}

export default withUrqlClient(creatUrqlClient)(ResetPassword);