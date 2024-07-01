import { ConflictException, UsePipes } from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ZodValidationPipe } from '@/pipe/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const createPatientBodySchema = z.object({
	name: z.string(),
	cpf: z.string(),
	dateBirth: z.string().date(),
});

type CreatePatientBodySchema = z.infer<typeof createPatientBodySchema>;

@Controller()
export class CreatePatientController {
	constructor(private prisma: PrismaService) {}

	@Post('/patient')
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createPatientBodySchema))
	async handle(@Body() body: CreatePatientBodySchema) {
		const { name, cpf, dateBirth } = body;

		const userWithSameCpf = await this.prisma.patient.findUnique({
			where: {
				cpf,
			},
		});

		if (userWithSameCpf) {
			throw new ConflictException('Patient with same cpf already exists.');
		}

		await this.prisma.patient.create({
			data: {
				name,
				cpf,
				dateBirth,
			},
		});
	}
}
