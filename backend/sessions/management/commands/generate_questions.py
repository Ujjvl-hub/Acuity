import json
import random
import re

from django.core.management.base import BaseCommand
from groq import Groq

from sessions.models import QuestionBankItem


class Command(BaseCommand):
    help = "Generate interview questions using Groq"

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=1,
            help="Number of questions to generate",
        )

    def normalize_question(self, text):
        text = text.lower()
        text = re.sub(r"[^a-z0-9\s]", " ", text)
        text = re.sub(r"\s+", " ", text).strip()

        stop_words = {
            "a",
            "an",
            "the",
            "and",
            "or",
            "to",
            "of",
            "for",
            "in",
            "on",
            "with",
            "how",
            "would",
            "you",
            "can",
            "what",
        }

        words = [
            word
            for word in text.split()
            if word not in stop_words
        ]

        return set(words)

    def handle(self, *args, **options):
        count = options["count"]

        if count < 1:
            self.stdout.write(
                self.style.ERROR("Count must be at least 1.")
            )
            return

        client = Groq()

        topic_map = {
            "Technical": {
                "Beginner": [
                    "Arrays",
                    "Strings",
                    "Basic OOP",
                    "DBMS fundamentals",
                    "Operating system fundamentals",
                    "Basic data structures",
                    "Basic SQL",
                ],
                "Intermediate": [
                    "Trees",
                    "Graphs",
                    "Intermediate DSA",
                    "SQL queries",
                    "REST APIs",
                    "React fundamentals",
                    "Django fundamentals",
                    "Database indexing",
                ],
                "Advanced": [
                    "Advanced DSA",
                    "Concurrency",
                    "Distributed systems concepts",
                    "Advanced database design",
                    "Caching",
                    "Scalability",
                    "Advanced system internals",
                ],
            },
            "Behavioral": {
                "Beginner": [
                    "Teamwork",
                    "Receiving feedback",
                    "Meeting deadlines",
                    "Learning a new skill",
                    "Helping a teammate",
                    "Handling a simple disagreement",
                ],
                "Intermediate": [
                    "Conflict resolution",
                    "Ownership",
                    "Project setbacks",
                    "Working with difficult requirements",
                    "Prioritization",
                    "Cross-team collaboration",
                ],
                "Advanced": [
                    "Leadership",
                    "Major project failure",
                    "High-pressure decisions",
                    "Architectural disagreement",
                    "Managing conflicting stakeholders",
                    "Leading organizational change",
                ],
            },
            "HR": {
                "Beginner": [
                    "Introduction",
                    "Career goals",
                    "Strengths and weaknesses",
                    "Learning habits",
                    "Teamwork",
                    "Communication",
                ],
                "Intermediate": [
                    "Workplace conflict",
                    "Adaptability",
                    "Handling criticism",
                    "Prioritization",
                    "Difficult workplace situations",
                    "Professional communication",
                ],
                "Advanced": [
                    "Leadership",
                    "Complex workplace conflict",
                    "Ethical workplace decisions",
                    "Managing senior stakeholders",
                    "Organizational change",
                    "High-pressure professional situations",
                ],
            },
            "System Design": {
                "Beginner": [
                    "Simple library management system",
                    "Basic URL shortener",
                    "Simple task scheduler",
                    "Simple food ordering system",
                    "Basic notification system",
                    "Simple parking management system",
                ],
                "Intermediate": [
                    "Chat application",
                    "File synchronization system",
                    "Collaborative document system",
                    "Ride booking system",
                    "Video streaming platform",
                    "Notification service",
                ],
                "Advanced": [
                    "Global notification system",
                    "Multi-tenant SaaS platform",
                    "Large-scale chat system",
                    "Globally distributed file storage",
                    "High-scale real-time collaboration",
                    "Large-scale recommendation system",
                ],
            },
        }

        topic_rules = {
            # Technical
            "Arrays": "Focus on arrays, indexing, traversal, searching, or simple array operations.",
            "Strings": "Focus on string manipulation, traversal, searching, or basic string algorithms.",
            "Basic OOP": "Focus on classes, objects, inheritance, polymorphism, encapsulation, or abstraction.",
            "DBMS fundamentals": "Focus on basic database concepts such as keys, normalization, tables, relationships, or transactions.",
            "Operating system fundamentals": "Focus on basic processes, threads, memory, scheduling, or file-system concepts.",
            "Basic data structures": "Focus on stacks, queues, linked lists, or basic data structure operations.",
            "Basic SQL": "Focus on simple SELECT, WHERE, ORDER BY, GROUP BY, or basic JOIN queries.",
            "Trees": "Focus on tree traversal, binary trees, BSTs, or basic tree operations.",
            "Graphs": "Focus on BFS, DFS, graph representation, connectivity, or basic graph problems.",
            "Intermediate DSA": "Focus on moderate algorithmic problems requiring multiple concepts or careful reasoning.",
            "SQL queries": "Focus on joins, grouping, subqueries, window functions, or moderately complex SQL.",
            "REST APIs": "Focus on HTTP methods, REST principles, API design, status codes, or authentication basics.",
            "React fundamentals": "Focus on components, props, state, hooks, rendering, or basic React architecture.",
            "Django fundamentals": "Focus on models, views, serializers, URLs, REST APIs, or Django request flow.",
            "Database indexing": "Focus on indexes, query performance, B-trees, composite indexes, or indexing trade-offs.",
            "Advanced DSA": "Focus on advanced algorithms or data structures requiring strong problem-solving skills.",
            "Concurrency": "Focus on threads, synchronization, race conditions, locks, atomic operations, or concurrent data structures.",
            "Distributed systems concepts": "Focus on consistency, replication, consensus, partitioning, fault tolerance, or distributed coordination.",
            "Advanced database design": "Focus on sharding, replication, transactions, consistency, query optimization, or large-scale databases.",
            "Caching": "Focus on cache strategies, eviction, invalidation, distributed caching, or cache consistency.",
            "Scalability": "Focus on scaling architecture, bottlenecks, load balancing, horizontal scaling, or capacity planning.",
            "Advanced system internals": "Focus on complex software engineering internals, performance, memory, concurrency, or runtime behavior.",

            # Behavioral
            "Teamwork": "Ask about collaborating effectively with teammates on a project.",
            "Receiving feedback": "Ask about receiving constructive feedback and how the candidate responded.",
            "Meeting deadlines": "Ask about handling a deadline or delivering work on time.",
            "Learning a new skill": "Ask about learning a new technology, programming language, framework, or professional skill.",
            "Helping a teammate": "Ask about helping another teammate overcome a problem or complete work.",
            "Handling a simple disagreement": "Ask about resolving a minor disagreement with a teammate.",
            "Conflict resolution": "Ask about resolving a meaningful disagreement or conflict with another person.",
            "Ownership": "Ask about taking responsibility for a task, mistake, or project outcome.",
            "Project setbacks": "Ask about handling a project delay, failure, or unexpected setback.",
            "Working with difficult requirements": "Ask about dealing with unclear, changing, or conflicting requirements.",
            "Prioritization": "Ask about choosing between multiple competing tasks or deadlines.",
            "Cross-team collaboration": "Ask about collaborating with another team or department.",
            "Leadership": "Ask about leading people, projects, or important decisions.",
            "Major project failure": "Ask about handling a significant project failure and lessons learned.",
            "High-pressure decisions": "Ask about making an important decision under significant pressure.",
            "Architectural disagreement": "Ask about resolving a disagreement involving an important technical or architectural decision.",
            "Managing conflicting stakeholders": "Ask about aligning stakeholders with conflicting priorities.",
            "Leading organizational change": "Ask about leading people through a significant process, technology, or organizational change.",

            # HR
            "Introduction": "Ask the candidate to introduce themselves, their background, education, projects, and career interests.",
            "Career goals": "Ask about short-term or long-term professional goals and how the candidate plans to achieve them.",
            "Strengths and weaknesses": "Ask about professional strengths, weaknesses, and how the candidate works on improvement.",
            "Learning habits": "Ask about how the candidate learns new technologies or skills.",
            "Communication": "Ask about professional communication, explaining ideas, or communicating with teammates.",
            "Adaptability": "Ask about adapting to a significant change in a workplace or project.",
            "Handling criticism": "Ask about receiving or responding to criticism in a professional environment.",
            "Workplace conflict": "Ask about handling a disagreement or conflict in a professional workplace.",
            "Prioritization": "Ask about balancing competing professional responsibilities.",
            "Difficult workplace situations": "Ask about handling a challenging workplace situation professionally.",
            "Professional communication": "Ask about handling difficult or sensitive professional communication.",
            "Complex workplace conflict": "Ask about resolving a serious workplace conflict involving multiple people.",
            "Ethical workplace decisions": "Ask about handling an ethical dilemma at work.",
            "Managing senior stakeholders": "Ask about communicating with and managing conflicting expectations from senior stakeholders.",
            "Organizational change": "Ask about helping a team adapt to a major organizational or process change.",
            "High-pressure professional situations": "Ask about handling a serious professional situation involving pressure, risk, or competing priorities.",

            # System Design
            "Simple library management system": "Design a small library system for books, users, borrowing, and returning.",
            "Basic URL shortener": "Design a simple service that maps long URLs to short URLs and redirects users.",
            "Simple task scheduler": "Design a basic system that schedules and executes tasks at specified times.",
            "Simple food ordering system": "Design a small food ordering system involving customers, orders, restaurants, and payments.",
            "Basic notification system": "Design a simple system that sends notifications to users.",
            "Simple parking management system": "Design a basic parking system for vehicle entry, spot allocation, exit, and billing.",
            "Chat application": "Design a chat application supporting users, conversations, messages, and message delivery.",
            "File synchronization system": "Design a system that synchronizes files between devices and handles basic conflicts.",
            "Collaborative document system": "Design a system where multiple users can edit and share documents.",
            "Ride booking system": "Design a ride booking system connecting riders and drivers.",
            "Video streaming platform": "Design a video streaming service with uploading, storage, and video delivery.",
            "Notification service": "Design a service supporting multiple notification channels, scheduling, retries, and user preferences.",
            "Global notification system": "Design a globally distributed notification system operating at very large scale.",
            "Multi-tenant SaaS platform": "Design a scalable SaaS platform serving multiple isolated organizations.",
            "Large-scale chat system": "Design a globally scalable chat system supporting millions of users.",
            "Globally distributed file storage": "Design a highly available distributed file storage system across regions.",
            "High-scale real-time collaboration": "Design a real-time collaborative system serving very large numbers of concurrent users.",
            "Large-scale recommendation system": "Design a recommendation platform operating at large scale with personalization and low latency.",
        }

        categories = list(topic_map.keys())
        difficulties = ["Beginner", "Intermediate", "Advanced"]

        valid_categories = set(categories)
        valid_difficulties = set(difficulties)

        difficulty_rules = {
            "Beginner": """
- Assume the candidate has basic programming knowledge.
- Focus on fundamentals and simple practical situations.
- Do NOT require advanced algorithms.
- Do NOT require concurrency, distributed systems, race conditions,
  lock-free programming, complex scalability, or advanced architecture.
- The question should be answerable within a few minutes.
""",
            "Intermediate": """
- Assume the candidate has internship or project experience.
- Require moderate reasoning.
- Multiple concepts may be combined.
- Avoid highly specialized concurrency or distributed-system concepts.
- Avoid extremely large-scale architecture.
- The question should be challenging but manageable for a typical software engineer.
""",
            "Advanced": """
- Assume the candidate has strong software engineering experience.
- Complex reasoning is allowed.
- Advanced algorithms, concurrency, scalability, architecture,
  distributed systems, leadership, and difficult stakeholder situations
  are allowed when relevant.
""",
        }

        created = 0
        skipped = 0

        for i in range(count):
            category = categories[i % len(categories)]
            difficulty = difficulties[i % len(difficulties)]

            topic = random.choice(topic_map[category][difficulty])
            topic_description = topic_rules[topic]

            prompt = f"""
Generate exactly ONE software engineering interview question.

Return ONLY valid JSON in this exact format:

{{
    "question": "string",
    "category": "{category}",
    "difficulty": "{difficulty}",
    "topic": "{topic}"
}}

CATEGORY:
{category}

DIFFICULTY:
{difficulty}

TOPIC:
{topic}

TOPIC REQUIREMENT:
{topic_description}

DIFFICULTY RULES:
{difficulty_rules[difficulty]}

IMPORTANT:
- The category MUST be exactly "{category}".
- The difficulty MUST be exactly "{difficulty}".
- The topic MUST be exactly "{topic}".
- The question MUST directly test the specified topic.
- Do not generate a question that belongs to another topic.
- Do not make a beginner question advanced.
- Do not make an intermediate question unnecessarily complex.
- Do not include the answer.
- Do not include explanations.
- Do not include markdown.
- Generate exactly ONE question.
- Return ONLY valid JSON.
"""

            self.stdout.write(
                f"Generating question {i + 1}/{count} "
                f"({category}, {difficulty}, {topic})..."
            )

            try:
                response = client.chat.completions.create(
                    model="openai/gpt-oss-20b",
                    messages=[
                        {
                            "role": "user",
                            "content": prompt,
                        }
                    ],
                    temperature=0.6,
                )

                content = response.choices[0].message.content.strip()
                data = json.loads(content)

            except json.JSONDecodeError:
                self.stdout.write(
                    self.style.WARNING(
                        "Groq returned invalid JSON. Skipping."
                    )
                )
                skipped += 1
                continue

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"Groq request failed: {e}"
                    )
                )
                skipped += 1
                continue

            question = data.get("question")
            generated_category = data.get("category")
            generated_difficulty = data.get("difficulty")
            generated_topic = data.get("topic")

            if not question:
                self.stdout.write(
                    self.style.WARNING(
                        "Question missing. Skipping."
                    )
                )
                skipped += 1
                continue

            if generated_category not in valid_categories:
                self.stdout.write(
                    self.style.WARNING(
                        f"Invalid category: {generated_category}"
                    )
                )
                skipped += 1
                continue

            if generated_difficulty not in valid_difficulties:
                self.stdout.write(
                    self.style.WARNING(
                        f"Invalid difficulty: {generated_difficulty}"
                    )
                )
                skipped += 1
                continue

            if generated_category != category:
                self.stdout.write(
                    self.style.WARNING(
                        "Category mismatch. Skipping."
                    )
                )
                skipped += 1
                continue

            if generated_difficulty != difficulty:
                self.stdout.write(
                    self.style.WARNING(
                        "Difficulty mismatch. Skipping."
                    )
                )
                skipped += 1
                continue

            if generated_topic != topic:
                self.stdout.write(
                    self.style.WARNING(
                        "Topic mismatch. Skipping."
                    )
                )
                skipped += 1
                continue

            # Exact duplicate check
            if QuestionBankItem.objects.filter(
                question=question
            ).exists():
                self.stdout.write(
                    self.style.WARNING(
                        "Duplicate question. Skipping."
                    )
                )
                skipped += 1
                continue

            # Near-duplicate check
            new_question_words = self.normalize_question(question)

            existing_questions = QuestionBankItem.objects.filter(
                is_active=True
            ).values_list("question", flat=True)

            is_duplicate = False

            for existing_question in existing_questions:
                existing_words = self.normalize_question(
                    existing_question
                )

                if not existing_words or not new_question_words:
                    continue

                intersection = new_question_words & existing_words
                union = new_question_words | existing_words

                similarity = len(intersection) / len(union)

                if similarity >= 0.70:
                    is_duplicate = True
                    break

            if is_duplicate:
                self.stdout.write(
                    self.style.WARNING(
                        "Very similar question already exists. Skipping."
                    )
                )
                skipped += 1
                continue

            item = QuestionBankItem.objects.create(
                question=question,
                category=generated_category,
                difficulty=generated_difficulty,
                topic=generated_topic,
                is_active=True,
            )

            created += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"Created ID {item.id}: {item.question}"
                )
            )

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"Finished. Created: {created}, Skipped: {skipped}"
            )
        )

