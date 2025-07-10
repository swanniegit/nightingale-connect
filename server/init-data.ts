import { db } from "./db";
import { users, channels, faqs, educationalContent } from "@shared/schema";

export async function initializeData() {
  try {
    // Check if data already exists
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Sample data already exists, skipping initialization");
      return;
    }

    // Create sample admin user
    const [adminUser] = await db.insert(users).values({
      id: "admin-123",
      username: "admin",
      email: "admin@nurseprac.co.za",
      firstName: "System",
      lastName: "Administrator",
      location: "Cape Town",
      role: "admin",
      isApproved: true,
      isOnline: false,
    }).returning();

    // Create sample senior nurse
    const [seniorUser] = await db.insert(users).values({
      id: "senior-456",
      username: "sister_mary",
      email: "mary@nurseprac.co.za",
      firstName: "Mary",
      lastName: "Johnson",
      location: "Johannesburg",
      role: "senior",
      isApproved: true,
      isOnline: false,
    }).returning();

    // Create sample regular nurse
    const [nurseUser] = await db.insert(users).values({
      id: "nurse-789",
      username: "nurse_jane",
      email: "jane@nurseprac.co.za",
      firstName: "Jane",
      lastName: "Smith",
      location: "Durban",
      role: "nurse",
      isApproved: true,
      isOnline: false,
    }).returning();

    // Create sample channels
    const [generalChannel] = await db.insert(channels).values({
      name: "General Discussion",
      description: "General nursing topics and discussions",
      isPrivate: false,
    }).returning();

    const [emergencyChannel] = await db.insert(channels).values({
      name: "Emergency Care",
      description: "Emergency and critical care discussions",
      isPrivate: false,
    }).returning();

    // Create sample FAQs
    await db.insert(faqs).values({
      question: "What are the standard vital signs ranges for adults?",
      answer: "Normal vital signs for adults: Temperature 36.1-37.2°C, Heart rate 60-100 bpm, Respiratory rate 12-20 breaths/min, Blood pressure <120/80 mmHg. These ranges may vary based on individual circumstances and medical conditions.",
      category: "Clinical Guidelines",
      tags: ["vital signs", "monitoring", "assessment"],
    });

    await db.insert(faqs).values({
      question: "How do I calculate medication dosages?",
      answer: "Use the formula: Dose = (Desired dose / Stock strength) × Stock volume. Always double-check calculations and follow the 'five rights' of medication administration: right patient, right drug, right dose, right route, right time.",
      category: "Medication Administration",
      tags: ["medication", "dosage", "safety"],
    });

    await db.insert(faqs).values({
      question: "What is the proper hand hygiene protocol?",
      answer: "Wash hands for at least 20 seconds with soap and water, or use alcohol-based hand sanitizer (60-95% alcohol). Key moments: before patient contact, before aseptic procedures, after body fluid exposure, after patient contact, after contact with patient surroundings.",
      category: "Infection Control",
      tags: ["hand hygiene", "infection control", "safety"],
    });

    // Create sample educational content
    await db.insert(educationalContent).values({
      title: "Nursing Assessment Guidelines",
      content: "Comprehensive nursing assessment includes physical examination, health history, psychosocial assessment, and functional assessment. Document findings accurately and report significant changes to the healthcare team.",
      contentType: "document",
      category: "Clinical Practice",
      tags: ["assessment", "documentation", "clinical practice"],
      isFeatured: true,
    });

    await db.insert(educationalContent).values({
      title: "Emergency Response Protocols",
      content: "In medical emergencies: 1) Ensure scene safety, 2) Assess responsiveness, 3) Call for help, 4) Begin CPR if needed, 5) Use AED if available, 6) Continue until advanced help arrives. Know your facility's emergency codes and procedures.",
      contentType: "protocol",
      category: "Emergency Care",
      tags: ["emergency", "CPR", "protocols"],
      isFeatured: true,
    });

    await db.insert(educationalContent).values({
      title: "Patient Communication Best Practices",
      content: "Effective communication includes active listening, empathy, clear explanations, cultural sensitivity, and maintaining patient confidentiality. Use therapeutic communication techniques and involve patients in their care decisions.",
      contentType: "guide",
      category: "Patient Care",
      tags: ["communication", "patient care", "therapeutic"],
      isFeatured: false,
    });

    console.log("Sample data initialized successfully!");
    console.log(`Created users: ${adminUser.username}, ${seniorUser.username}, ${nurseUser.username}`);
    console.log(`Created channels: ${generalChannel.name}, ${emergencyChannel.name}`);
    console.log("Created sample FAQs and educational content");

  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}