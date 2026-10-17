import { useState } from 'react';
import Section from './ui/Section';
import CaseFile from './CaseFile';
import { projectsData } from '../data/portfolioData';

export default function FieldWork() {
  // One case open at a time keeps the section scannable.
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Section
      id="fieldwork"
      label="FIELD WORK — SELECTED PROJECTS"
      figure="FIG. 05"
      inv
      title={
        <>
          Six systems,
          <br />
          <em>one method.</em>
        </>
      }
      lede="From churn pipelines to patented hardware — each entry is a full case analysis, not a thumbnail."
    >
      {projectsData.map((project, index) => (
        <CaseFile
          key={project.id}
          project={project}
          index={index}
          open={openIndex === index}
          onToggle={() => setOpenIndex((prev) => (prev === index ? null : index))}
        />
      ))}
    </Section>
  );
}
