import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { CreatePatientController } from './controllers/patient/create-patient.controller';
import { CreateDoctorController } from './controllers/doctor/create-doctor.controller';
import { FetchAllDoctorsController } from './controllers/doctor/fetch-all-doctors.controller';
import { CreateConsultController } from './controllers/consult/create-consult.controller';
import { envSchema } from './env';

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
	],
	controllers: [
		CreatePatientController,
		CreateDoctorController,
		CreateConsultController,
		FetchAllDoctorsController,
	],
	providers: [PrismaService],
})
export class AppModule {}
