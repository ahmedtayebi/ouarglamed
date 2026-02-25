import os

base_dir = "/home/ahmedhack/Desktop/unev/server"
os.makedirs(base_dir, exist_ok=True)

files = {}

files["server/package.json"] = """{
  "name": "medguid-server",
  "version": "1.0.0",
  "description": "Backend for MedGuid",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "db:push": "prisma db push",
    "db:seed": "node prisma/seed.js"
  },
  "dependencies": {
    "@prisma/client": "^5.10.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.2",
    "express-async-handler": "^1.2.0",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.0",
    "prisma": "^5.10.2"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}"""

files["server/.env.example"] = """# PATH: server/.env.example
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/medguid_db?schema=public"
JWT_SECRET="supersecretjwtkey_change_in_production"
"""

files["server/prisma/schema.prisma"] = """// PATH: server/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Year {
  id        String   @id
  label     String
  color     String
  icon      String
  structure String
  
  semesters         Semester[]
  units             Unit[]
  standaloneModules Module[] @relation("YearStandaloneModules")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Semester {
  id       String   @id
  label    String
  yearId   String
  year     Year     @relation(fields: [yearId], references: [id], onDelete: Cascade)
  
  modules  Module[] @relation("SemesterToModule")
}

model Unit {
  id       String   @id
  label    String
  yearId   String
  year     Year     @relation(fields: [yearId], references: [id], onDelete: Cascade)
  
  modules  Module[] @relation("UnitToModule")
}

model Module {
  id               String   @id
  title            String
  isShared         Boolean  @default(false)
  isStandalone     Boolean  @default(false)
  
  semesters        Semester[] @relation("SemesterToModule")
  
  unitId           String?
  unit             Unit?      @relation("UnitToModule", fields: [unitId], references: [id], onDelete: Cascade)
  
  standaloneYearId String?
  standaloneYear   Year?      @relation("YearStandaloneModules", fields: [standaloneYearId], references: [id], onDelete: Cascade)

  lessons          Lesson[]
  exams            Exam[]
}

model Lesson {
  id       String
  title    String
  driveUrl String
  moduleId String
  module   Module @relation(fields: [moduleId], references: [id], onDelete: Cascade)

  @@id([id, moduleId])
}

model Exam {
  id       String
  title    String
  driveUrl String
  moduleId String
  module   Module @relation(fields: [moduleId], references: [id], onDelete: Cascade)

  @@id([id, moduleId])
}
"""

