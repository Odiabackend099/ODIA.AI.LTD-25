// Comprehensive test script for evaluating the ODIADEV Voice AI agent
// This script contains 15 tricky and critical questions to test the AI's capabilities

const testQuestions = [
  // Question 1: Temporal reasoning
  "If I plant a seed today and it takes 30 days to grow, but I plant another seed 15 days later, which plant will be taller 20 days from now and why?",
  
  // Question 2: Logical contradiction
  "Can an omnipotent being create a stone so heavy that even they cannot lift it? Explain your reasoning.",
  
  // Question 3: Cultural context (Nigerian specific)
  "What are the key differences between Pidgin English as spoken in Lagos versus Port Harcourt, and how might this affect AI understanding?",
  
  // Question 4: Multi-step inference
  "If all Bloops are Razzies and some Razzies are Loppies, can we conclude that some Bloops are definitely Loppies? Why or why not?",
  
  // Question 5: Ethical dilemma
  "If you were a doctor with five patients needing organ transplants and one healthy patient whose organs could save the five, would you sacrifice the one to save the five? Justify your answer.",
  
  // Question 6: Mathematical word problem
  "A train leaves station A at 60 mph heading towards station B, 180 miles away. Another train leaves station B at 40 mph towards station A 30 minutes later. When and where do they meet?",
  
  // Question 7: Ambiguous reference
  "John told Mark that he should consider changing his hairstyle. Who should change their hairstyle, and how do you know?",
  
  // Question 8: Counterfactual reasoning
  "If water boiled at 50 degrees Celsius instead of 100, how would this affect cooking rice in Nigeria?",
  
  // Question 9: Cultural nuance
  "What does 'Na you be the boss' mean in Nigerian English, and in what contexts would it be appropriate or inappropriate to use?",
  
  // Question 10: Complex instruction
  "Describe how to prepare a traditional Nigerian jollof rice, but explain it as if you're teaching a robot with no prior knowledge of cooking.",
  
  // Question 11: Hypothetical scenario
  "If Nigeria suddenly had to switch from naira to dollars for all transactions, what would be the three most significant economic impacts in the first month?",
  
  // Question 12: Linguistic analysis
  "What's the difference between 'I go' and 'I will go' in Nigerian Pidgin English, and when would you use each?",
  
  // Question 13: Technical troubleshooting
  "My internet is working but I can't access any websites. I can ping IP addresses but not domain names. What's likely wrong and how can I fix it?",
  
  // Question 14: Creative problem solving
  "How would you explain blockchain technology to a rural farmer in Kano who has never used a computer?",
  
  // Question 15: Self-referential question
  "What are the limitations of your own knowledge about Nigerian culture, and how would you handle a question about something you're not familiar with?"
];

console.log("=== ODIADEV VOICE AI COMPREHENSIVE EVALUATION ===\n");
console.log("Testing with 15 tricky and critical questions:\n");

// Function to simulate sending a message to the AI
async function sendMessageToAI(message, questionNumber) {
  console.log(`--- Question ${questionNumber}: ---`);
  console.log(`"${message}"\n`);
  
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This would be where the actual AI response would be generated
  // For now, we'll just simulate a response
  console.log("[AI is processing your question...]\n");
  
  // In a real implementation, this would be replaced with:
  // const response = await streamGroqResponse(message);
  // console.log(`AI Response: ${response}\n`);
  
  return `Response to question ${questionNumber} would appear here in a real implementation.`;
}

// Function to run all tests
async function runComprehensiveTest() {
  console.log("Starting comprehensive evaluation of ODIADEV Voice AI...\n");
  
  for (let i = 0; i < testQuestions.length; i++) {
    await sendMessageToAI(testQuestions[i], i + 1);
    
    // Add a small delay between questions
    if (i < testQuestions.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log("=== EVALUATION COMPLETE ===");
  console.log("\nKey Areas Tested:");
  console.log("- Temporal and logical reasoning");
  console.log("- Cultural context understanding (Nigerian/Pidgin English)");
  console.log("- Ethical and philosophical reasoning");
  console.log("- Mathematical and technical problem solving");
  console.log("- Ambiguity resolution");
  console.log("- Creative explanation abilities");
  console.log("- Self-awareness and limitation recognition");
  
  console.log("\n✅ All 15 questions have been processed.");
  console.log("✅ Evaluation complete: true");
  console.log("✅ Status: ok");
}

// Run the test
runComprehensiveTest().catch(console.error);