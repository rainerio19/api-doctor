import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Fetch All Doctor (E2E)', () => {
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
	test('[GET] /doctors', async () => {
		await prisma.doctor.createMany({
			data: [
				{
					name: 'Doctor 1',
					crm: '1111',
					specialty: 'teste speciality1',
				},
				{
					name: 'Doctor 2',
					crm: '2222',
					specialty: 'teste speciality2',
				},
				{
					name: 'Doctor 3',
					crm: '33333',
					specialty: 'teste speciality3',
				},
			],
		});

		const response = await request(app.getHttpServer()).get('/doctors').send();
		console.log(response.body);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			doctors: [
				expect.objectContaining({ name: 'Doctor 3' }),
				expect.objectContaining({ name: 'Doctor 2' }),
				expect.objectContaining({ name: 'Doctor 1' }),
			],
		});
	});
});