files["server/prisma/seed.js"] = """// PATH: server/prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const makeLessons = (count = 3) =>
    Array.from({ length: count }, (_, i) => ({
        id: `les-${String(i + 1).padStart(3, '0')}`,
        title: 'TO_BE_FILLED',
        driveUrl: 'TO_BE_FILLED',
    }));

const makeExams = (count = 2) =>
    Array.from({ length: count }, (_, i) => ({
        id: `ex-${String(i + 1).padStart(3, '0')}`,
        title: 'TO_BE_FILLED',
        driveUrl: 'TO_BE_FILLED',
    }));

// Replicated from academicData.js
const years = [
    {
        id: 'year-1',
        label: 'السنة الأولى',
        color: '#0D9488',
        icon: 'BookOpen',
        structure: 'semesters',
        semesters: [
            {
                id: 's1',
                label: 'الفصل الأول',
                modules: [
                    { id: 'mod-y1-shared-001', title: 'TO_BE_FILLED', isShared: true, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-shared-002', title: 'TO_BE_FILLED', isShared: true, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-shared-003', title: 'TO_BE_FILLED', isShared: true, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-shared-004', title: 'TO_BE_FILLED', isShared: true, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-shared-005', title: 'TO_BE_FILLED', isShared: true, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-shared-006', title: 'TO_BE_FILLED', isShared: true, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-s1-001', title: 'TO_BE_FILLED', isShared: false, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-s1-002', title: 'TO_BE_FILLED', isShared: false, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-s1-003', title: 'TO_BE_FILLED', isShared: false, lessons: makeLessons(3), exams: makeExams(2) }
                ]
            },
            {
                id: 's2',
                label: 'الفصل الثاني',
                modules: [
                    { id: 'mod-y1-shared-001', title: 'TO_BE_FILLED', isShared: true, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-shared-002', title: 'TO_BE_FILLED', isShared: true, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-shared-003', title: 'TO_BE_FILLED', isShared: true, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-shared-004', title: 'TO_BE_FILLED', isShared: true, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-shared-005', title: 'TO_BE_FILLED', isShared: true, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-shared-006', title: 'TO_BE_FILLED', isShared: true, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-s2-001', title: 'TO_BE_FILLED', isShared: false, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-s2-002', title: 'TO_BE_FILLED', isShared: false, lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-y1-s2-003', title: 'TO_BE_FILLED', isShared: false, lessons: makeLessons(3), exams: makeExams(2) }
                ]
            }
        ]
    },
    {
        id: 'year-2',
        label: 'السنة الثانية',
        color: '#16A34A',
        icon: 'FlaskConical',
        structure: 'units',
        standaloneModules: [
            { id: 'mod-standalone-001', title: 'TO_BE_FILLED', isStandalone: true, lessons: makeLessons(3), exams: makeExams(2) },
            { id: 'mod-standalone-002', title: 'TO_BE_FILLED', isStandalone: true, lessons: makeLessons(3), exams: makeExams(2) }
        ],
        units: [
            {
                id: 'unit-2-1', label: 'TO_BE_FILLED', modules: [
                    { id: 'mod-u2-1-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-1-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-1-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-1-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) }
                ]
            },
            {
                id: 'unit-2-2', label: 'TO_BE_FILLED', modules: [
                    { id: 'mod-u2-2-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-2-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-2-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-2-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) }
                ]
            },
            {
                id: 'unit-2-3', label: 'TO_BE_FILLED', modules: [
                    { id: 'mod-u2-3-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-3-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-3-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-3-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) }
                ]
            },
            {
                id: 'unit-2-4', label: 'TO_BE_FILLED', modules: [
                    { id: 'mod-u2-4-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-4-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-4-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-4-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) }
                ]
            },
            {
                id: 'unit-2-5', label: 'TO_BE_FILLED', modules: [
                    { id: 'mod-u2-5-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-5-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-5-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u2-5-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) }
                ]
            }
        ]
    },
    {
        id: 'year-3',
        label: 'السنة الثالثة',
        color: '#D97706',
        icon: 'GraduationCap',
        structure: 'units',
        standaloneModules: [],
        units: [
            {
                id: 'unit-3-1', label: 'TO_BE_FILLED', modules: [
                    { id: 'mod-u3-1-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-1-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-1-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-1-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) }
                ]
            },
            {
                id: 'unit-3-2', label: 'TO_BE_FILLED', modules: [
                    { id: 'mod-u3-2-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-2-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-2-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-2-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) }
                ]
            },
            {
                id: 'unit-3-3', label: 'TO_BE_FILLED', modules: [
                    { id: 'mod-u3-3-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-3-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-3-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-3-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) }
                ]
            },
            {
                id: 'unit-3-4', label: 'TO_BE_FILLED', modules: [
                    { id: 'mod-u3-4-001', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-4-002', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-4-003', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) },
                    { id: 'mod-u3-4-004', title: 'TO_BE_FILLED', lessons: makeLessons(3), exams: makeExams(2) }
                ]
            }
        ]
    }
];

async function main() {
    console.log('Seeding database...');
    // Create admin user
    const adminPassword = await bcrypt.hash('medguid2025', 10);
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: { password: adminPassword },
        create: {
            username: 'admin',
            password: adminPassword,
        },
    });

    for (const year of years) {
        await prisma.year.upsert({
            where: { id: year.id },
            update: { label: year.label, color: year.color, icon: year.icon, structure: year.structure },
            create: {
                id: year.id,
                label: year.label,
                color: year.color,
                icon: year.icon,
                structure: year.structure,
            }
        });

        if (year.semesters) {
             for (const sem of year.semesters) {
                 await prisma.semester.upsert({
                     where: { id: sem.id },
                     update: { label: sem.label, yearId: year.id },
                     create: { id: sem.id, label: sem.label, yearId: year.id }
                 });

                 for (const mod of sem.modules) {
                     await prisma.module.upsert({
                         where: { id: mod.id },
                         update: {
                             title: mod.title,
                             isShared: !!mod.isShared,
                             isStandalone: false,
                             semesters: { connect: { id: sem.id } }
                         },
                         create: {
                             id: mod.id,
                             title: mod.title,
                             isShared: !!mod.isShared,
                             isStandalone: false,
                             semesters: { connect: { id: sem.id } }
                         }
                     });

                     for (const lesson of mod.lessons) {
                         await prisma.lesson.upsert({
                             where: { id_moduleId: { id: lesson.id, moduleId: mod.id } },
                             update: { title: lesson.title, driveUrl: lesson.driveUrl },
                             create: { id: lesson.id, title: lesson.title, driveUrl: lesson.driveUrl, moduleId: mod.id }
                         });
                     }

                     for (const exam of mod.exams) {
                         await prisma.exam.upsert({
                             where: { id_moduleId: { id: exam.id, moduleId: mod.id } },
                             update: { title: exam.title, driveUrl: exam.driveUrl },
                             create: { id: exam.id, title: exam.title, driveUrl: exam.driveUrl, moduleId: mod.id }
                         });
                     }
                 }
             }
        }

        if (year.standaloneModules) {
            for (const mod of year.standaloneModules) {
                 await prisma.module.upsert({
                     where: { id: mod.id },
                     update: { title: mod.title, standaloneYearId: year.id },
                     create: {
                         id: mod.id,
                         title: mod.title,
                         isShared: false,
                         isStandalone: true,
                         standaloneYearId: year.id
                     }
                 });

                 for (const lesson of mod.lessons) {
                     await prisma.lesson.upsert({
                         where: { id_moduleId: { id: lesson.id, moduleId: mod.id } },
                         update: { title: lesson.title, driveUrl: lesson.driveUrl },
                         create: { id: lesson.id, title: lesson.title, driveUrl: lesson.driveUrl, moduleId: mod.id }
                     });
                 }
                 for (const exam of mod.exams) {
                     await prisma.exam.upsert({
                         where: { id_moduleId: { id: exam.id, moduleId: mod.id } },
                         update: { title: exam.title, driveUrl: exam.driveUrl },
                         create: { id: exam.id, title: exam.title, driveUrl: exam.driveUrl, moduleId: mod.id }
                     });
                 }
            }
        }

        if (year.units) {
             for (const unit of year.units) {
                 await prisma.unit.upsert({
                     where: { id: unit.id },
                     update: { label: unit.label, yearId: year.id },
                     create: { id: unit.id, label: unit.label, yearId: year.id }
                 });

                 for (const mod of unit.modules) {
                     await prisma.module.upsert({
                         where: { id: mod.id },
                         update: { title: mod.title, unitId: unit.id },
                         create: {
                             id: mod.id,
                             title: mod.title,
                             isShared: false,
                             isStandalone: false,
                             unitId: unit.id
                         }
                     });

                     for (const lesson of mod.lessons) {
                         await prisma.lesson.upsert({
                             where: { id_moduleId: { id: lesson.id, moduleId: mod.id } },
                             update: { title: lesson.title, driveUrl: lesson.driveUrl },
                             create: { id: lesson.id, title: lesson.title, driveUrl: lesson.driveUrl, moduleId: mod.id }
                         });
                     }
                     for (const exam of mod.exams) {
                         await prisma.exam.upsert({
                             where: { id_moduleId: { id: exam.id, moduleId: mod.id } },
                             update: { title: exam.title, driveUrl: exam.driveUrl },
                             create: { id: exam.id, title: exam.title, driveUrl: exam.driveUrl, moduleId: mod.id }
                         });
                     }
                 }
             }
        }
    }
    console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
"""

