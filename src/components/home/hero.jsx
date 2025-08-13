import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  FormGroup,
  MenuItem,
} from "@blueprintjs/core";
import { client } from "../../../libs/cerebras";
import { useState } from "react";
import { Select } from "@blueprintjs/select";
import { courses } from "../../constants/courses";
import CapstoneIdea from "../capstone-idea";

const Hero = () => {
  const [idea, setIdea] = useState();
  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedDifficulty, setSelectedDifficulty] = useState();

  const prompt = `
You are a professional capstone project idea generator.
Generate one realistic and innovative capstone project idea and return it strictly in the following JSON format:

{
  "Subject": "string",
  "title": "string",
  "objective": "string",
  "type_of_industry": "string",
  "difficulties": ["string", "string", "string"],
  "possible_tools": ["string", "string", "string"],
  "project_duration": "string (2-3 months')",
  "tags": ["string", "string", "string"]
"simillar_capstone": [{
    "title":"string",
    "link": "string"
}]
}

NOTE: on possible tools, techstack for it related capstones, and tools can be used for the project for non-IT related ideas.
NOTE: on simillar capstone use real projects links if you can't find one dont generate.
NOTE: make sure the title have proper capitalization
Rules:
- No markdown, comments, or extra text.
- All strings must be plain text.
- All array values lowercase except for proper nouns.
- Make it unique and realistic for a university-level capstone.


Filters:
Course: ${selectedCourse},
Difficulty: ${selectedDifficulty},
`;
  const handleGenerateIdea = async () => {
    const completionCreateResponse = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-4-scout-17b-16e-instruct",
      response_format: { type: "json_object" },
    });
    if (completionCreateResponse)
      setIdea(JSON.parse(completionCreateResponse.choices[0].message.content));
  };

  const renderCourses = (course, { handleClick, handleFocus, modifiers }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={course}
        onClick={handleClick}
        onFocus={handleFocus}
        roleStructure="listoption"
        text={`${course}`}
      />
    );
  };
  return (
    <div className="container max-w-9/10 md:max-w-2/3 mx-auto my-26 flex items-center flex-col">
      <h1 className="leading-7 font-extrabold  text-green-700  text-3xl md:!text-5xl">
        Capstone Idea Generator
      </h1>
      <p className="text-gray-400">Generate some ideas and start building.</p>
      <Button
        endIcon="clean"
        intent="success"
        onClick={handleGenerateIdea}
        variant="solid"
      >
        Generate
      </Button>
      <Card elevation={1} compact className="w-full my-10">
        <h2 className="font-semibold text-lg md:text-xl">
          Suggestions or Filters
        </h2>
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
          <FormGroup
            helperText="Select a desired course"
            label="Courses"
            labelFor="text-input"
            labelInfo="(required)"
            className="col-span-3"
          >
            <Select
              id="courses"
              items={courses}
              filterable={false}
              itemRenderer={renderCourses}
              onItemSelect={setSelectedCourse}
            >
              <Button
                text={selectedCourse ?? "Select a Course"}
                endIcon="double-caret-vertical"
              />
            </Select>
          </FormGroup>
          <FormGroup
            label="Difficulty"
            labelFor="text-input"
            labelInfo="(required)"
            className="col-span-4"
          >
            <ButtonGroup>
              <Button
                text="Easy"
                intent={selectedDifficulty === "easy" ? "success" : "none"}
                onClick={() => setSelectedDifficulty("easy")}
              />
              <Button
                text="Medium"
                intent={selectedDifficulty === "medium" ? "success" : "none"}
                onClick={() => setSelectedDifficulty("medium")}
              />
              <Button
                text="Hard"
                intent={selectedDifficulty === "hard" ? "success" : "none"}
                onClick={() => setSelectedDifficulty("hard")}
              />
            </ButtonGroup>
          </FormGroup>
        </div>
      </Card>
      {idea ? (
        <CapstoneIdea idea={idea} />
      ) : (
        <Card className="flex w-full h-40 items-center justify-center">
          <h3 className="text-gray-400 text-2xl font-medium">
            Your idea will be displayed here.
          </h3>
        </Card>
      )}
    </div>
  );
};

export default Hero;
