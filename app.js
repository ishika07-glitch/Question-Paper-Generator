const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

const questionStore = [
  {
    question: "What is the speed of light",
    subject: "Physics",
    topic: "Waves",
    difficulty: "Easy",
    marks: 5,
  },
  {
    question: "What is the newton's law of motion",
    subject: "Physics",
    topic: "Mechanics",
    difficulty: "Medium",
    marks: 10,
  },
];

app.post("/generate-paper", (req, res) => {
  const { totalMarks, difficultyDistribution } = req.body;

  if (!totalMarks || !difficultyDistribution) {
    return res.status(400).json({
      error:
        "Invalid request. Please provide totalMarks and difficultyDistribution.",
    });
  }

  const questionPaper = generateQuestionPaper(
    totalMarks,
    difficultyDistribution
  );
  res.json({ questionPaper });
});

function generateQuestionPaper(totalMarks, difficultyDistribution) {
  const questionPaper = [];
  const shuffledQuestions = [...questionStore].sort(() => Math.random() - 0.5);

  difficultyDistribution.forEach(({ difficulty, percentage }) => {
    const marksForDifficulty = Math.floor(totalMarks * (percentage / 100));

    for (const question of shuffledQuestions) {
      if (
        question.difficulty === difficulty &&
        question.marks <= marksForDifficulty
      ) {
        questionPaper.push(question);
        totalMarks -= question.marks;
      }
    }
  });

  return questionPaper;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
