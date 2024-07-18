/** Import necessary libraries */
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Constants */
const SLUG_WORKS = [
  "car",
  "dog",
  "computer",
  "person",
  "inside",
  "word",
  "for",
  "please",
  "to",
  "cool",
  "open",
  "source",
];
const SERVICE_URL = "https://droplet.kubertestingayush.xyz";

/** Styled components */
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: white;
`;

const StyledInput = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledSelect = styled.select`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

/** Helper function */
function getRandomSlug() {
  let slug = "";
  for (let i = 0; i < 3; i++) {
    slug += SLUG_WORKS[Math.floor(Math.random() * SLUG_WORKS.length)];
  }
  return slug;
}

/** Component */
export const Landing = () => {
  const [language, setLanguage] = useState("node-js");
  const [replId, setReplId] = useState(getRandomSlug());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const test = (e) => {
    console.log(e);
  };

  return (
    <div className="w-full h-[90vh] flex items-center justify-center">
      <Card className="w-[350px] bg-stone-50">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  onChange={(e) => setReplId(e.target.value)}
                  type="text"
                  placeholder="Repl ID"
                  value={replId}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Framework</Label>
                <Select
                  // onChange={(e) => {
                  //   test(e);
                  // }}
                  onValueChange={(e) => setLanguage(e)}
                >
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="node-js">Node.js</SelectItem>
                    <SelectItem value="sveltekit">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {loading ? (
            <ButtonLoading />
          ) : (
            <Button
              onClick={async () => {
                setLoading(true);
                await axios.post(`${SERVICE_URL}/project`, {
                  replId,
                  language,
                });
                setLoading(false);
                navigate(`/coding/?replId=${replId}`);
              }}
            >
              {"Start Coding"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>

    // <Container>
    //   <Title>Lepl lit</Title>
    //   <StyledInput
    // onChange={(e) => setReplId(e.target.value)}
    // type="text"
    // placeholder="Repl ID"
    // value={replId}
    //   />
    //   <StyledSelect
    //     name="language"
    //     id="language"
    //     onChange={(e) => setLanguage(e.target.value)}
    //   >
    //     <option value="node-js">Node.js</option>
    //     <option value="python">Python</option>
    //   </StyledSelect>
    //   {loading ? (
    //     <ButtonLoading />
    //   ) : (
    //     <Button
    //       onClick={async () => {
    //   setLoading(true);
    //   await axios.post(`${SERVICE_URL}/project`, { replId, language });
    //   setLoading(false);
    //   navigate(`/coding/?replId=${replId}`);
    // }}
    //     >
    //       {"Start Coding"}
    //     </Button>
    //   )}
    // </Container>
  );
};
