// Test script to verify widget configuration
console.log("Widget Configuration Test:");
console.log("========================");

fetch('/api/widget-config')
  .then(response => response.json())
  .then(config => {
    console.log("✅ API Configuration Loaded Successfully");
    console.log("Groq API Key:", config.groqApiKey ? "✓ Configured" : "✗ Missing");
    console.log("Minimax API Key:", config.minimaxApiKey ? "✓ Configured" : "✗ Missing");
    console.log("Minimax Group ID:", config.minimaxGroupId ? "✓ Configured" : "✗ Missing");
    console.log("Minimax Model:", config.minimaxModel);
    console.log("Default Voice:", config.voice);
    
    if (config.groqApiKey && config.minimaxApiKey && config.minimaxGroupId) {
      console.log("\n🎉 ALL API KEYS CONFIGURED!");
      console.log("The widget is ready to use with full voice capabilities.");
      console.log("\nNext steps:");
      console.log("1. Visit /widget to use the voice AI chat widget");
      console.log("2. Click the microphone button to start speaking");
      console.log("3. Allow microphone permissions when prompted");
      console.log("4. Speak in Nigerian English and enjoy the conversation!");
    } else {
      console.log("\n⚠️  Some API keys are missing. Please check Vercel environment variables.");
    }
  })
  .catch(error => {
    console.error("❌ Error loading configuration:", error);
  });