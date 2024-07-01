import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create Doctor (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		await app.init();
	});
	test('[POST] /doctor', async () => {
		const response = await request(app.getHttpServer()).post('/doctor').send({
			name: 'John Doe',
			crm: '654789123',
			specialty: 'pediatry',
		});

		expect(response.statusCode).toBe(201);

		const doctorOnDatabase = await prisma.doctor.findUnique({
			where: {
				crm: '654789123',
			},
		});

		expect(doctorOnDatabase).toBeTruthy();
	});
});
