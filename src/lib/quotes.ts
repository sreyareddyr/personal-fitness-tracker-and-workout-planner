export const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Success starts with self-discipline.",
  "Push yourself because no one else is going to do it for you.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Don't wish for it, work for it.",
  "Strive for progress, not perfection.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Believe in yourself and all that you are.",
  "Train like a beast, look like a beauty.",
  "Your health is an investment, not an expense.",
  "The harder you work, the luckier you get.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "Fall in love with taking care of yourself.",
  "A one hour workout is only 4% of your day.",
  "Make yourself a priority once in a while.",
];

export const getRandomQuote = (): string => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};
