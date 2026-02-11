import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Create job categories
  const categories = await Promise.all([
    prisma.jobCategory.upsert({
      where: { code: '1' },
      update: {},
      create: {
        code: '1',
        nameEn: 'Managers',
        nameFr: 'Directeurs et cadres',
        namePt: 'Diretores e gerentes',
        descriptionEn: 'Plan and coordinate organizational activities',
        descriptionFr: 'Planifier et coordonner les activités organisationnelles',
        descriptionPt: 'Planejar e coordenar atividades organizacionais'
      }
    }),
    prisma.jobCategory.upsert({
      where: { code: '2' },
      update: {},
      create: {
        code: '2',
        nameEn: 'Professionals',
        nameFr: 'Professions intellectuelles',
        namePt: 'Profissionais',
        descriptionEn: 'Apply scientific and technical knowledge',
        descriptionFr: 'Appliquer des connaissances scientifiques et techniques',
        descriptionPt: 'Aplicar conhecimentos científicos e técnicos'
      }
    }),
    prisma.jobCategory.upsert({
      where: { code: '6' },
      update: {},
      create: {
        code: '6',
        nameEn: 'Agricultural Workers',
        nameFr: 'Agriculteurs',
        namePt: 'Agricultores',
        descriptionEn: 'Grow crops and raise livestock',
        descriptionFr: 'Cultiver et élever du bétail',
        descriptionPt: 'Cultivar e criar gado'
      }
    }),
    prisma.jobCategory.upsert({
      where: { code: '7' },
      update: {},
      create: {
        code: '7',
        nameEn: 'Craft Workers',
        nameFr: 'Artisans',
        namePt: 'Artesãos',
        descriptionEn: 'Construct and repair using specialized skills',
        descriptionFr: 'Construire et réparer avec des compétences spécialisées',
        descriptionPt: 'Construir e reparar com habilidades especializadas'
      }
    }),
    prisma.jobCategory.upsert({
      where: { code: '5' },
      update: {},
      create: {
        code: '5',
        nameEn: 'Service Workers',
        nameFr: 'Personnel des services',
        namePt: 'Trabalhadores de serviços',
        descriptionEn: 'Provide services and sell goods',
        descriptionFr: 'Fournir des services et vendre des biens',
        descriptionPt: 'Fornecer serviços e vender mercadorias'
      }
    })
  ])

  console.log(`✅ Created ${categories.length} job categories`)

  // Sample jobs (will create more via separate script)
  const sampleJobs = [
    { code: '1111', categoryCode: '1', titleEn: 'Chief Executive', titleFr: 'Directeur général', titlePt: 'Diretor executivo', isInformal: false, isEmerging: false, isAgri: false },
    { code: '2512', categoryCode: '2', titleEn: 'Software Developer', titleFr: 'Développeur logiciel', titlePt: 'Desenvolvedor de software', isInformal: false, isEmerging: true, isAgri: false },
    { code: '6111', categoryCode: '6', titleEn: 'Field Crop Farmer', titleFr: 'Agriculteur', titlePt: 'Agricultor', isInformal: true, isEmerging: false, isAgri: true },
    { code: '7115', categoryCode: '7', titleEn: 'Carpenter', titleFr: 'Charpentier', titlePt: 'Carpinteiro', isInformal: true, isEmerging: false, isAgri: false },
    { code: '5120', categoryCode: '5', titleEn: 'Street Vendor', titleFr: 'Vendeur ambulant', titlePt: 'Vendedor ambulante', isInformal: true, isEmerging: false, isAgri: false }
  ]

  const cat1 = categories.find(c => c.code === '1')!
  const cat2 = categories.find(c => c.code === '2')!
  const cat5 = categories.find(c => c.code === '5')!
  const cat6 = categories.find(c => c.code === '6')!
  const cat7 = categories.find(c => c.code === '7')!

  const jobs = await Promise.all(
    sampleJobs.map(job => {
      const categoryId = job.categoryCode === '1' ? cat1.id :
                        job.categoryCode === '2' ? cat2.id :
                        job.categoryCode === '5' ? cat5.id :
                        job.categoryCode === '6' ? cat6.id : cat7.id
      
      return prisma.job.upsert({
        where: { code: job.code },
        update: {},
        create: {
          code: job.code,
          titleEn: job.titleEn,
          titleFr: job.titleFr,
          titlePt: job.titlePt,
          categoryId,
          isInformal: job.isInformal,
          isEmerging: job.isEmerging,
          isAgri: job.isAgri
        }
      })
    })
  )

  console.log(`✅ Created ${jobs.length} sample jobs`)
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
