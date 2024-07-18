import { ReactNode } from "react";
import styled from "@emotion/styled";

export const Sidebar = ({ children }: { children: ReactNode }) => {
  return <Aside className="bg-card min-w-[200px]">{children}</Aside>;
};

const Aside = styled.aside`
  height: 88vh;
  border-right: 2px solid;
  border-color: #242424;
  padding-top: 3px;
`;

export default Sidebar;
