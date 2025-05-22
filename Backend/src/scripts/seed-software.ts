import { AppDataSource } from "../database/data-source.js";
import { Software } from "../entity/software-entity.js";
import { Request } from "../entity/request-entity.js";

const sampleSoftware = [
  {
    name: "Project Management System",
    description: "A comprehensive project management tool for tracking tasks, milestones, and team collaboration.",
    accessLevels: ["Read", "Write", "Admin"]
  },
  {
    name: "Document Management System",
    description: "Centralized document storage and version control system with advanced search capabilities.",
    accessLevels: ["Read", "Write"]
  },
  {
    name: "HR Portal",
    description: "Employee management system for handling personnel records, leave requests, and performance reviews.",
    accessLevels: ["Read", "Write", "Admin"]
  },
  {
    name: "Financial Management System",
    description: "Enterprise-level financial management and reporting system.",
    accessLevels: ["Read", "Admin"]
  },
  {
    name: "Customer Support Platform",
    description: "Ticketing system for managing customer inquiries and support requests.",
    accessLevels: ["Read", "Write", "Admin"]
  }
];

async function seedSoftware() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    const softwareRepository = AppDataSource.getRepository(Software);
    const requestRepository = AppDataSource.getRepository(Request);

    await requestRepository.clear();
    console.log("Cleared existing request data");

    await softwareRepository.clear();
    console.log("Cleared existing software data");

    const softwareEntities = sampleSoftware.map(software => 
      softwareRepository.create(software)
    );
    
    await softwareRepository.save(softwareEntities);
    console.log("Successfully seeded software data");

    const seededSoftware = await softwareRepository.find();
    console.log("Seeded software:", seededSoftware);

  } catch (error) {
    console.error("Error seeding software data:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("Database connection closed");
    }
  }
}

seedSoftware(); 