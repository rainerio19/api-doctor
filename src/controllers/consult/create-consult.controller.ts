import { ConflictException, UsePipes } from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ZodValidationPipe } from '@/pipe/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';
import { isHoliday } from '@/utils/holidays';
import { isAfter, isBefore, parse } from 'date-fns';

const createConsultBodySchema = z.object({
	doctorId: z.string(),
	patientId: z.string(),
	consultationDate: z.string().datetime(),
	duration: z.number().min(5).max(60), // duração mínima de 05 minutos e máxima de 60 minutos
});

type CreateConsultBodySchema = z.infer<typeof createConsultBodySchema>;

@Controller()
export class CreateConsultController {
	constructor(private prisma: PrismaService) {}

	@Post('/consult')
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createConsultBodySchema))
	async handle(@Body() body: CreateConsultBodySchema) {
		const { doctorId, patientId, consultationDate, duration } = body;

		const consultationDateObj = new Date(consultationDate);
		console.log(consultationDateObj);

		const consultationEndDateObj = new Date(
			consultationDateObj.getTime() + duration * 60000,
		); // Calcula o horário de término da consulta
		console.log(consultationEndDateObj);

		if (isHoliday(consultationDateObj)) {
			throw new ConflictException(
				'Consultas não podem serem marcadas em feriados nacionais',
			);
		} // Verificar se a data da consulta é um feriado

		const doctor = await this.prisma.doctor.findUnique({
			where: { id: doctorId },
		});

		if (!doctor) {
			throw new ConflictException('O Doutor não está cadastrado no sistema.');
		}

		const consultationTime = `${consultationDateObj.getUTCHours()}:${consultationDateObj.getUTCMinutes()}:${consultationDateObj.getUTCSeconds()}`;

		const startExpedientTime = parse(
			doctor.startExpedient,
			'HH:mm:ss',
			new Date(),
		);
		const endExpedientTime = parse(doctor.endExpedient, 'HH:mm:ss', new Date());
		const consultationTimeObj = parse(consultationTime, 'HH:mm:ss', new Date());

		// Comparar os horários
		const isWithinExpedient =
			isAfter(consultationTimeObj, startExpedientTime) &&
			isBefore(consultationTimeObj, endExpedientTime);

		if (!isWithinExpedient) {
			throw new ConflictException('Está forá do expediente do Doutor.');
		}

		const existingConsult = await this.prisma.consult.findFirst({
			where: {
				consultationDate: consultationDateObj,
			},
		});

		if (existingConsult) {
			throw new ConflictException(
				'O Doutor já possui uma consulta marcada nesse horario.',
			);
		}

		await this.prisma.consult.create({
			data: {
				consultationDate: consultationDateObj,
				doctorId,
				patientId,
				duration,
			},
		});
	}
}