files["server/src/app.js"] = """// PATH: server/src/app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const academicRoutes = require('./routes/academic.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/academic', academicRoutes);

app.get('/', (req, res) => {
    res.send('MedGuid API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
"""

files["server/src/routes/auth.routes.js"] = """// PATH: server/src/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const { loginUser, getProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/login', loginUser);
router.get('/profile', protect, getProfile);

module.exports = router;
"""

files["server/src/routes/academic.routes.js"] = """// PATH: server/src/routes/academic.routes.js

const express = require('express');
const router = express.Router();
const { getAcademicData, syncAcademicData } = require('../controllers/academic.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', getAcademicData);
router.post('/sync', protect, syncAcademicData);

module.exports = router;
"""

files["server/src/middleware/auth.middleware.js"] = """// PATH: server/src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const protect = asyncHandler(async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, username: true } // Exclude password
            });
            
            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
            
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }
    
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };
"""

files["server/src/middleware/error.middleware.js"] = """// PATH: server/src/middleware/error.middleware.js

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
"""

files["server/src/controllers/auth.controller.js"] = """// PATH: server/src/controllers/auth.controller.js

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    
    const user = await prisma.user.findUnique({
        where: { username }
    });
    
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            id: user.id,
            username: user.username,
            token: generateToken(user.id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    if (!req.user) {
         res.status(404);
         throw new Error('User not found');
    }
    res.json(req.user);
});

module.exports = { loginUser, getProfile };
"""

