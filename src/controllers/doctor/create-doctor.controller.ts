import {
	ConflictException,
	PreconditionFailedException,
	UsePipes,
} from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ZodValidationPipe } from '@/pipe/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const createDoctorBodySchema = z.object({
	name: z.string(),
	crm: z.string(),
	specialty: z.string(),
	startExpedient: z.string().time(),
	endExpedient: z.string().time(),
});

type CreateDoctorBodySchema = z.infer<typeof createDoctorBodySchema>;

@Controller()
export class CreateDoctorController {
	constructor(private prisma: PrismaService) {}

	@Post('/doctor')
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createDoctorBodySchema))
	async handle(@Body() body: CreateDoctorBodySchema) {
		const { name, crm, specialty, startExpedient, endExpedient } = body;

		const startExpedientObj = new Date(`2024-01-01T${startExpedient}Z`);
		const endExpedientObj = new Date(`2024-01-01T${endExpedient}Z`);

		if (startExpedientObj >= endExpedientObj) {
			throw new PreconditionFailedException(
				'O final do expediente não pode ser antes do inicio do expediente!',
			);
		}

		const userWithSameCrm = await this.prisma.doctor.findUnique({
			where: {
				crm,
			},
		});

		if (userWithSameCrm) {
			throw new ConflictException('Doctor with same crm already exists.');
		}

		await this.prisma.doctor.create({
			data: {
				name,
				crm,
				specialty,
				startExpedient,
				endExpedient,
			},
		});
	}
}
