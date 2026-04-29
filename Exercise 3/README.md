# Exercise 3 – Data Story: TV Energy Consumption

## Overview

In this exercise, you will develop a **data story** based on the **TV Energy Consumption dataset**. Using the website created in **Exercise 0.2**, you will extend your work to present a meaningful narrative supported by data visualisations.

Your goal is to communicate insights from the dataset in a clear and engaging way through your **website and written explanation**.

You must use the **Exercise 3 folder in your existing forked repository** and reuse the files created in **Exercise 0.2**.

---

## Data Story

### Audience

The target audience consists primarily of Australian tech consumers and sustainability researchers who require a clear understanding of the current market landscape. By utilizing a "gaming-console" interface and relatable character personas like the Capybara and Gecko, the visualization lowers the barrier to entry for non-technical users. This allows both casual shoppers and policy analysts to intuitively explore how physical specifications—like screen technology and brand variety—impact the availability of energy-efficient options in the real world.

### Story Overview

The TECHVISION narrative is structured as an interactive "Chapter" based journey that demystifies television energy data. The story begins by establishing market standards through a technology-focused quest, then transitions into a brand-comparison leaderboard to highlight manufacturer variety. By following our character leads through these visual milestones, viewers gain actionable insights into the trade-offs between screen size, technology types, and energy ratings, ultimately empowering them to make data-driven purchasing decisions.

---

## About the Data

### Data Source

The dataset comprises over **1,100 television models** registered in the Australian market. Specifically for this analysis, I focused on the Screen_Tech attribute to identify market trends and the Brand_Reg attribute to evaluate manufacturer variety.


### Data Processing

To make the data work for my visualisations, I performed the following technical steps in KNIME:
1. **Filtering:** Removed incomplete entries to ensure the Pie Chart for screen technology represented a true $100\%$ of the valid market sample.
2. **Aggregation:** Used GroupBy nodes to count the frequency of models. For example, for Question 3, I aggregated the data by Brand Name and performed a count on Model_No to identify the market leaders.
3. **Sorting:** Applied a Sorter node to the brand data so the Bar Chart would display a clear "Leaderboard" from highest to lowest variety.
4. **Formatting:** Converted technical codes into readable strings (e.g., ensuring "LCD(LED)" was clearly labeled) for better user accessibility on the dashboard.

### Privacy

The dataset does not contain any **personal or sensitive information**. It focuses solely on product specifications and energy consumption data related to television devices.

### Accuracy and Limitations

While the data is robust, there are specific limitations to keep in mind for my chosen questions:

- **Brand Variety:** A high number of models (Q3) doesn't always mean a brand is the "best"; it simply indicates they have a larger catalogue of registered products.

- **Tech Categories:** The "LCD" category is very broad. In a real-world scenario, this could be further broken down into sub-technologies like Mini-LED or QLED, which may not be fully distinguished in this specific dataset.

### Ethics

For this project, I ensured ethical representation by:

- **Proportional Scaling:** In the Pie Chart (Q1), I ensured the slices accurately represent the percentage of the market without using "3D effects" that could make smaller categories look larger than they are.

- **Fair Ranking:** In the Brand Bar Chart (Q3), I included all brands found in the dataset, not just the top 5, to avoid "cherry-picking" data and to give a fair view of the entire Australian market.

---

## AI Declaration

Throughout the development of this project, artificial intelligence tools were utilized to assist in conceptualizing and designing the interactive storyboard feature. Specifically, AI was employed to generate the foundational HTML, CSS, and JavaScript code required to build a simulated television interface with a functioning remote control and a cinematic, game-console-style slideshow system. The AI also provided guidance on structuring complex CSS layouts, managing state transitions for the TV power and menu screens, and optimizing the user experience for both desktop and mobile responsiveness. All AI-generated code and design suggestions were carefully reviewed, thoroughly tested, and manually refined to ensure they aligned with the project's specific functional requirements and visual standards.

---

## Website Storytelling

The website has been updated to communicate a data-driven story based on the TV energy consumption dataset through an interactive, character-led journey.

1. Interactive Interface Design 
- The website is designed for interactive storyboard telling based one Q1 and Q3, moving away from static reports to a dynamic "Chapter" based experience.

- User Engagement: As seen in the main interface, users can toggle between Chapter 1 (Market Trends) and Chapter 2 (Brand Variety) using a remote-control style sidebar.

- Gamified Navigation: Features like the "Power Button," "Back" functionality, and progress trackers (1/6) ensure the user feels in control of the story, reducing the complexity of the data analysis.

2. Character-Led Narratives (The User Personas)
To make the data relatable, the story is told through two distinct "shoppers" navigating the Australian market:

Chapter 1: The Technology Quest (Q1): - I use a Capybara character who is visually "Overwhelmed by Choices".
- The story guides him through an interactive Pie Chart that "glows" with market frequency data (Panel 3).
- Insight: By the end of the journey, the character moves from confusion to confidence, realizing that while OLED is "Premium," LCD(LED) is the "Most Popular" and "Accessible" standard.

Chapter 2: The Brand Leaderboard (Q3): - A Gecko character takes over to solve the problem of variety.
- The narrative uses a "Trophy" metaphor (Panel 1) to identify market leaders.
- Insight: Through a 3D-style Bar Chart, the Gecko discovers that SAMSUNG is the "King of Choice" with 731 models. The story ends with the Gecko successfully choosing a TV, representing a completed "Customer Journey."

3. Visual Storytelling Techniques
To ensure the data is informative and easy to understand, the website employs specific visual cues:

- Holographic Data: Charts are presented as "holograms" within the characters' world, making the statistics feel like part of a live environment.

- Comparison Scales: As shown in the Gecko’s story, a "Weight Scale" is used to visually compare Samsung’s 731 models against smaller competitors like Kogan, making the scale of the data instantly clear without reading raw numbers.

- Annotated Success: Every story ends with a "Checklist" or "Trophy" icon, signaling to the viewer that the data has successfully solved the initial problem.


