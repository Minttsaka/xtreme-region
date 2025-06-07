// prisma/seed.ts or prisma/seed.js

import { Level, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const levels = ['PRIMARY', 'SECONDARY', 'TERTIARY'];

//   for (const level of levels) {
//     await prisma.educationLevel.create({
//       data: {
//         name: level as Level,
//       },
//     });
//   }

//   console.log('Seeding completed.');


 const primaryLevel = await prisma.educationLevel.findFirst({
    where: {
      name: 'PRIMARY',
    }
  });
  
//   const secondaryLevel = await prisma.educationLevel.findFirst({
//     where: {
//       name: 'SECONDARY',
//     }
//   });
  
//   const tertiaryLevel = await prisma.educationLevel.findFirst({
//     where: {
//       name: 'TERTIARY',
//     }
//   });
  
//   console.log('Education levels created:', { primaryLevel, secondaryLevel, tertiaryLevel });
  
  // Create classes for primary level (1-8)
  // console.log('Creating primary classes...');
  // for (let i = 1; i <= 8; i++) {
  //   const newClass = await prisma.class.create({
  //     data: {
  //       name: i,
  //       educationLevel:{
  //         connect:{
  //           id: primaryLevel?.id
  //         }
  //       },
  //     }
  //   });

  // }
  
  // // Create classes for secondary level (9-12)
  // console.log('Creating secondary classes...');

  // for (let i = 1; i <= 4; i++) {
  //   const newClass = await prisma.class.create({
  //     data: {
  //       name: i,
  //       educationLevel:{
  //         connect:{
  //           id: secondaryLevel?.id
  //         }
  //       },
    //   }
    // });

//     const subjects = [
//   { name: 'Mathematics', description: 'Basic math concepts' },
//   { name: 'English', description: 'Reading and writing' },
//   { name: 'Science', description: 'Fundamentals of science' },
//   { name: 'Social Studies', description: 'Community and culture' },
//   { name: 'Religious Education', description: 'Spiritual and moral teachings' },
//   { name: 'Creative Arts', description: 'Art and crafts' },
//   { name: 'Physical Education', description: 'Health and physical fitness' },
//   { name: 'ICT', description: 'Basic computer literacy' },
//   { name: 'Kiswahili', description: 'Swahili language basics' },
//   { name: 'Life Skills', description: 'Personal development' },
//   { name: 'Environmental Activities', description: 'Nature and conservation' },
//   { name: 'Music', description: 'Basic music education' },
// ];

// Replace with a valid user ID from your User collection
const userId = "6840e8c40bcac0c49ab59f8d"

// console.log('Creating 12 subjects and linking them to primary classes...');

// for (const subjectData of subjects) {
//   const subject = await prisma.subject.create({
//     data: {
//       name: subjectData.name,
//       description: subjectData.description,
//       creator:{
//           connect:{
//             id: userId
//           }
//         },
//     },
//   });


//  const primaryClasses = await prisma.class.findMany({
//     where: {
//       educationLevelId: primaryLevel?.id,
//     }
//   });

//   for (const cls of primaryClasses) {
//     await prisma.subjectToClass.create({
//       data: {
//         subject:{
//           connect:{
//             id:subject.id
//           }
//         } ,
//         class:{
//           connect:{
//             id:cls.id
//           }
//         } ,
//       },
//     });
//   }
// }

  

const customCourses = [
  {
    subjectName: 'Mathematics',
    className: 1,
    courses: [
      { title: 'Counting Basics', content: 'Introduction to numbers and counting.' },
      { title: 'Shapes and Sizes', content: 'Understanding different shapes.' },
    ],
  },
  {
    subjectName: 'Science',
    className: 1,
    courses: [
      { title: 'Living vs Non-living', content: 'Basics of living things.' },
    ],
  },
  {
    subjectName: 'English',
    className: 2,
    courses: [
      { title: 'Simple Sentences', content: 'Forming basic sentences.' },
      { title: 'Nouns and Verbs', content: 'Grammar fundamentals.' },
    ],
  },
  // Add more manually...
];


const userEmail = 'ebs21-mtsaka@mubas.ac.mw';

// Step 1: Fetch all SubjectToClass records and build a map
const subjectToClassMap = await prisma.subjectToClass.findMany({
  include: {
    subject: true,
    class: true,
  },
});

// Step 2: Helper to find SubjectToClass entry
function findSubjectClassId(subjectName: string, className: number | string) {
  const match = subjectToClassMap.find(
    (entry) =>
      entry.subject?.name === subjectName &&
      entry.class?.name?.toString() === className.toString()
  );
  return match?.id || null;
}

// Step 3: Loop through custom data and create courses
for (const entry of customCourses) {
  const subjectToClassId = findSubjectClassId(entry.subjectName, entry.className);

  if (!subjectToClassId) {
    console.warn(`SubjectToClass not found for ${entry.subjectName} class ${entry.className}`);
    continue;
  }

  for (const course of entry.courses) {
    await prisma.course.create({
      data: {
        title: course.title,
        content: course.content || '',
        userId,
        userEmail,
        subject:{
          connect:{
            id:subjectToClassId
          }
        },
      },
    });

  }
}


  
  // Create sample schools
  
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