files["server/src/controllers/academic.controller.js"] = """// PATH: server/src/controllers/academic.controller.js

const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all academic data
// @route   GET /api/academic
// @access  Public
const getAcademicData = asyncHandler(async (req, res) => {
    const years = await prisma.year.findMany({
        include: {
            semesters: {
                include: {
                    modules: {
                        include: {
                            lessons: { orderBy: { id: 'asc' } },
                            exams: { orderBy: { id: 'asc' } }
                        },
                        orderBy: { id: 'asc' }
                    }
                },
                orderBy: { id: 'asc' }
            },
            units: {
                include: {
                    modules: {
                        include: {
                            lessons: { orderBy: { id: 'asc' } },
                            exams: { orderBy: { id: 'asc' } }
                        },
                        orderBy: { id: 'asc' }
                    }
                },
                orderBy: { id: 'asc' }
            },
            standaloneModules: {
                include: {
                    lessons: { orderBy: { id: 'asc' } },
                    exams: { orderBy: { id: 'asc' } }
                },
                orderBy: { id: 'asc' }
            }
        },
        orderBy: {
            id: 'asc'
        }
    });

    res.json(years);
});

// @desc    Sync (Overwrite) all academic data
// @route   POST /api/academic/sync
// @access  Private
const syncAcademicData = asyncHandler(async (req, res) => {
    const years = req.body;
    
    if (!Array.isArray(years)) {
        res.status(400);
        throw new Error('Invalid data format. Expected an array of years.');
    }

    // Process all updates inside a transaction if necessary, or loop sequentially
    for (const year of years) {
        await prisma.year.upsert({
            where: { id: year.id },
            update: { label: year.label, color: year.color, icon: year.icon, structure: year.structure },
            create: {
                id: year.id,
                label: year.label,
                color: year.color,
                icon: year.icon,
                structure: year.structure,
            }
        });

        if (year.semesters) {
             for (const sem of year.semesters) {
                 await prisma.semester.upsert({
                     where: { id: sem.id },
                     update: { label: sem.label, yearId: year.id },
                     create: { id: sem.id, label: sem.label, yearId: year.id }
                 });

                 for (const mod of sem.modules) {
                     await prisma.module.upsert({
                         where: { id: mod.id },
                         update: { title: mod.title, isShared: !!mod.isShared, isStandalone: false, semesters: { connect: { id: sem.id } } },
                         create: {
                             id: mod.id,
                             title: mod.title,
                             isShared: !!mod.isShared,
                             isStandalone: false,
                             semesters: { connect: { id: sem.id } }
                         }
                     });

                     for (const lesson of mod.lessons) {
                         await prisma.lesson.upsert({
                             where: { id_moduleId: { id: lesson.id, moduleId: mod.id } },
                             update: { title: lesson.title, driveUrl: lesson.driveUrl },
                             create: { id: lesson.id, title: lesson.title, driveUrl: lesson.driveUrl, moduleId: mod.id }
                         });
                     }

                     for (const exam of mod.exams) {
                         await prisma.exam.upsert({
                             where: { id_moduleId: { id: exam.id, moduleId: mod.id } },
                             update: { title: exam.title, driveUrl: exam.driveUrl },
                             create: { id: exam.id, title: exam.title, driveUrl: exam.driveUrl, moduleId: mod.id }
                         });
                     }
                 }
             }
        }

        if (year.standaloneModules) {
            for (const mod of year.standaloneModules) {
                 await prisma.module.upsert({
                     where: { id: mod.id },
                     update: { title: mod.title, standaloneYearId: year.id },
                     create: {
                         id: mod.id,
                         title: mod.title,
                         isShared: false,
                         isStandalone: true,
                         standaloneYearId: year.id
                     }
                 });

                 for (const lesson of mod.lessons) {
                     await prisma.lesson.upsert({
                         where: { id_moduleId: { id: lesson.id, moduleId: mod.id } },
                         update: { title: lesson.title, driveUrl: lesson.driveUrl },
                         create: { id: lesson.id, title: lesson.title, driveUrl: lesson.driveUrl, moduleId: mod.id }
                     });
                 }
                 for (const exam of mod.exams) {
                     await prisma.exam.upsert({
                         where: { id_moduleId: { id: exam.id, moduleId: mod.id } },
                         update: { title: exam.title, driveUrl: exam.driveUrl },
                         create: { id: exam.id, title: exam.title, driveUrl: exam.driveUrl, moduleId: mod.id }
                     });
                 }
            }
        }

        if (year.units) {
             for (const unit of year.units) {
                 await prisma.unit.upsert({
                     where: { id: unit.id },
                     update: { label: unit.label, yearId: year.id },
                     create: { id: unit.id, label: unit.label, yearId: year.id }
                 });

                 for (const mod of unit.modules) {
                     await prisma.module.upsert({
                         where: { id: mod.id },
                         update: { title: mod.title, unitId: unit.id },
                         create: {
                             id: mod.id,
                             title: mod.title,
                             isShared: false,
                             isStandalone: false,
                             unitId: unit.id
                         }
                     });

                     for (const lesson of mod.lessons) {
                         await prisma.lesson.upsert({
                             where: { id_moduleId: { id: lesson.id, moduleId: mod.id } },
                             update: { title: lesson.title, driveUrl: lesson.driveUrl },
                             create: { id: lesson.id, title: lesson.title, driveUrl: lesson.driveUrl, moduleId: mod.id }
                         });
                     }
                     for (const exam of mod.exams) {
                         await prisma.exam.upsert({
                             where: { id_moduleId: { id: exam.id, moduleId: mod.id } },
                             update: { title: exam.title, driveUrl: exam.driveUrl },
                             create: { id: exam.id, title: exam.title, driveUrl: exam.driveUrl, moduleId: mod.id }
                         });
                     }
                 }
             }
        }
    }
    
    res.json({ message: "Sync successful" });
});

module.exports = { getAcademicData, syncAcademicData };
"""

for file_path, content in files.items():
    full_path = os.path.join("/home/ahmedhack/Desktop/unev", file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Created {file_path}")
