import { Card, CompoundTag } from "@blueprintjs/core";
import { Tag } from "@blueprintjs/core";
import { Time } from "@blueprintjs/icons";
import { motion } from "motion/react";

const MotionCard = motion(Card);
const CapstoneIdea = ({ idea }) => {
  return (
    <MotionCard
      key={idea.title}
      elevation={2}
      className="w-full h-full !space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: "easeIn",
        },
      }}
      exit={{ opacity: 0 }}
    >
      <h1 className="font-semibold">{idea.title}</h1>
      <ul className="flex items-center flex-wrap gap-2">
        {idea?.tags.map((tag) => (
          <li key={tag}>
            <Tag
              key={tag}
              minimal={true}
              interactive
              round={true}
              className="capitalize"
            >
              {tag}
            </Tag>
          </li>
        ))}
      </ul>
      <h2 className="flex items-center gap-2 text-gray-400 mt-4">
        <Time />
        {idea.project_duration}
      </h2>
      <CompoundTag leftContent="Industry" className="capitalize">
        {idea.type_of_industry}
      </CompoundTag>
      <article className="prose w-full mt-10">
        <h3 className="font-medium">Objective</h3>
        <p>{idea.objective}</p>
      </article>
      <div className="flex flex-col md:flex-row w-full items-center justify-start md:justify-center">
        <div className="w-full md:w-1/2">
          <article className="prose">
            <h4>Tools might use:</h4>
            <ul className="list-disc">
              {idea.possible_tools?.map((tool) => {
                return (
                  <li key={tool} className="capitalize">
                    {tool}
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
        <div className="w-full md:w-1/2">
          <article className="prose">
            <h4>Simillar Capstone:</h4>
            <ul className="list-disc">
              {idea.simillar_capstone?.map((capstone) => {
                return (
                  <li key={capstone} className="capitalize">
                    <a href={capstone.link}>{capstone.title}</a>.
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
      </div>
    </MotionCard>
  );
};

export default CapstoneIdea;
