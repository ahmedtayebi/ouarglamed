-- PATH: supabase_schema.sql
-- Run this in the Supabase SQL Editor to initialize your database without Prisma.

-- 1. Clean up existing Prisma tables (Optional, if starting fresh)
DROP TABLE IF EXISTS "Lesson" CASCADE;
DROP TABLE IF EXISTS "Exam" CASCADE;
DROP TABLE IF EXISTS "_SemesterToModule" CASCADE;
DROP TABLE IF EXISTS "Module" CASCADE;
DROP TABLE IF EXISTS "Unit" CASCADE;
DROP TABLE IF EXISTS "Semester" CASCADE;
DROP TABLE IF EXISTS "Year" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- 2. Create Tables
CREATE TABLE "Year" (
    "id" TEXT PRIMARY KEY,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "structure" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "Semester" (
    "id" TEXT PRIMARY KEY,
    "label" TEXT NOT NULL,
    "yearId" TEXT NOT NULL REFERENCES "Year"("id") ON DELETE CASCADE
);

CREATE TABLE "Unit" (
    "id" TEXT PRIMARY KEY,
    "label" TEXT NOT NULL,
    "yearId" TEXT NOT NULL REFERENCES "Year"("id") ON DELETE CASCADE
);

CREATE TABLE "Module" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "isShared" BOOLEAN DEFAULT FALSE,
    "isStandalone" BOOLEAN DEFAULT FALSE,
    "unitId" TEXT REFERENCES "Unit"("id") ON DELETE CASCADE,
    "standaloneYearId" TEXT REFERENCES "Year"("id") ON DELETE CASCADE
);

CREATE TABLE "SemesterModule" (
    "semesterId" TEXT REFERENCES "Semester"("id") ON DELETE CASCADE,
    "moduleId" TEXT REFERENCES "Module"("id") ON DELETE CASCADE,
    PRIMARY KEY ("semesterId", "moduleId")
);

CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "driveUrl" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL REFERENCES "Module"("id") ON DELETE CASCADE,
    PRIMARY KEY ("id", "moduleId")
);

CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "driveUrl" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL REFERENCES "Module"("id") ON DELETE CASCADE,
    PRIMARY KEY ("id", "moduleId")
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE "Year" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Semester" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Unit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Module" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SemesterModule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lesson" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Exam" ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Public Read Access
CREATE POLICY "Public read access for Year" ON "Year" FOR SELECT USING (true);
CREATE POLICY "Public read access for Semester" ON "Semester" FOR SELECT USING (true);
CREATE POLICY "Public read access for Unit" ON "Unit" FOR SELECT USING (true);
CREATE POLICY "Public read access for Module" ON "Module" FOR SELECT USING (true);
CREATE POLICY "Public read access for SemesterModule" ON "SemesterModule" FOR SELECT USING (true);
CREATE POLICY "Public read access for Lesson" ON "Lesson" FOR SELECT USING (true);
CREATE POLICY "Public read access for Exam" ON "Exam" FOR SELECT USING (true);

-- Admin Write Access (Requires Authenticated JWT from Supabase Auth)
CREATE POLICY "Admin write access for Year" ON "Year" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for Semester" ON "Semester" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for Unit" ON "Unit" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for Module" ON "Module" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for SemesterModule" ON "SemesterModule" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for Lesson" ON "Lesson" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for Exam" ON "Exam" FOR ALL USING (auth.role() = 'authenticated');
