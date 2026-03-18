Product Name
TeachLens
Product Overview
TeachLens is a web-based instructional decision-support platform designed to help STEM educators analyze formative assessment data, track classroom learning patterns over time, and receive research-based teaching recommendations. The platform supports teachers in making evidence-informed instructional decisions throughout a semester by translating classroom data into actionable insights.
TeachLens operates through an iterative instructional cycle in which teachers upload or analyze weekly formative assessments, review summarized patterns in student understanding, and receive recommendations for evidence-based teaching strategies. The platform then tracks instructional changes and learning outcomes across the course timeline.
The goal of TeachLens is not to replace teacher expertise, but to strengthen teacher decision-making by providing structured learning analytics and research-informed instructional guidance.

Problem Statement
STEM teachers frequently collect formative assessment data through quizzes, assignments, and diagnostic checks, but often lack tools that help them quickly interpret this information and translate it into instructional adjustments.
Existing learning analytics dashboards primarily focus on visualizing grades and participation data rather than providing guidance on how teachers should adapt their instruction.
As a result, valuable classroom evidence often remains underutilized in improving teaching methods and student outcomes.
TeachLens addresses this problem by helping teachers move from data collection to instructional action.

Goals and Objectives
Primary Goals
Enable teachers to monitor student understanding throughout a semester.
Translate classroom data into actionable instructional insights.
Provide research-based teaching strategy recommendations.
Support continuous instructional improvement cycles.
Generate longitudinal data that can support research on teaching effectiveness.


Secondary Goals
Reduce teacher cognitive load when interpreting assessment results.
Encourage more adaptive and evidence-based teaching practices.
Support intervention studies evaluating AI-assisted teaching support tools.



Target Users
Primary Users
STEM teachers in K–12 and higher education
They use the platform to:
analyze weekly assessment data
track concept mastery
adjust teaching methods
monitor classroom learning patterns


Secondary Users
Education researchers
They may use the platform to:
study instructional adaptation
evaluate teaching interventions
analyze patterns in teaching strategies and outcomes



Key Features
1. Teacher Dashboard
Teachers have a central dashboard displaying:
list of courses/classes
weekly learning analytics
concept mastery trends
recommended teaching strategies
teaching method history



2. Class Profiles
Teachers create a profile for each class they teach.
Each profile includes:
course name
class size
subject area
weekly teaching records
assessment history
learning analytics



3. Assessment Analysis
Teachers can upload or input results from:
quizzes
assignments
exit tickets
concept tests
diagnostic checks


The system analyzes:
class-level performance
concept-level mastery
learning distributions
trends over time



4. Teaching Method Tracker
Teachers log which instructional strategies they used each week.
Examples include:
lecture with concept checks
peer instruction
think–pair–share
collaborative learning
problem-based learning
worked examples
retrieval practice


This allows the platform to track instructional adaptation throughout the semester.

5. AI-Supported Insights
TeachLens analyzes classroom data and identifies learning patterns such as:
widespread misconceptions
uneven understanding across students
procedural understanding without conceptual reasoning
low retention of previous material
The system then generates clear summaries of these patterns.

6. Teaching Strategy Recommendations
Using a teaching method recommendation matrix, the system suggests evidence-based instructional strategies.
Examples:
Detected pattern:
 Students confident but performing poorly.
Suggested strategies:
peer instruction
concept tests
reflection activities



7. Longitudinal Learning Analytics
The system tracks learning patterns across the semester.
Teachers can view:
concept mastery trends


improvement over time


instructional strategy usage



8. Instructional Cycle
TeachLens supports a structured weekly workflow:
Teacher conducts formative assessment
Teacher uploads or analyzes results
TeachLens summarizes learning patterns
TeachLens recommends teaching strategies
Teacher adjusts instruction
New assessment measures results



User Workflow
Weekly Teacher Workflow
Step 1
 Teacher conducts assessment.
Step 2
 Teacher uploads assessment data.
Step 3
 TeachLens analyzes results.
Step 4
 Teacher reviews insights and suggested strategies.
Step 5
 Teacher implements instructional changes.
Step 6
 Next assessment measures learning progress.

Functional Requirements
The system must:
allow teachers to create accounts
allow teachers to create multiple class profiles
support assessment data upload
analyze class-level learning patterns
generate visual analytics dashboards (normal curve distribution of patterns of understanding)
recommend teaching strategies
track instructional methods across time
store longitudinal learning analytics



Non-Functional Requirements
The system must:
protect user data and privacy
avoid storing identifiable student information
provide fast response times for analysis
support multiple teachers simultaneously
ensure secure authentication



Technical Stack
Frontend
 Next.js + TypeScript + Tailwind
Backend
 FastAPI (Python)
Database and Authentication
 Supabase (PostgreSQL)
AI Layer
 OpenAI Responses API
Charts
 Recharts
Deployment
 Vercel (frontend)
 Render or Railway (backend)

Success Metrics
Success of TeachLens will be measured by:
teacher adoption rate


frequency of weekly usage


number of instructional adjustments made


improvement in concept mastery across time


teacher satisfaction with recommendations


For research studies, success may also include:
improved student assessment outcomes


increased use of evidence-based teaching strategies


improved instructor awareness of learning patterns



Risks and Considerations
Potential risks include:
teacher workload concerns


overreliance on automated recommendations


inaccurate interpretation of limited assessment data


low adoption due to interface complexity


To mitigate these risks, TeachLens will emphasize:
simple workflows


transparent recommendation logic


teacher control over decisions


minimal additional data entry
Product Vision
TeachLens aims to become a teacher-centered instructional intelligence platform that helps educators move beyond isolated assessment results toward continuous, evidence-informed teaching.
By combining classroom data, learning analytics, and research-based teaching strategies, the platform explores how artificial intelligence can responsibly support better STEM instruction and improve learning outcomes.


Note:
Coding is divided into 10 sessions each with a prompt to be executed
