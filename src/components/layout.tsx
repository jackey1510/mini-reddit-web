import React from "react";
import NavBar from "./NavBar";
import Wrapper, { WrapperProps } from "./Wrapper";

interface layoutProps extends WrapperProps {}

export const layout: React.FC<layoutProps> = ({ variant, children }) => {
  return (
    <Wrapper variant={variant}>
      <NavBar>{children}</NavBar>
    </Wrapper>
  );
};
