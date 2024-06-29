import { ConflictException, UsePipes } from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipe/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const createDoctorBodySchema = z.object({
	name: z.string(),
	crm: z.string(),
	specialty: z.string(),
});

type CreateDoctorBodySchema = z.infer<typeof createDoctorBodySchema>;

@Controller()
export class CreateDoctorController {
	constructor(private prisma: PrismaService) {}

	@Post('/doctor')
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createDoctorBodySchema))
	async handle(@Body() body: CreateDoctorBodySchema) {
		const { name, crm, specialty } = body;

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
			},
		});
	}
}
