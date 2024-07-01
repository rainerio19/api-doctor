import { Get, Query } from '@nestjs/common';
import { Controller, HttpCode } from '@nestjs/common';
import { ZodValidationPipe } from '@/pipe/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller()
export class FetchAllDoctorsController {
	constructor(private prisma: PrismaService) {}

	@Get('/doctors')
	@HttpCode(200)
	async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
		const perPage = 10;

		const doctors = await this.prisma.doctor.findMany({
			take: perPage,
			skip: (page - 1) * perPage,
			orderBy: {
				name: 'desc',
			},
		});

		return { doctors };
	}
}
