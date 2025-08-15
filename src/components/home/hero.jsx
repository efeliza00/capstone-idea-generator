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
import { AnimatePresence, motion } from "motion/react";

const MotionCard = motion(Card);
const Hero = () => {
  const [idea, setIdea] = useState();
  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedDifficulty, setSelectedDifficulty] = useState();
  const prompt = `
You are a professional capstone project idea generator.
Generate one realistic and innovative capstone project idea tailored to the provided course and difficulty level.

The capstone idea must be directly related to the field of the selected course and must strictly avoid technology-based solutions unless the course is IT-related. 
Examples:
- Education courses → create teaching strategies, curriculum design, instructional materials, assessment tools, or field studies. Do NOT suggest software, apps, AI, or any digital platform unless the course is IT-related.
- Engineering courses → create structural designs, prototypes, mechanical systems, or physical models relevant to the engineering field.
- Business courses → create business plans, marketing strategies, financial systems, or feasibility studies.
- Health sciences courses → create health programs, laboratory procedures, patient care innovations, or medical studies.
- Agriculture/fisheries → create sustainable farming methods, breeding programs, or field experiments.
- Arts/social sciences → create creative works, cultural studies, communication campaigns, or research papers.

Return the result strictly in the following JSON format:

{
  "Subject": "string",
  "title": "string",
  "objective": "string",
  "type_of_industry": "string",
  "difficulties": ["string", "string", "string"],
  "possible_tools": ["string", "string", "string"], 
  "project_duration": "string (2-3 months')",
  "tags": ["string", "string", "string"],
  "simillar_capstone": [{
    "title": "string",
    "link": "string"
  }]
}

Rules:
- No markdown, comments, or extra text.
- All strings must be plain text.
- All array values lowercase except for proper nouns.
- Make it unique and realistic for a university-level capstone.
- On possible_tools: for non-IT courses, list only physical tools, instruments, printed materials, or field-specific resources. For IT courses, list relevant technologies or programming tools.
- On simillar_capstone: use real project links; if none found, do not generate any.
- Never include words like "software", "application", "website", "AI", or "digital" unless the course is IT-related.

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
      <motion.h1
        className={`leading-10 md:leading-none font-medium uppercase text-green-700  !m-0 !text-5xl md:!text-9xl`}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeIn",
          },
        }}
        viewport={{ once: true }}
      >
        Capstone Idea Generator
      </motion.h1>
      <motion.p
        className="text-gray-400 text-xl md:text-2xl"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeIn",
            delay: 0.5,
          },
        }}
        viewport={{ once: true }}
      >
        Generate some ideas and start building.
      </motion.p>
      <Button
        endIcon="clean"
        intent="success"
        onClick={handleGenerateIdea}
        variant="solid"
        size="large"
        className="!mt-10"
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
      <AnimatePresence>
        {idea ? (
          <CapstoneIdea idea={idea} />
        ) : (
          <MotionCard
            className="flex w-full h-40 items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: "easeIn",
              },
            }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-gray-400 text-2xl font-medium">
              Your idea will be displayed here.
            </h3>
          </MotionCard>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
