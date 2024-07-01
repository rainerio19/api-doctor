import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create Patient (E2E)', () => {
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
	test('[POST] /patient', async () => {
		const response = await request(app.getHttpServer()).post('/patient').send({
			name: 'John Doe',
			cpf: '654789123',
			dateBirth: '2000-03-19T00:00:00.000Z',
		});

		expect(response.statusCode).toBe(201);

		const patientOnDatabase = await prisma.patient.findUnique({
			where: {
				cpf: '654789123',
			},
		});

		expect(patientOnDatabase).toBeTruthy();
	});
});
